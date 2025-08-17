import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = process.env.GROQ_API_KEY;

export const generateSummary = async (transcript, instruction) => {
  if (!API_KEY) {
    throw new Error('Groq API key not configured');
  }

  const prompt = `
${instruction}

Here is the meeting transcript to summarize:

${transcript}

Please provide a well-structured summary based on the instruction above.
  `.trim();

  try {
    const response = await axios.post(GROQ_API_URL, {
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API error:', error.response?.data || error.message);
    throw new Error('Failed to generate summary');
  }
};
