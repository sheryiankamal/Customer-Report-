import "@fontsource/lato";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <App />
     </BrowserRouter>
     </Provider>
  </StrictMode>
)
