import { prisma } from './db.js'

export async function saveSummary({ userId, transcript, summary, instruction, title, emailRecipients, isShared }) {
	return prisma.summary.create({
		data: {
			userId,
			transcript,
			summary,
			instruction,
			title: title || null,
			emailRecipients: emailRecipients || null,
			isShared: Boolean(isShared) || false
		}
	})
}

export async function listSummaries(userId, { skip = 0, take = 20 } = {}) {
	return prisma.summary.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
		skip,
		take
	})
}

export async function getSummaryById(id, userId) {
	return prisma.summary.findFirst({ where: { id: Number(id), userId } })
}

export async function deleteSummary(id, userId) {
	return prisma.summary.delete({ where: { id: Number(id) } })
}

export async function updateSummary(id, userId, data) {
	return prisma.summary.update({
		where: { id: Number(id) },
		data
	})
}


