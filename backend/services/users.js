import { prisma } from './db.js'

export async function ensureUserExists(userId) {
	const idNum = Number(userId)
	if (!idNum || Number.isNaN(idNum)) {
		throw new Error('Invalid user id')
	}
	const existing = await prisma.user.findUnique({ where: { id: idNum } })
	if (existing) return existing
	return prisma.user.create({
		data: {
			id: idNum,
			email: `demo+${idNum}@example.com`,
			passwordHash: 'placeholder',
			name: 'Demo User'
		}
	})
}


