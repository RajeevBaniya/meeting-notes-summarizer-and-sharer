import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import {
	Document,
	Paragraph,
	TextRun,
	HeadingLevel,
	AlignmentType,
	Table,
	TableRow,
	TableCell,
	WidthType,
	BorderStyle,
} from 'docx'

function formatDate(dateString) {
	if (!dateString) return 'Not specified'
	try {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	} catch {
		return dateString
	}
}

function formatDateOnly(dateString) {
	if (!dateString) return 'Not specified'
	try {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	} catch {
		return dateString
	}
}

function getMeetingTypeLabel(type) {
	const labels = {
		team: 'Team Meeting',
		'one-on-one': '1-on-1',
		client: 'Client Meeting',
		standup: 'Standup',
		'project-review': 'Project Review',
		brainstorm: 'Brainstorming',
		interview: 'Interview',
		training: 'Training',
		other: 'Other',
	}
	return labels[type] || type || 'Not specified'
}

function createMeetingNotesTemplate(summaryData) {
	const {
		meetingTitle,
		meetingDate,
		meetingType,
		participants = [],
		location,
		tags = [],
		summary,
		actionItems = [],
		decisions = [],
		deadlines = [],
		extractedParticipants = [],
	} = summaryData

	const allParticipants = [
		...participants,
		...extractedParticipants.filter(
			(p) => !participants.includes(p)
		),
	]

	return {
		title: meetingTitle || 'Untitled Meeting',
		date: formatDate(meetingDate),
		type: getMeetingTypeLabel(meetingType),
		participants: allParticipants,
		location: location || 'Not specified',
		tags,
		summary,
		actionItems,
		decisions,
		deadlines,
	}
}

async function generatePDF(summaryData) {
	const template = createMeetingNotesTemplate(summaryData)
	const pdfDoc = await PDFDocument.create()
	const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
	const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
	const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
	const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

	let page = pdfDoc.addPage([595, 842])
	const { width, height } = page.getSize()
	const margin = 50
	const fontSize = 11
	const headingSize = 16
	const subHeadingSize = 13
	let yPosition = height - margin

	function addText(text, options = {}) {
		const {
			x = margin,
			y = yPosition,
			size = fontSize,
			font = timesRomanFont,
			color = rgb(0, 0, 0),
			bold = false,
		} = options

		page.drawText(text, {
			x,
			y,
			size,
			font: bold ? timesRomanBoldFont : font,
			color,
		})

		return size + 5
	}

	function addHeading(text, size = headingSize) {
		const lineHeight = addText(text, {
			size,
			font: timesRomanBoldFont,
			color: rgb(0.2, 0.5, 0.3),
		})
		yPosition -= lineHeight + 10
		return lineHeight
	}

	function addSubHeading(text) {
		const lineHeight = addText(text, {
			size: subHeadingSize,
			font: timesRomanBoldFont,
			color: rgb(0.3, 0.3, 0.3),
		})
		yPosition -= lineHeight + 8
		return lineHeight
	}

	function addLine(text, indent = 0) {
		if (yPosition < margin + 50) {
			page = pdfDoc.addPage([595, 842])
			yPosition = height - margin
		}

		const lineHeight = addText(text, {
			x: margin + indent,
			y: yPosition,
		})
		yPosition -= lineHeight
		return lineHeight
	}

	addHeading(template.title)
	yPosition -= 10

	addSubHeading('Meeting Information')
	addLine(`Date & Time: ${template.date}`)
	addLine(`Type: ${template.type}`)
	addLine(`Location: ${template.location}`)

	if (template.participants.length > 0) {
		addLine(
			`Participants: ${template.participants.join(', ')}`
		)
	}

	if (template.tags.length > 0) {
		addLine(`Tags: ${template.tags.join(', ')}`)
	}

	yPosition -= 15
	addSubHeading('Summary')
	const summaryLines = template.summary.split('\n').filter((line) => line.trim())
	summaryLines.forEach((line) => {
		addLine(line.trim())
	})

	if (template.actionItems.length > 0) {
		yPosition -= 15
		addSubHeading('Action Items')
		template.actionItems.forEach((item, index) => {
			const taskText = `${index + 1}. ${item.task}`
			addLine(taskText, 0)
			if (item.assignee || item.dueDate) {
				const details = []
				if (item.assignee) details.push(`Assignee: ${item.assignee}`)
				if (item.dueDate) details.push(`Due: ${item.dueDate}`)
				addLine(details.join(' | '), 20)
			}
		})
	}

	if (template.decisions.length > 0) {
		yPosition -= 15
		addSubHeading('Key Decisions')
		template.decisions.forEach((item, index) => {
			addLine(`${index + 1}. ${item.decision}`, 0)
			if (item.context) {
				addLine(`   Context: ${item.context}`, 20)
			}
		})
	}

	if (template.deadlines.length > 0) {
		yPosition -= 15
		addSubHeading('Deadlines')
		template.deadlines.forEach((item, index) => {
			addLine(`${index + 1}. ${item.item}`, 0)
			const details = [`Date: ${item.date}`]
			if (item.owner) details.push(`Owner: ${item.owner}`)
			addLine(details.join(' | '), 20)
		})
	}

	const pdfBytes = await pdfDoc.save()
	return pdfBytes
}

function generateWordDocument(summaryData) {
	const template = createMeetingNotesTemplate(summaryData)

	const children = []

	children.push(
		new Paragraph({
			text: template.title,
			heading: HeadingLevel.TITLE,
			alignment: AlignmentType.CENTER,
			spacing: { after: 400 },
		})
	)

	children.push(
		new Paragraph({
			text: 'Meeting Information',
			heading: HeadingLevel.HEADING_1,
			spacing: { before: 200, after: 200 },
		})
	)

	const infoRows = [
		['Date & Time', template.date],
		['Type', template.type],
		['Location', template.location],
	]

	if (template.participants.length > 0) {
		infoRows.push(['Participants', template.participants.join(', ')])
	}

	if (template.tags.length > 0) {
		infoRows.push(['Tags', template.tags.join(', ')])
	}

	const infoTable = new Table({
		width: { size: 100, type: WidthType.PERCENTAGE },
		rows: infoRows.map(
			([label, value]) =>
				new TableRow({
					children: [
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: label,
											bold: true,
										}),
									],
								}),
							],
							width: { size: 30, type: WidthType.PERCENTAGE },
						}),
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: value || 'Not specified',
										}),
									],
								}),
							],
							width: { size: 70, type: WidthType.PERCENTAGE },
						}),
					],
				})
		),
	})

	children.push(infoTable)

	children.push(
		new Paragraph({
			text: 'Summary',
			heading: HeadingLevel.HEADING_1,
			spacing: { before: 400, after: 200 },
		})
	)

	const summaryLines = template.summary
		.split('\n')
		.filter((line) => line.trim())
	summaryLines.forEach((line) => {
		children.push(
			new Paragraph({
				children: [new TextRun({ text: line.trim() })],
				spacing: { after: 100 },
			})
		)
	})

	if (template.actionItems.length > 0) {
		children.push(
			new Paragraph({
				text: 'Action Items',
				heading: HeadingLevel.HEADING_1,
				spacing: { before: 400, after: 200 },
			})
		)

		template.actionItems.forEach((item, index) => {
			const itemText = `${index + 1}. ${item.task}`
			const runs = [new TextRun({ text: itemText, bold: true })]

			if (item.assignee || item.dueDate) {
				const details = []
				if (item.assignee) details.push(`Assignee: ${item.assignee}`)
				if (item.dueDate) details.push(`Due: ${item.dueDate}`)
				runs.push(new TextRun({ text: ` (${details.join(', ')})` }))
			}

			children.push(
				new Paragraph({
					children: runs,
					spacing: { after: 100 },
				})
			)
		})
	}

	if (template.decisions.length > 0) {
		children.push(
			new Paragraph({
				text: 'Key Decisions',
				heading: HeadingLevel.HEADING_1,
				spacing: { before: 400, after: 200 },
			})
		)

		template.decisions.forEach((item, index) => {
			const runs = [
				new TextRun({ text: `${index + 1}. ${item.decision}`, bold: true }),
			]

			if (item.context) {
				runs.push(new TextRun({ text: ` - ${item.context}` }))
			}

			children.push(
				new Paragraph({
					children: runs,
					spacing: { after: 100 },
				})
			)
		})
	}

	if (template.deadlines.length > 0) {
		children.push(
			new Paragraph({
				text: 'Deadlines',
				heading: HeadingLevel.HEADING_1,
				spacing: { before: 400, after: 200 },
			})
		)

		template.deadlines.forEach((item, index) => {
			const runs = [
				new TextRun({ text: `${index + 1}. ${item.item}`, bold: true }),
			]

			const details = [`Date: ${item.date}`]
			if (item.owner) details.push(`Owner: ${item.owner}`)
			runs.push(new TextRun({ text: ` (${details.join(', ')})` }))

			children.push(
				new Paragraph({
					children: runs,
					spacing: { after: 100 },
				})
			)
		})
	}

	const doc = new Document({
		sections: [
			{
				children,
			},
		],
	})

	return doc
}

export { generatePDF, generateWordDocument, createMeetingNotesTemplate }

