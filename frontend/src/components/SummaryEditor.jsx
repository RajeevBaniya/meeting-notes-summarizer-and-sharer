import { useState } from 'react'
import { Button } from './ui/button'

function SummaryEditor({ summary, setSummary }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedSummary, setEditedSummary] = useState(summary)

  const handleSave = () => {
    setSummary(editedSummary)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedSummary(summary)
    setIsEditing(false)
  }

  const handleEdit = () => {
    setEditedSummary(summary)
    setIsEditing(true)
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">Generated Summary</h2>
        {!isEditing && (
          <Button 
            variant="outline" 
            onClick={handleEdit}
            className="px-6"
          >
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col flex-1 gap-4">
          <textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            className="flex-1 w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[16rem] max-h-[400px]"
            placeholder="Edit your summary here..."
          />
          <div className="button-container gap-2">
            <Button 
              onClick={handleSave}
              className="w-auto px-6"
            >
              Save Changes
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleCancel}
              className="w-auto px-6"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <div className="min-h-[16rem] max-h-[400px] p-4 bg-gray-50 rounded-md border overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
              {summary}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default SummaryEditor
