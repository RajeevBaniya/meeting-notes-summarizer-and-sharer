import express from 'express'
import { generateMeetingSummary } from '../services/groq.js'
import { saveSummary } from '../services/summaries.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.post('/generate', requireAuth, async (req, res) => {
	const {
		transcript,
		instruction,
		title,
		meetingTitle,
		meetingDate,
		meetingType,
		participants,
		location,
		extractStructured
	} = req.body

  if (!transcript) {
		return res.status(400).json({ error: 'Transcript is required' })
  }

  if (!instruction) {
		return res.status(400).json({ error: 'Instruction is required' })
  }

  try {
		const shouldExtract = extractStructured !== false
		const { summary, structured } = await generateMeetingSummary(
			transcript,
			instruction,
			shouldExtract
		)

    const saved = await saveSummary({
      userId: req.user.id,
      transcript,
      summary,
      instruction,
			title,
			meetingTitle,
			meetingDate: meetingDate ? new Date(meetingDate) : null,
			meetingType,
			participants: participants || [],
			location,
			actionItems: structured.actionItems,
			decisions: structured.decisions,
			deadlines: structured.deadlines,
			extractedParticipants: structured.participants
		})

    res.json({
      success: true,
			summary,
			structured,
      savedId: saved.id
		})
  } catch (error) {
		console.error('Summary generation error:', error.message)
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message 
		})
  }
})

export default router
