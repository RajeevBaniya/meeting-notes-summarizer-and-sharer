import express from 'express';
import { generateSummary } from '../services/groq.js';
import { saveSummary } from '../services/summaries.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', requireAuth, async (req, res) => {
  const { transcript, instruction, title } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  if (!instruction) {
    return res.status(400).json({ error: 'Instruction is required' });
  }

  try {
    const summary = await generateSummary(transcript, instruction);

    const saved = await saveSummary({
      userId: req.user.id,
      transcript,
      summary,
      instruction,
      title
    });

    res.json({
      success: true,
      summary: summary,
      savedId: saved.id
    });
  } catch (error) {
    console.error('Summary generation error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message 
    });
  }
});

export default router;
