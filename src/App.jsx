import { useGame } from './context/GameContext'
import HomePage from './pages/HomePage'
import HelpPage from './pages/HelpPage'
import LobbyPage from './pages/LobbyPage'
import JoinPage from './pages/JoinPage'
import MyQRPage from './pages/MyQRPage'
import ARScanPage from './pages/ARScanPage'
import GameplayPage from './pages/GameplayPage'
import WinPage from './pages/WinPage'
import WrongPage from './pages/WrongPage'
import CharactersPage from './pages/CharactersPage'

const SCREENS = {
  home:          <HomePage />,
  create:        <LobbyPage />,
  join:          <JoinPage />,
  'my-qr':       <MyQRPage />,
  'scan-player': <ARScanPage mode="player" />,
  'scan-room':   <ARScanPage mode="room" />,
  gameplay:      <GameplayPage />,
  win:           <WinPage />,
  wrong:         <WrongPage />,
  help:          <HelpPage />,
  characters:    <CharactersPage />,
}

export default function App() {
  const { screen } = useGame()
  return SCREENS[screen] ?? SCREENS.home
}
