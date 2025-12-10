import { useState } from 'react'
import api from '../lib/api'
import { Button } from './ui/button'

const PRESET_INSTRUCTIONS = [
	'Summarize in bullet points for executives',
	'Highlight only action items and next steps',
	'Create a brief overview with key decisions',
	'List all participants and their main contributions',
	'Extract important dates, deadlines and deliverables'
]

function SummaryGenerator({
	transcript,
	setSummary,
	setStructured,
	isLoading,
	setIsLoading,
	meetingData
}) {
	const [instruction, setInstruction] = useState('')
	const [error, setError] = useState('')

	const generateSummary = async () => {
		if (!transcript.trim()) {
			setError('Please upload a transcript first')
			return
		}

		if (!instruction.trim()) {
			setError('Please provide an instruction')
			return
		}

		setIsLoading(true)
		setError('')

		try {
			const response = await api.post('/api/summary/generate', {
				transcript,
				instruction,
				title: new Date().toLocaleString(),
				meetingTitle: meetingData.meetingTitle || null,
				meetingDate: meetingData.meetingDate || null,
				meetingType: meetingData.meetingType || null,
				participants: meetingData.participants || [],
				location: meetingData.location || null,
				extractStructured: true
			})

			setSummary(response.data.summary)

			if (response.data.structured) {
				setStructured(response.data.structured)
			}
		} catch (err) {
			const message = err.response?.data?.error || err.message
			setError(`Failed to generate summary: ${message}`)
		} finally {
			setIsLoading(false)
		}
	}

	const selectPreset = (preset) => {
		setInstruction(preset)
	}

	return (
		<div className="card">
			<h2 className="section-title mb-4">Generate Summary</h2>

			<div className="space-y-4 flex flex-col items-center">
				<div className="w-full">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Custom Instruction
					</label>
					<textarea
						value={instruction}
						onChange={(e) => setInstruction(e.target.value)}
						placeholder="e.g., Summarize in bullet points for executives"
						className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
						rows="3"
					/>
				</div>

				<div className="w-full">
					<p className="text-sm font-medium text-gray-700 mb-2">Quick options:</p>
					<div className="flex flex-wrap gap-2 justify-center">
						{PRESET_INSTRUCTIONS.map((preset, index) => (
							<Button
								key={index}
								variant="outline"
								size="sm"
								onClick={() => selectPreset(preset)}
							>
								{preset}
							</Button>
						))}
					</div>
				</div>

				{error && (
					<div className="p-3 bg-red-50 border border-red-200 rounded-md w-full">
						<p className="text-red-600 text-sm">{error}</p>
					</div>
				)}

				<Button
					onClick={generateSummary}
					disabled={isLoading || !transcript.trim() || !instruction.trim()}
					className="w-auto px-12"
					size="default"
				>
					{isLoading ? (
						<div className="flex items-center justify-center">
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
							Generating Summary...
						</div>
					) : (
						'Generate Summary'
					)}
				</Button>
			</div>
		</div>
	)
}

export default SummaryGenerator
