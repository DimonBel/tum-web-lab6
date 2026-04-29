import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import NameEntryPage from './pages/NameEntryPage'
import { ThemeProvider } from './context/ThemeContext'
import { GameProvider, useGame } from './context/GameContext'
import './styles/globals.css'

function Root() {
  const { myName, setMyName } = useGame()

  if (!myName) {
    return (
      <div className="app-bg">
        <div className="app-card">
          <NameEntryPage onConfirm={setMyName} />
        </div>
      </div>
    )
  }

  return (
    <div className="app-bg">
      <div className="app-card">
        <App />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <GameProvider>
        <Root />
      </GameProvider>
    </ThemeProvider>
  </React.StrictMode>
)
