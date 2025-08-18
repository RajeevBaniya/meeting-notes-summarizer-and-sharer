import express from 'express'
import { listSummaries, getSummaryById, deleteSummary, updateSummary } from '../services/summaries.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
	try {
		const { skip, take } = req.query
		const items = await listSummaries(req.user.id, {
			skip: skip ? Number(skip) : 0,
			take: take ? Number(take) : 20
		})
		res.json({ success: true, items })
	} catch (error) {
		console.error('List summaries error:', error)
		res.status(500).json({ error: 'Failed to list summaries' })
	}
})

router.get('/:id', requireAuth, async (req, res) => {
	try {
		const item = await getSummaryById(req.params.id, req.user.id)
		if (!item) return res.status(404).json({ error: 'Not found' })
		res.json({ success: true, item })
	} catch (error) {
		console.error('Get summary error:', error)
		res.status(500).json({ error: 'Failed to get summary' })
	}
})

router.delete('/:id', requireAuth, async (req, res) => {
	try {
		await deleteSummary(req.params.id, req.user.id)
		res.json({ success: true })
	} catch (error) {
		console.error('Delete summary error:', error)
		res.status(500).json({ error: 'Failed to delete summary' })
	}
})

router.put('/:id', requireAuth, async (req, res) => {
	try {
		const data = {}
		const allowed = ['title', 'summary', 'instruction', 'isShared', 'emailRecipients']
		for (const key of allowed) {
			if (key in req.body) data[key] = req.body[key]
		}
		const updated = await updateSummary(req.params.id, req.user.id, data)
		res.json({ success: true, item: updated })
	} catch (error) {
		console.error('Update summary error:', error)
		res.status(500).json({ error: 'Failed to update summary' })
	}
})

export default router


