import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { BrowserRouter } from 'react-router-dom'
import { AppDataProvider } from './contexts/AppDataContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
    <AppDataProvider>
      <App />
    </AppDataProvider>
    </BrowserRouter>
  </StrictMode>,
)
