import React from 'react'

import ReactDOM from 'react-dom/client'
import './index.css'
import Home from './pages/Home'

const root = ReactDOM.createRoot(document.getElementById('root'))
const paths = window.location.pathname.split('/')
const freeMode = paths.includes('free')

root.render(
  // <React.StrictMode>
  <Home freeMode={freeMode} />
  // </React.StrictMode>
)
