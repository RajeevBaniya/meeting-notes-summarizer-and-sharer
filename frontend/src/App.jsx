import { useState } from 'react'
import FileUpload from './components/FileUpload'
import SummaryGenerator from './components/SummaryGenerator'
import SummaryEditor from './components/SummaryEditor'
import EmailSender from './components/EmailSender'

function App() {
  const [transcript, setTranscript] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <header className="header-section">
          <h1 className="main-title">Meeting Notes Summarizer</h1>
        </header>
        
        <div style={{ marginBottom: '2rem' }}>
          <div className={`layout-container ${summary ? 'summary-active' : 'initial-state'}`}>
            <div className="left-content">
              <FileUpload 
                onFileUpload={setTranscript}
                transcript={transcript}
              />
              
              <div style={{ marginTop: '2rem' }}>
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
                
                <div style={{ marginTop: '2rem' }}>
                  <EmailSender 
                    summary={summary}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App