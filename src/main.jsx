import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AdminPanel from './adminPanel.jsx'

const esAdmin = window.location.hash === 'admin'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {esAdmin ? <AdminPanel /> : <App />}
  </StrictMode>,
)
