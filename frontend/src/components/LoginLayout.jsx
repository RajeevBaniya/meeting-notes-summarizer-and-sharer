import React from 'react'
import AuthForm from './AuthForm'

export default function LoginLayout({ onAuthSuccess }) {
  return (
    <div className="main-container">
      <div className="login-page">
        <div className="login-left-decorations">
          <div className="relative h-full w-full">
            <div className="floating-card card-1" style={{ '--rotation': '3deg' }}>
              <div className="flex items-center mb-2 xl:mb-3">
                <div className="w-3 xl:w-4 h-3 xl:h-4 bg-green-400 rounded-full mr-2 xl:mr-3"></div>
                <span className="text-white text-sm xl:text-base font-semibold">Meeting Summary</span>
              </div>
              <div className="space-y-1 xl:space-y-2">
                <div className="w-full h-2 xl:h-3 bg-white/25 rounded"></div>
                <div className="w-5/6 h-2 xl:h-3 bg-white/25 rounded"></div>
                <div className="w-3/4 h-2 xl:h-3 bg-white/25 rounded"></div>
                <div className="w-1/2 h-2 xl:h-3 bg-white/25 rounded"></div>
              </div>
            </div>

            <div className="floating-card card-2" style={{ '--rotation': '-2deg' }}>
              <div className="flex items-center mb-2 xl:mb-3">
                <div className="w-3 xl:w-4 h-3 xl:h-4 bg-blue-400 rounded-full mr-2 xl:mr-3"></div>
                <span className="text-white text-sm xl:text-base font-semibold">Action Items</span>
              </div>
              <div className="space-y-1 xl:space-y-2">
                <div className="w-full h-2 xl:h-3 bg-white/25 rounded"></div>
                <div className="w-4/5 h-2 xl:h-3 bg-white/25 rounded"></div>
                <div className="w-2/3 h-2 xl:h-3 bg-white/25 rounded"></div>
              </div>
            </div>

            <div className="floating-card card-3" style={{ '--rotation': '1deg' }}>
              <div className="flex items-center mb-2 xl:mb-3">
                <div className="w-3 xl:w-4 h-3 xl:h-4 bg-purple-400 rounded-full mr-2 xl:mr-3"></div>
                <span className="text-white text-sm xl:text-base font-semibold">Key Decisions</span>
              </div>
              <div className="space-y-1 xl:space-y-2">
                <div className="w-full h-2 xl:h-3 bg-white/25 rounded"></div>
                <div className="w-5/6 h-2 xl:h-3 bg-white/25 rounded"></div>
                <div className="w-3/4 h-2 xl:h-3 bg-white/25 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right-decorations">
          <div className="relative h-full w-full">
            <div className="feature-card feature-1">
              <div className="flex items-center mb-3 xl:mb-4">
                <svg className="w-6 xl:w-8 h-6 xl:h-8 text-green-400 mr-2 xl:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-white font-semibold text-base xl:text-lg">AI-Powered</span>
              </div>
              <p className="text-gray-300 text-sm xl:text-base leading-relaxed">Advanced AI technology extracts key insights from your meetings</p>
            </div>

            <div className="feature-card feature-2">
              <div className="flex items-center mb-3 xl:mb-4">
                <svg className="w-6 xl:w-8 h-6 xl:h-8 text-blue-400 mr-2 xl:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-white font-semibold text-base xl:text-lg">Secure & Private</span>
              </div>
              <p className="text-gray-300 text-sm xl:text-base leading-relaxed">Your data is encrypted and never shared with third parties</p>
            </div>

            <div className="feature-card feature-3">
              <div className="flex items-center mb-3 xl:mb-4">
                <svg className="w-6 xl:w-8 h-6 xl:h-8 text-purple-400 mr-2 xl:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white font-semibold text-base xl:text-lg">Time-Saving</span>
              </div>
              <p className="text-gray-300 text-sm xl:text-base leading-relaxed">Save hours of manual work with automated summaries</p>
            </div>
          </div>
        </div>

        <div className="mobile-features">
          <div className="mobile-feature-list">
            <div className="mobile-feature-item">
              <svg className="mobile-feature-icon text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="mobile-feature-text">AI-Powered</span>
            </div>
            <div className="mobile-feature-item">
              <svg className="mobile-feature-icon text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="mobile-feature-text">Secure</span>
            </div>
            <div className="mobile-feature-item">
              <svg className="mobile-feature-icon text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1" />
              </svg>
              <span className="mobile-feature-text">Fast</span>
            </div>
          </div>
        </div>

        <div className="login-center">
          <div className="login-brand">
            <div className="login-icon">
              <svg className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="login-title">SummarEase</h1>
            <p className="login-subtitle">Transform your meeting transcripts into clear, actionable summaries</p>
          </div>
          <AuthForm onAuthSuccess={onAuthSuccess} />
        </div>

        <div className="background-shapes">
          <div className="bg-shape-1"></div>
          <div className="bg-shape-2"></div>
          <div className="bg-shape-3"></div>
        </div>
      </div>
    </div>
  )
}


