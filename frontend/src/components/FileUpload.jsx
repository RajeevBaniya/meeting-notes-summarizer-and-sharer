import { useState } from 'react'
import api from '../lib/api'
import { Button } from './ui/button'

function FileUpload({ onFileUpload, transcript }) {
	const [isDragging, setIsDragging] = useState(false)
	const [isUploading, setIsUploading] = useState(false)

	const handleFileUpload = async (file) => {
		if (!file || file.type !== 'text/plain') {
			alert('Please upload a .txt file')
			return
		}

		setIsUploading(true)
		const formData = new FormData()
		formData.append('transcript', file)

		try {
			const response = await api.post('/api/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			})
			onFileUpload(response.data.content)
		} catch (error) {
			alert('Error uploading file: ' + error.message)
		} finally {
			setIsUploading(false)
		}
	}

	const handleDrop = (e) => {
		e.preventDefault()
		setIsDragging(false)
		const file = e.dataTransfer.files[0]
		handleFileUpload(file)
	}

	const handleFileInput = (e) => {
		const file = e.target.files[0]
		handleFileUpload(file)
	}

	return (
		<div className="card">
			<h2 className="section-title mb-4">Upload Meeting Transcript</h2>

			<div
				className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
					isDragging
						? 'border-emerald-400 bg-emerald-500/10'
						: 'border-slate-600 bg-slate-800/30'
				}`}
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}
				onDragEnter={() => setIsDragging(true)}
				onDragLeave={() => setIsDragging(false)}
			>
				{isUploading ? (
					<div className="text-emerald-400">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-2"></div>
						Uploading...
					</div>
				) : (
					<>
						<div className="mb-4">
							<svg className="mx-auto h-12 w-12 text-emerald-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
								<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
						<p className="text-lg mb-2 text-slate-300">Drop your .txt file here, or</p>
						<div>
							<input
								type="file"
								accept=".txt"
								onChange={handleFileInput}
								className="hidden"
								id="file-input"
							/>
							<Button asChild>
								<label htmlFor="file-input" className="cursor-pointer">
									Browse Files
								</label>
							</Button>
						</div>
						<p className="text-sm text-slate-500 mt-2">Only .txt files up to 5MB</p>
					</>
				)}
			</div>

			{transcript && (
				<div className="transcript-preview">
					<p className="text-sm text-slate-400 mb-2">Transcript preview:</p>
					<p className="text-sm text-slate-300">
						{transcript.substring(0, 300)}...
					</p>
				</div>
			)}
		</div>
	)
}

export default FileUpload
