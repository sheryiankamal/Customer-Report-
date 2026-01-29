import "@fontsource/lato";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
