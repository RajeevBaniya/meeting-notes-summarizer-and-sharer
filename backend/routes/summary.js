import express from 'express'
import { generateMeetingSummary } from '../services/groq.js'
import { saveSummary } from '../services/summaries.js'
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router()

router.post('/generate', optionalAuth, async (req, res) => {
	const {
		transcript,
		instruction,
		title,
		meetingTitle,
		meetingDate,
		meetingType,
		participants,
		location,
		tags,
		extractStructured
	} = req.body

  if (!transcript) {
		return res.status(400).json({ error: 'Transcript is required' })
  }

  if (!instruction) {
		return res.status(400).json({ error: 'Instruction is required' })
  }

  if (!req.user) {
    const { checkTrialUsed } = await import('../services/trialTracker.js');
    if (checkTrialUsed(req)) {
      return res.status(403).json({ 
        error: 'Trial limit reached',
        message: 'Your one-time trial is over. Please login or signup to continue generating summaries.'
      });
    }
  }

  try {
		const shouldExtract = extractStructured !== false
		const { summary, structured } = await generateMeetingSummary(
			transcript,
			instruction,
			shouldExtract
		)

    let saved = null
    if (req.user) {
      saved = await saveSummary({
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
				tags: tags || [],
				actionItems: structured.actionItems,
				decisions: structured.decisions,
				deadlines: structured.deadlines,
				extractedParticipants: structured.participants
			})
    } else {
      const { markTrialUsed } = await import('../services/trialTracker.js');
      markTrialUsed(req);
    }

    res.json({
      success: true,
			summary,
			structured,
      savedId: saved?.id || null
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
