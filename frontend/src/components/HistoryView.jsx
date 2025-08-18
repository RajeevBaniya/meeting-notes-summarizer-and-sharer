import { useState, useEffect } from 'react'
import api from '../lib/api'
import { Button } from './ui/button'
import ConfirmDialog from './ui/confirm-dialog'

function HistoryView({ onSelectSummary }) {
  const [summaries, setSummaries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/api/summaries')
        setSummaries(response.data.items || [])
      } catch (error) {
        console.error('Error fetching summaries:', error)
        setError('Failed to load your summary history')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummaries()
  }, [])

  const requestDelete = (id) => {
    setPendingDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!pendingDeleteId) return
    try {
      await api.delete(`/api/summaries/${pendingDeleteId}`)
      setSummaries(summaries.filter(summary => summary.id !== pendingDeleteId))
    } catch (error) {
      console.error('Error deleting summary:', error)
      alert('Failed to delete summary')
    } finally {
      setPendingDeleteId(null)
    }
  }

  const handleSelect = (summary) => {
    if (onSelectSummary) {
      onSelectSummary(summary)
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <h2 className="section-title mb-4">Summary History</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="section-title mb-4">Summary History</h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="section-title mb-4">Summary History</h2>
      
      {summaries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't created any summaries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {summaries.map(summary => {
            const formattedDate = new Date(summary.createdAt).toLocaleString()
            const parsedTitleDate = summary.title ? new Date(summary.title) : null
            const titleLooksLikeDate = parsedTitleDate && !isNaN(parsedTitleDate.getTime())
            const useSeparateDate = summary.title && !titleLooksLikeDate
            const primaryTitle = useSeparateDate ? summary.title : formattedDate
            return (
              <div key={summary.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {primaryTitle}
                    </h3>
                    {useSeparateDate && (
                      <p className="text-sm text-gray-500 mt-1">
                        {formattedDate}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {summary.instruction}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSelect(summary)}
                      className="w-full sm:w-auto"
                    >
                      Load
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full sm:w-auto text-red-600 hover:bg-red-50"
                      onClick={() => requestDelete(summary.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Delete summary?"
        description="This action cannot be undone. The summary will be permanently removed."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        confirmVariant="destructive"
      />
    </div>
  )
}

export default HistoryView
