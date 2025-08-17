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
        
        <div style={{ marginBottom: '2rem' }}>
          <div className="layout-grid">
            <div>
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
              <div>
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