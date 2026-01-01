import express from 'express'
import { generatePDF, generateWordDocument } from '../services/exportService.js'
import { getSummaryById } from '../services/summaries.js'
import { requireAuth } from '../middleware/auth.js'
import { Packer } from 'docx'

const router = express.Router()

router.get('/pdf/:id', requireAuth, async (req, res) => {
	try {
		const { id } = req.params
		const summary = await getSummaryById(id, req.user.id)

		if (!summary) {
			return res.status(404).json({ error: 'Summary not found' })
		}

		const summaryData = {
			meetingTitle: summary.meeting_title,
			meetingDate: summary.meeting_date,
			meetingType: summary.meeting_type,
			participants: summary.participants || [],
			location: summary.location,
			tags: summary.tags || [],
			summary: summary.summary,
			actionItems: summary.action_items || [],
			decisions: summary.decisions || [],
			deadlines: summary.deadlines || [],
			extractedParticipants: summary.extracted_participants || [],
		}

		const pdfBytes = await generatePDF(summaryData)
		const fileName = `${summary.meeting_title || 'meeting-notes'}-${id}.pdf`.replace(
			/[^a-z0-9.-]/gi,
			'-'
		)

		res.setHeader('Content-Type', 'application/pdf')
		res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
		res.send(pdfBytes)
	} catch (error) {
		console.error('PDF export error:', error)
		res.status(500).json({
			error: 'Failed to generate PDF',
			details: error.message,
		})
	}
})

router.get('/word/:id', requireAuth, async (req, res) => {
	try {
		const { id } = req.params
		const summary = await getSummaryById(id, req.user.id)

		if (!summary) {
			return res.status(404).json({ error: 'Summary not found' })
		}

		const summaryData = {
			meetingTitle: summary.meeting_title,
			meetingDate: summary.meeting_date,
			meetingType: summary.meeting_type,
			participants: summary.participants || [],
			location: summary.location,
			tags: summary.tags || [],
			summary: summary.summary,
			actionItems: summary.action_items || [],
			decisions: summary.decisions || [],
			deadlines: summary.deadlines || [],
			extractedParticipants: summary.extracted_participants || [],
		}

		const doc = generateWordDocument(summaryData)
		const buffer = await Packer.toBuffer(doc)
		const fileName = `${summary.meeting_title || 'meeting-notes'}-${id}.docx`.replace(
			/[^a-z0-9.-]/gi,
			'-'
		)

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		)
		res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
		res.setHeader('Content-Length', buffer.length)
		res.send(buffer)
	} catch (error) {
		console.error('Word export error:', error)
		res.status(500).json({
			error: 'Failed to generate Word document',
			details: error.message,
		})
	}
})

export default router

