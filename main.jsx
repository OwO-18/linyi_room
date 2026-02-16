import { ResizeObserver as Polyfill } from '@juggle/resize-observer';
window.ResizeObserver = window.ResizeObserver || Polyfill;
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './memory-room.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
