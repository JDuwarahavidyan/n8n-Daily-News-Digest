import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import './App.css'

const RECAPTCHA_SITE_KEY = '6LdXZXIsAAAAAGYUFHMUR0Bsm2ApQ7g5OBSqvoZS'
const WEBHOOK_URL = 'https://duwarahavidyan.app.n8n.cloud/webhook/subscribe'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const recaptchaRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!captchaToken) {
      setErrorMsg('Please complete the reCAPTCHA verification.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const formData = new URLSearchParams()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('g-recaptcha-response', captchaToken)

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      if (response.ok) {
        setStatus('success')
      } else {
        setErrorMsg('Something went wrong. Please try again.')
        setStatus('error')
        recaptchaRef.current?.reset()
        setCaptchaToken(null)
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setStatus('error')
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  if (status === 'success') {
    return (
      <div className="page">
        <div className="bg-gradient" />
        <Particles />
        <div className="card">
          <div className="card-inner">
            <div className="success-container">
              <span className="success-icon">&#127881;</span>
              <h2 className="success-title">You're In!</h2>
              <p className="success-text">
                Welcome aboard, <strong>{name}</strong>!<br />
                Your daily AI intelligence brief will arrive at<br />
                <strong>{email}</strong> starting tomorrow morning.
              </p>
            </div>
            <div className="footer">
              <p>Created by <span className="creator">Duwarahavidyan J.</span></p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="bg-gradient" />
      <Particles />
      <div className="card">
        <div className="card-inner">
          {/* Header */}
          <div className="header">
            <span className="emoji-icon">&#129504;</span>
            <span className="badge">Free &middot; Daily &middot; AI-Powered</span>
            <h1 className="title">Daily AI<br />Intelligence Brief</h1>
            <p className="subtitle">
              Get the <strong>top 5 AI news</strong> and <strong>5 research papers</strong><br />
              delivered to your inbox every morning.
            </p>
          </div>

          {/* Feature tags */}
          <div className="features">
            <span className="feature-tag">
              <span className="dot dot-orange" />
              Top Headlines
            </span>
            <span className="feature-tag">
              <span className="dot dot-teal" />
              Research Papers
            </span>
            <span className="feature-tag">
              <span className="dot dot-yellow" />
              AI Curated
            </span>
          </div>

          <hr className="divider" />

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Your Name</label>
              <div className="input-wrapper">
                <span className="input-icon">&#128100;</span>
                <input
                  id="name"
                  className="form-input"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">&#9993;&#65039;</span>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="error-msg">{errorMsg}</div>
            )}

            <div className="recaptcha-wrapper">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                theme="dark"
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              />
            </div>

            <button
              type="submit"
              className={`submit-btn ${status === 'loading' ? 'loading' : ''}`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="spinner" />
              ) : null}
              Subscribe to Daily Digest
            </button>
          </form>

          <div className="footer">
            <p>
              No spam, ever. Unsubscribe anytime.<br />
              Created by <span className="creator">Duwarahavidyan J.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Particles() {
  return (
    <div className="particles">
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
    </div>
  )
}

export default App
