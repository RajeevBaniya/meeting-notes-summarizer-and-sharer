import AuthForm from './AuthForm'

function LoginLayout({ onAuthSuccess }) {
	return (
		<div className="login-wrapper">
			<div className="login-container">
				<div className="login-hero">
					<div className="hero-content">
						<div className="hero-badge">
							<span>Meeting Notes</span>
						</div>
						<h1 className="hero-title">
							Stop writing.<br />
							<span className="hero-accent">Start summarizing.</span>
						</h1>
						<p className="hero-description">
							Upload your meeting transcript, get structured insights in seconds. 
							Action items, decisions, and key points — extracted automatically.
						</p>
						
						<div className="hero-features">
							<div className="hero-feature">
								<div className="feature-icon feature-icon-1">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
									</svg>
								</div>
								<div>
									<h3>Action Items</h3>
									<p>Auto-extract tasks with assignees</p>
								</div>
							</div>
							<div className="hero-feature">
								<div className="feature-icon feature-icon-2">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div>
									<h3>Key Decisions</h3>
									<p>Never miss what was decided</p>
								</div>
							</div>
							<div className="hero-feature">
								<div className="feature-icon feature-icon-3">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
								<div>
									<h3>Deadlines</h3>
									<p>Track dates and deliverables</p>
								</div>
							</div>
						</div>
					</div>
					
					<div className="hero-visual">
						<div className="visual-card">
							<div className="visual-header">
								<div className="visual-dots">
									<span></span><span></span><span></span>
								</div>
								<span className="visual-title">meeting-summary.txt</span>
							</div>
							<div className="visual-content">
								<div className="visual-line visual-line-heading">Team Standup - Jan 15</div>
								<div className="visual-line"></div>
								<div className="visual-line visual-line-short"></div>
								<div className="visual-divider"></div>
								<div className="visual-line visual-line-accent">Action Items (3)</div>
								<div className="visual-line visual-line-indent"></div>
								<div className="visual-line visual-line-indent visual-line-short"></div>
							</div>
						</div>
					</div>
				</div>
				
				<div className="login-form-section">
					<div className="form-wrapper">
						<div className="form-brand">
							<div className="brand-icon">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
									<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
								</svg>
							</div>
							<span className="brand-name">SummarEase</span>
						</div>
						<AuthForm onAuthSuccess={onAuthSuccess} />
						<p className="form-footer">
							Free to use • No credit card required
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LoginLayout
