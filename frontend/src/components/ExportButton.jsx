import { useState } from 'react'
import { Button } from './ui/button'
import api from '../lib/api'

function ExportButton({ summaryId, fileName, variant = 'outline' }) {
	const [isExporting, setIsExporting] = useState(false)
	const [exportType, setExportType] = useState(null)

	const handleExport = async (type) => {
		if (!summaryId) {
			alert('No summary available to export')
			return
		}

		setIsExporting(true)
		setExportType(type)

		try {
			const response = await api.get(`/api/export/${type}/${summaryId}`, {
				responseType: 'blob',
			})

			const contentType = response.headers['content-type'] || 
				(type === 'pdf'
					? 'application/pdf'
					: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')

			const blob = new Blob([response.data], {
				type: contentType,
			})

			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url

			const contentDisposition = response.headers['content-disposition']
			const fileExtension = type === 'pdf' ? 'pdf' : 'docx'
			let downloadFileName = fileName || `meeting-notes-${summaryId}.${fileExtension}`

			if (contentDisposition) {
				const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
				if (fileNameMatch) {
					downloadFileName = fileNameMatch[1]
				}
			} else {
				if (!downloadFileName.endsWith(`.${fileExtension}`)) {
					downloadFileName = downloadFileName.replace(/\.[^.]+$/, '') + `.${fileExtension}`
				}
			}

			link.download = downloadFileName
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			const message = error.response?.data?.error || error.message
			alert(`Failed to export ${type.toUpperCase()}: ${message}`)
		} finally {
			setIsExporting(false)
			setExportType(null)
		}
	}

	return (
		<div className="flex gap-2">
			<Button
				variant={variant}
				size="sm"
				onClick={() => handleExport('pdf')}
				disabled={isExporting || !summaryId}
				className="flex items-center gap-2"
			>
				{isExporting && exportType === 'pdf' ? (
					<>
						<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
						<span>Exporting...</span>
					</>
				) : (
					<>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
						<span>PDF</span>
					</>
				)}
			</Button>

			<Button
				variant={variant}
				size="sm"
				onClick={() => handleExport('word')}
				disabled={isExporting || !summaryId}
				className="flex items-center gap-2"
			>
				{isExporting && exportType === 'word' ? (
					<>
						<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
						<span>Exporting...</span>
					</>
				) : (
					<>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<span>Word</span>
					</>
				)}
			</Button>
		</div>
	)
}

export default ExportButton

