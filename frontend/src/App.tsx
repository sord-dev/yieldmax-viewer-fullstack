import { Routes, Route } from 'react-router-dom'
import { NavBar } from './components'
import { ETFPage, PortfolioPage } from './pages'
import { useAppData } from './contexts/AppDataContext'

import useFetchPositions from './hooks/useFetchPositions'

function App() {
  const { returnPayoutSummary } = useAppData()
  useFetchPositions();

  return (
    <>
      <NavBar ETFDetails={returnPayoutSummary()} />

      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/etfs/:etfName" element={<ETFPage />} />
      </Routes>
    </>
  )
}

export default App
