import { useState, useEffect } from 'react'
import FileUpload from './components/FileUpload'
import SummaryGenerator from './components/SummaryGenerator'
import SummaryEditor from './components/SummaryEditor'
import EmailSender from './components/EmailSender'
import Navbar from './components/Navbar'
import HistoryView from './components/HistoryView'
import { getCurrentUser, startAuthListener } from './lib/supabase'
import LoadingScreen from './components/LoadingScreen'
import LoginLayout from './components/LoginLayout'

function App() {
  const [transcript, setTranscript] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  
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
          <HistoryView 
            onSelectSummary={(selectedSummary) => {
              setTranscript(selectedSummary.transcript)
              setSummary(selectedSummary.summary)
              setShowHistory(false)
            }} 
          />
        ) : (
          <div className={`layout-container ${summary ? 'summary-active' : ''}`}>
            <div className="left-content">
              <FileUpload 
                onFileUpload={setTranscript}
                transcript={transcript}
              />
              
              <div className="mt-3 sm:mt-4 lg:mt-6">
                <SummaryGenerator 
                  transcript={transcript}
                  setSummary={setSummary}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </div>
            </div>
            
            {summary && (
              <div className="right-content">
                <SummaryEditor 
                  summary={summary}
                  setSummary={setSummary}
                />
                
                <div className="mt-3 sm:mt-4 lg:mt-6">
                  <EmailSender 
                    summary={summary}
                  />
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