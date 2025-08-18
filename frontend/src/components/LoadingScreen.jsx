import React from 'react'

export default function LoadingScreen() {
  return (
    <div className="main-container">
      <div className="content-wrapper">
        <header className="header-section">
          <h1 className="main-title">Meeting Notes Summarizer</h1>
        </header>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    </div>
  )
}


