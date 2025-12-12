import { useState, useEffect } from 'react'
import FileUpload from './components/FileUpload'
import SummaryGenerator from './components/SummaryGenerator'
import SummaryEditor from './components/SummaryEditor'
import EmailSender from './components/EmailSender'
import Navbar from './components/Navbar'
import HistoryView from './components/HistoryView'
import MeetingDetails from './components/MeetingDetails'
import StructuredSummary from './components/StructuredSummary'
import { getCurrentUser, startAuthListener } from './lib/supabase'
import LoadingScreen from './components/LoadingScreen'
import LoginLayout from './components/LoginLayout'

const getInitialMeetingData = () => ({
	meetingTitle: '',
	meetingDate: '',
	meetingType: '',
	participants: [],
	location: ''
})

function App() {
  const [transcript, setTranscript] = useState('')
  const [summary, setSummary] = useState('')
	const [structured, setStructured] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
	const [meetingData, setMeetingData] = useState(getInitialMeetingData)
  
  useEffect(() => {
    const authSub = startAuthListener()
    const checkAuth = async () => {
      try {
        const { user } = await getCurrentUser()
        setUser(user)
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setAuthChecked(true)
      }
    }
    
    checkAuth()
    return () => {
      try { authSub.data?.subscription?.unsubscribe() } catch {}
    }
  }, [])

  const handleAuthSuccess = (session) => {
    setUser(session.user)
  }

	const handleSelectSummary = (selectedSummary) => {
		setTranscript(selectedSummary.transcript)
		setSummary(selectedSummary.summary)
		setStructured({
			actionItems: selectedSummary.action_items || [],
			decisions: selectedSummary.decisions || [],
			deadlines: selectedSummary.deadlines || [],
			participants: selectedSummary.extracted_participants || []
		})
		setMeetingData({
			meetingTitle: selectedSummary.meeting_title || '',
			meetingDate: selectedSummary.meeting_date
				? new Date(selectedSummary.meeting_date).toISOString().slice(0, 16)
				: '',
			meetingType: selectedSummary.meeting_type || '',
			participants: selectedSummary.participants || [],
			location: selectedSummary.location || ''
		})
		setShowHistory(false)
	}

	const handleNewSummary = () => {
		setTranscript('')
		setSummary('')
		setStructured(null)
		setMeetingData(getInitialMeetingData())
		setShowHistory(false)
	}

  if (!authChecked) return <LoadingScreen />

  if (!user) return <LoginLayout onAuthSuccess={handleAuthSuccess} />

  return (
    <div className="main-container logged-in-container">
      <Navbar user={user} />
      <div className="content-wrapper">
        <header className="header-section logged-in-header">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="primary-button history-toggle-btn"
          >
            <span className="history-toggle-text-desktop">{showHistory ? 'New Summary' : 'View History'}</span>
            <span className="history-toggle-text-mobile">{showHistory ? 'New' : 'History'}</span>
          </button>
        </header>
        
        {showHistory ? (
					<HistoryView onSelectSummary={handleSelectSummary} />
        ) : (
          <div className={`layout-container ${summary ? 'summary-active' : ''}`}>
            <div className="left-content">
							<MeetingDetails
								meetingData={meetingData}
								onUpdate={setMeetingData}
							/>

							<div className="mt-3 sm:mt-4 lg:mt-6">
              <FileUpload 
                onFileUpload={setTranscript}
                transcript={transcript}
              />
							</div>
              
              <div className="mt-3 sm:mt-4 lg:mt-6">
                <SummaryGenerator 
                  transcript={transcript}
                  setSummary={setSummary}
									setStructured={setStructured}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
									meetingData={meetingData}
                />
              </div>
            </div>
            
            {summary && (
              <div className="right-content">
                <SummaryEditor 
                  summary={summary}
                  setSummary={setSummary}
                />
                
								{structured && (
                <div className="mt-3 sm:mt-4 lg:mt-6">
										<StructuredSummary
											structured={structured}
											manualParticipants={meetingData.participants}
                  />
									</div>
								)}

								<div className="mt-3 sm:mt-4 lg:mt-6">
									<EmailSender summary={summary} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
