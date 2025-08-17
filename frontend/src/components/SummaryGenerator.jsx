import { useState } from 'react'
import axios from 'axios'
import { Button } from './ui/button'

function SummaryGenerator({ transcript, setSummary, isLoading, setIsLoading }) {
  const [instruction, setInstruction] = useState('')
  const [error, setError] = useState('')

  const presetInstructions = [
    'Summarize in bullet points for executives',
    'Highlight only action items and next steps',
    'Create a brief overview with key decisions',
    'List all participants and their main contributions',
    'Extract important dates, deadlines and deliverables'
  ]

  const generateSummary = async () => {
    if (!transcript.trim()) {
      setError('Please upload a transcript first')
      return
    }

    if (!instruction.trim()) {
      setError('Please provide an instruction')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/summary/generate`, {
        transcript: transcript,
        instruction: instruction
      })
      setSummary(response.data.summary)
    } catch (error) {
      setError('Failed to generate summary: ' + error.response?.data?.error || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const selectPreset = (preset) => {
    setInstruction(preset)
  }

  return (
    <div className="card">
      <h2 className="section-title mb-4">Generate Summary</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Instruction
          </label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g., Summarize in bullet points for executives"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Quick options:</p>
          <div className="flex flex-wrap gap-2">
            {presetInstructions.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => selectPreset(preset)}
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={generateSummary}
          disabled={isLoading || !transcript.trim() || !instruction.trim()}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Summary...
            </div>
          ) : (
            'Generate Summary'
          )}
        </Button>
      </div>
    </div>
  )
}

export default SummaryGenerator
