import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Chat from './components/Chat.jsx'
import './App.css'

function App() {
  const [serverMessage, setServerMessage] = useState('Connecting to Express backend...')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Port 5001 is used in our backend env file
    fetch('http://localhost:5001/api/hello')
      .then((res) => res.json())
      .then((data) => {
        setServerMessage(data.message)
        setIsConnected(true)
      })
      .catch((err) => {
        setServerMessage('Could not reach Express backend at http://localhost:5001')
        setIsConnected(false)
        console.error(err)
      })
  }, [])

  return (
    <>
      <section id="center" className="py-6">
        <div className="hero mb-2">
          <img src={heroImg} className="base" width="100" height="105" alt="" />
          <img src={reactLogo} className="framework" style={{ top: '20px', height: '18px' }} alt="React logo" />
          <img src={viteLogo} className="vite" style={{ top: '65px', height: '16px' }} alt="Vite logo" />
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mb-2">
            Socket.io Chat Application
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
            A premium full-stack real-time workspace chat client utilizing Tailwind CSS v4 and ES Modules.
          </p>
          <div className={`px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-xs font-semibold border ${
            isConnected 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            Backend Status: {serverMessage}
          </div>
        </div>

        {/* Real-time Chat Section */}
        <Chat />
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
