import { useState } from 'react'

function CollapsibleSection({ title, icon, count, children, defaultOpen = true }) {
	const [isOpen, setIsOpen] = useState(defaultOpen)

	if (count === 0) return null

	return (
		<div className="border border-gray-200 rounded-lg overflow-hidden">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
			>
				<div className="flex items-center gap-2">
					<span className="text-lg">{icon}</span>
					<span className="font-medium text-gray-800">{title}</span>
					<span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
						{count}
					</span>
				</div>
				<svg
					className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
			{isOpen && <div className="p-3 bg-white">{children}</div>}
		</div>
	)
}

function ActionItemsList({ items }) {
	return (
		<ul className="space-y-2">
			{items.map((item, index) => (
				<li key={index} className="flex items-start gap-2">
					<span className="mt-1 w-4 h-4 rounded border border-gray-300 flex-shrink-0" />
					<div className="flex-1">
						<p className="text-gray-800">{item.task}</p>
						{(item.assignee || item.dueDate) && (
							<div className="flex gap-3 mt-1 text-sm text-gray-500">
								{item.assignee && (
									<span className="flex items-center gap-1">
										<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
										{item.assignee}
									</span>
								)}
								{item.dueDate && (
									<span className="flex items-center gap-1">
										<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
										{item.dueDate}
									</span>
								)}
							</div>
						)}
					</div>
				</li>
			))}
		</ul>
	)
}

function DecisionsList({ items }) {
	return (
		<ul className="space-y-2">
			{items.map((item, index) => (
				<li key={index} className="flex items-start gap-2">
					<span className="mt-1 text-green-500 flex-shrink-0">✓</span>
					<div>
						<p className="text-gray-800">{item.decision}</p>
						{item.context && (
							<p className="text-sm text-gray-500 mt-1">{item.context}</p>
						)}
					</div>
				</li>
			))}
		</ul>
	)
}

function DeadlinesList({ items }) {
	return (
		<ul className="space-y-2">
			{items.map((item, index) => (
				<li key={index} className="flex items-start gap-2">
					<span className="mt-1 text-orange-500 flex-shrink-0">⏰</span>
					<div>
						<p className="text-gray-800">{item.item}</p>
						<div className="flex gap-3 mt-1 text-sm text-gray-500">
							<span className="flex items-center gap-1 text-orange-600 font-medium">
								<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								{item.date}
							</span>
							{item.owner && (
								<span className="flex items-center gap-1">
									<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									{item.owner}
								</span>
							)}
						</div>
					</div>
				</li>
			))}
		</ul>
	)
}

function ParticipantsList({ items, manualParticipants = [] }) {
	return (
		<div className="flex flex-wrap gap-2">
			{items.map((name, index) => {
				const isManual = manualParticipants.includes(name)
				return (
					<span
						key={index}
						className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
							isManual
								? 'bg-indigo-100 text-indigo-700 font-medium'
								: 'bg-gray-100 text-gray-700'
						}`}
					>
						<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						{name}
					</span>
				)
			})}
		</div>
	)
}

const GENERIC_TERMS = [
	'user', 'users', 'they', 'we', 'our', 'us', 'them', 'their', 'you', 'your',
	'it', 'its', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'mine',
	'he', 'she', 'him', 'her', 'his', 'hers', 'flow', 'order', 'features',
	'feature', 'system', 'tool', 'app', 'application', 'website', 'page'
]

function isValidParticipantName(name) {
	if (!name || typeof name !== 'string') return false
	const trimmed = name.trim().toLowerCase()
	if (trimmed.length < 2) return false
	if (GENERIC_TERMS.includes(trimmed)) return false
	if (trimmed.includes('/') || trimmed.includes('order of')) return false
	if (trimmed.split(' ').length > 5) return false
	return true
}

function StructuredSummary({ structured, manualParticipants = [] }) {
	const { actionItems = [], decisions = [], deadlines = [], participants: extractedParticipants = [] } = structured || {}

	const validExtracted = extractedParticipants.filter(p => isValidParticipantName(p) && !manualParticipants.includes(p))

	const mergedParticipants = [
		...manualParticipants,
		...validExtracted
	]

	const hasAnyData = actionItems.length > 0 || decisions.length > 0 || deadlines.length > 0 || mergedParticipants.length > 0

	if (!hasAnyData) return null

	return (
		<div className="card">
			<h2 className="section-title mb-4">Extracted Insights</h2>

			<div className="space-y-3">
				<CollapsibleSection
					title="Action Items"
					icon="📋"
					count={actionItems.length}
					defaultOpen={true}
				>
					<ActionItemsList items={actionItems} />
				</CollapsibleSection>

				<CollapsibleSection
					title="Key Decisions"
					icon="✅"
					count={decisions.length}
					defaultOpen={true}
				>
					<DecisionsList items={decisions} />
				</CollapsibleSection>

				<CollapsibleSection
					title="Deadlines"
					icon="📅"
					count={deadlines.length}
					defaultOpen={true}
				>
					<DeadlinesList items={deadlines} />
				</CollapsibleSection>

				<CollapsibleSection
					title="Participants"
					icon="👥"
					count={mergedParticipants.length}
					defaultOpen={false}
				>
					<ParticipantsList items={mergedParticipants} manualParticipants={manualParticipants} />
				</CollapsibleSection>
			</div>
		</div>
	)
}

export default StructuredSummary

