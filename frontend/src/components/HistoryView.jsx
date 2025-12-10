import { useState, useEffect } from 'react'
import api from '../lib/api'
import { Button } from './ui/button'
import ConfirmDialog from './ui/confirm-dialog'

const MEETING_TYPE_LABELS = {
	'team': 'Team Meeting',
	'one-on-one': '1-on-1',
	'client': 'Client Meeting',
	'standup': 'Standup',
	'project-review': 'Project Review',
	'brainstorm': 'Brainstorming',
	'interview': 'Interview',
	'training': 'Training',
	'other': 'Other'
}

function formatDate(dateString) {
	if (!dateString) return null
	const date = new Date(dateString)
	if (isNaN(date.getTime())) return null
	return date.toLocaleString()
}

function MeetingTypeBadge({ type }) {
	if (!type) return null
	const label = MEETING_TYPE_LABELS[type] || type
	return (
		<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
			{label}
		</span>
	)
}

function ParticipantsBadge({ participants }) {
	if (!participants || participants.length === 0) return null
	const displayCount = Math.min(participants.length, 2)
	const remaining = participants.length - displayCount

	return (
		<span className="inline-flex items-center gap-1 text-xs text-slate-400">
			<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
			{participants.slice(0, displayCount).join(', ')}
			{remaining > 0 && ` +${remaining}`}
		</span>
	)
}

function ActionItemsCount({ count }) {
	if (!count || count === 0) return null
	return (
		<span className="inline-flex items-center gap-1 text-xs text-orange-400">
			<span>📋</span>
			{count} action{count !== 1 ? 's' : ''}
		</span>
	)
}

function HistoryView({ onSelectSummary }) {
	const [summaries, setSummaries] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [pendingDeleteId, setPendingDeleteId] = useState(null)

	useEffect(() => {
		const fetchSummaries = async () => {
			try {
				setIsLoading(true)
				const response = await api.get('/api/summaries')
				setSummaries(response.data.items || [])
			} catch (err) {
				console.error('Error fetching summaries:', err)
				setError('Failed to load your summary history')
			} finally {
				setIsLoading(false)
			}
		}

		fetchSummaries()
	}, [])

	const requestDelete = (id) => {
		setPendingDeleteId(id)
	}

	const confirmDelete = async () => {
		if (!pendingDeleteId) return
		try {
			await api.delete(`/api/summaries/${pendingDeleteId}`)
			setSummaries(summaries.filter(s => s.id !== pendingDeleteId))
		} catch (err) {
			console.error('Error deleting summary:', err)
			alert('Failed to delete summary')
		} finally {
			setPendingDeleteId(null)
		}
	}

	const handleSelect = (summary) => {
		if (onSelectSummary) {
			onSelectSummary(summary)
		}
	}

	const getDisplayTitle = (summary) => {
		if (summary.meeting_title) return summary.meeting_title
		if (summary.title) {
			const titleDate = new Date(summary.title)
			if (!isNaN(titleDate.getTime())) {
				return formatDate(summary.title)
			}
			return summary.title
		}
		return formatDate(summary.created_at) || 'Untitled'
	}

	const getMeetingDate = (summary) => {
		if (summary.meeting_date) return formatDate(summary.meeting_date)
		return null
	}

	const getActionItemsCount = (summary) => {
		if (Array.isArray(summary.action_items)) {
			return summary.action_items.length
		}
		return 0
	}

	if (isLoading) {
		return (
			<div className="card">
				<h2 className="section-title mb-4">Summary History</h2>
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400" />
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="card">
				<h2 className="section-title mb-4">Summary History</h2>
				<div className="p-4 bg-red-500/15 border border-red-500/30 rounded-lg">
					<p className="text-red-400">{error}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="card">
			<h2 className="section-title mb-4">Summary History</h2>

			{summaries.length === 0 ? (
				<div className="text-center py-8 text-slate-400">
					<p>You haven't created any summaries yet.</p>
				</div>
			) : (
				<div className="space-y-4">
					{summaries.map(summary => {
						const displayTitle = getDisplayTitle(summary)
						const meetingDate = getMeetingDate(summary)
						const createdDate = formatDate(summary.created_at)
						const actionCount = getActionItemsCount(summary)

						return (
							<div key={summary.id} className="border border-slate-700/50 rounded-lg p-4 hover:border-emerald-500/30 hover:bg-slate-800/30 transition-colors">
								<div className="flex justify-between items-start gap-4">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 flex-wrap">
											<h3 className="font-medium text-slate-100 truncate">
												{displayTitle}
											</h3>
											<MeetingTypeBadge type={summary.meeting_type} />
										</div>

										<div className="flex items-center gap-3 mt-2 flex-wrap">
											{meetingDate && (
												<span className="text-sm text-slate-400">
													📅 {meetingDate}
												</span>
											)}
											<ParticipantsBadge participants={summary.participants} />
											<ActionItemsCount count={actionCount} />
										</div>

										{summary.instruction && (
											<p className="text-sm text-slate-500 mt-2 line-clamp-1">
												{summary.instruction}
											</p>
										)}

										{createdDate && !meetingDate && (
											<p className="text-xs text-slate-500 mt-1">
												Created: {createdDate}
											</p>
										)}
									</div>

									<div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 flex-shrink-0">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleSelect(summary)}
											className="w-full sm:w-auto"
										>
											Load
										</Button>
										<Button
											variant="destructive"
											size="sm"
											className="w-full sm:w-auto"
											onClick={() => requestDelete(summary.id)}
										>
											Delete
										</Button>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}

			<ConfirmDialog
				open={!!pendingDeleteId}
				title="Delete summary?"
				description="This action cannot be undone. The summary will be permanently removed."
				confirmText="Delete"
				onConfirm={confirmDelete}
				onCancel={() => setPendingDeleteId(null)}
				confirmVariant="destructive"
			/>
		</div>
	)
}

export default HistoryView
