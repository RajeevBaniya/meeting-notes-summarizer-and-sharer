import express from 'express';
import { generateSummary } from '../services/groq.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { transcript, instruction } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  if (!instruction) {
    return res.status(400).json({ error: 'Instruction is required' });
  }

  try {
    const summary = await generateSummary(transcript, instruction);
    
    res.json({
      success: true,
      summary: summary
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
