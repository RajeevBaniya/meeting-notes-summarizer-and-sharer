import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import {
	extractText,
	cleanupFile,
	SUPPORTED_EXTENSIONS,
	MAX_FILE_SIZE
} from '../services/fileExtractor.js'

const router = express.Router()

const ALLOWED_MIME_TYPES = Object.freeze([
	'text/plain',
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
])

function ensureUploadDir() {
	const uploadDir = 'uploads'
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true })
	}
	return uploadDir
}

function generateFilename(originalname) {
	const timestamp = Date.now()
	const ext = path.extname(originalname)
	const baseName = path.basename(originalname, ext)
	const safeName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_')
	return `${timestamp}-${safeName}${ext}`
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = ensureUploadDir()
		cb(null, uploadDir)
	},
	filename: (req, file, cb) => {
		const filename = generateFilename(file.originalname)
		cb(null, filename)
	}
})

function fileFilter(req, file, cb) {
	const ext = path.extname(file.originalname).toLowerCase()
	const isValidExt = SUPPORTED_EXTENSIONS.includes(ext)
	const isValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype)

	if (isValidExt || isValidMime) {
		cb(null, true)
	} else {
		cb(new Error(`Unsupported file type. Allowed: ${SUPPORTED_EXTENSIONS.join(', ')}`), false)
	}
}

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: MAX_FILE_SIZE }
})

function getFileType(filename) {
	const ext = path.extname(filename).toLowerCase()
	const typeMap = {
		'.txt': 'text',
		'.pdf': 'pdf',
		'.docx': 'docx'
	}
	return typeMap[ext] || 'unknown'
}

router.post('/', upload.single('transcript'), async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded' })
	}

	const filePath = req.file.path

	try {
		const content = await extractText(req.file)
		const fileType = getFileType(req.file.originalname)

		await cleanupFile(filePath)

		res.json({
			message: 'File uploaded successfully',
			content,
			fileType,
			originalName: req.file.originalname
		})
	} catch (error) {
		console.error('File extraction error:', error)
		await cleanupFile(filePath)

		const statusCode = error.message.includes('Unsupported') ? 400 : 500
		res.status(statusCode).json({ error: error.message })
	}
})

router.use((error, req, res, next) => {
	if (error instanceof multer.MulterError) {
		if (error.code === 'LIMIT_FILE_SIZE') {
			return res.status(400).json({
				error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
			})
		}
		return res.status(400).json({ error: error.message })
	}

	if (error) {
		return res.status(400).json({ error: error.message })
	}

	next()
})

export default router
