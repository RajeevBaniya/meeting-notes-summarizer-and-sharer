import { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import SummaryGenerator from "./components/SummaryGenerator";
import SummaryEditor from "./components/SummaryEditor";
import EmailSender from "./components/EmailSender";
import Navbar from "./components/Navbar";
import HistoryView from "./components/HistoryView";
import MeetingDetails from "./components/MeetingDetails";
import StructuredSummary from "./components/StructuredSummary";
import { getCurrentUser, startAuthListener } from "./lib/supabase";
import LoadingScreen from "./components/LoadingScreen";
import LoginLayout from "./components/LoginLayout";
import { checkTrialUsed } from "./lib/utils";

const getInitialMeetingData = () => ({
  meetingTitle: "",
  meetingDate: "",
  meetingType: "",
  participants: [],
  location: "",
  tags: [],
});

function App() {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [structured, setStructured] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [meetingData, setMeetingData] = useState(getInitialMeetingData);
  const [currentSummaryId, setCurrentSummaryId] = useState(null);
  const [showMainApp, setShowMainApp] = useState(false);
  
  useEffect(() => {
    const authSub = startAuthListener();
    const checkAuth = async () => {
      try {
        const { user } = await getCurrentUser();
        setUser(user);
        if (user) {
          setShowMainApp(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuth();
    return () => {
      try {
        authSub.data?.subscription?.unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
    };
  }, []);

  useEffect(() => {
    if (!user && checkTrialUsed() && showMainApp) {
      setShowMainApp(false);
    }
  }, [user, showMainApp]);

  const handleAuthSuccess = (session) => {
    setUser(session.user);
    setShowMainApp(true);
  };

  const handleTrialStart = () => {
    setShowMainApp(true);
  };

  const handleTrialUsed = () => {
    if (!user) {
      setShowMainApp(false);
    }
  };


  const handleSelectSummary = (selectedSummary) => {
    setTranscript(selectedSummary.transcript);
    setSummary(selectedSummary.summary);
    setStructured({
      actionItems: selectedSummary.action_items || [],
      decisions: selectedSummary.decisions || [],
      deadlines: selectedSummary.deadlines || [],
      participants: selectedSummary.extracted_participants || [],
    });
    setMeetingData({
      meetingTitle: selectedSummary.meeting_title || "",
      meetingDate: selectedSummary.meeting_date
        ? new Date(selectedSummary.meeting_date).toISOString().slice(0, 16)
        : "",
      meetingType: selectedSummary.meeting_type || "",
      participants: selectedSummary.participants || [],
      location: selectedSummary.location || "",
      tags: selectedSummary.tags || [],
    });
    setCurrentSummaryId(selectedSummary.id);
    setShowHistory(false);
  };

  const handleNewSummary = () => {
    if (!user && checkTrialUsed()) {
      setShowMainApp(false);
      return;
    }
    setTranscript("");
    setSummary("");
    setStructured(null);
    setMeetingData(getInitialMeetingData());
    setCurrentSummaryId(null);
    setShowHistory(false);
  };


  if (!authChecked) return <LoadingScreen />;

  if (!user && !showMainApp) {
    return <LoginLayout onAuthSuccess={handleAuthSuccess} onTrialStart={handleTrialStart} />;
  }

  return (
    <div className="main-container logged-in-container">
      <Navbar user={user} isTrialMode={!user} />
      <div className="content-wrapper">
        <header className="header-section logged-in-header">
          {user ? (
            <button
              onClick={() => {
                if (showHistory) {
                  handleNewSummary();
                } else {
                  setShowHistory(true);
                }
              }}
              className="primary-button history-toggle-btn"
            >
              <span className="history-toggle-text-desktop">
                {showHistory ? "New Summary" : "View History"}
              </span>
              <span className="history-toggle-text-mobile">
                {showHistory ? "New" : "History"}
              </span>
            </button>
          ) : summary ? (
            <button
              onClick={handleNewSummary}
              className="primary-button history-toggle-btn"
            >
              <span className="history-toggle-text-desktop">New Summary</span>
              <span className="history-toggle-text-mobile">New</span>
            </button>
          ) : null}
        </header>
        
        {user && showHistory ? (
          <HistoryView onSelectSummary={handleSelectSummary} />
        ) : (
          <div
            className={`layout-container ${summary ? "summary-active" : ""}`}
          >
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
                  setSummaryId={setCurrentSummaryId}
                  isTrialMode={!user}
                  onTrialUsed={handleTrialUsed}
                />
              </div>
            </div>
            
            {summary && (
              <div className="right-content">
                <SummaryEditor 
                  summary={summary} 
                  setSummary={setSummary}
                  summaryId={currentSummaryId}
                  meetingTitle={meetingData.meetingTitle}
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
                  <EmailSender summary={summary} isTrialMode={!user} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
