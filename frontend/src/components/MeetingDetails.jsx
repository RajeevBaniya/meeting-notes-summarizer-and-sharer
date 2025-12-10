import { useState } from 'react'
import { Button } from './ui/button'

const MEETING_TYPES = [
	{ value: '', label: 'Select type...' },
	{ value: 'team', label: 'Team Meeting' },
	{ value: 'one-on-one', label: '1-on-1' },
	{ value: 'client', label: 'Client Meeting' },
	{ value: 'standup', label: 'Standup' },
	{ value: 'project-review', label: 'Project Review' },
	{ value: 'brainstorm', label: 'Brainstorming' },
	{ value: 'interview', label: 'Interview' },
	{ value: 'training', label: 'Training' },
	{ value: 'other', label: 'Other' }
]

function MeetingDetails({ meetingData, onUpdate }) {
	const [participantInput, setParticipantInput] = useState('')

	const handleChange = (field, value) => {
		onUpdate({ ...meetingData, [field]: value })
	}

	const addParticipant = () => {
		const trimmed = participantInput.trim()
		if (!trimmed) return
		if (meetingData.participants.includes(trimmed)) return

		onUpdate({
			...meetingData,
			participants: [...meetingData.participants, trimmed]
		})
		setParticipantInput('')
	}

	const removeParticipant = (name) => {
		onUpdate({
			...meetingData,
			participants: meetingData.participants.filter(p => p !== name)
		})
	}

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			addParticipant()
		}
	}

	return (
		<div className="card">
			<h2 className="section-title mb-4">Meeting Details</h2>

			<div className="space-y-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Meeting Title
						</label>
						<input
							type="text"
							value={meetingData.meetingTitle}
							onChange={(e) => handleChange('meetingTitle', e.target.value)}
							placeholder="e.g., Weekly Team Sync"
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Meeting Type
						</label>
						<select
							value={meetingData.meetingType}
							onChange={(e) => handleChange('meetingType', e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
						>
							{MEETING_TYPES.map(type => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Meeting Date & Time
						</label>
						<input
							type="datetime-local"
							value={meetingData.meetingDate}
							onChange={(e) => handleChange('meetingDate', e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Location / Meeting Link
						</label>
						<input
							type="text"
							value={meetingData.location}
							onChange={(e) => handleChange('location', e.target.value)}
							placeholder="e.g., Conference Room A or Zoom link"
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Participants
					</label>
					<div className="flex gap-2">
						<input
							type="text"
							value={participantInput}
							onChange={(e) => setParticipantInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Add participant name"
							className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
						/>
						<Button
							type="button"
							variant="outline"
							onClick={addParticipant}
							disabled={!participantInput.trim()}
						>
							Add
						</Button>
					</div>

					{meetingData.participants.length > 0 && (
						<div className="flex flex-wrap gap-2 mt-3">
							{meetingData.participants.map((name, index) => (
								<span
									key={index}
									className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
								>
									{name}
									<button
										type="button"
										onClick={() => removeParticipant(name)}
										className="ml-1 text-indigo-400 hover:text-indigo-600 focus:outline-none"
									>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</span>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default MeetingDetails

