import './styles.css'
import ReactDOM from 'react-dom/client'
import App from './App'

require('file-loader?name=[name].[ext]!../index.html')

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// Prevent magnify on IOS
document.addEventListener(
  'touchstart',
  (e) => {
    e.preventDefault()
  },
  false
)

// Prevent magnify on IOS
document.addEventListener(
  'dblclick',
  (e) => {
    e.preventDefault()
  },
  false
)

// Prevent menu on long click
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

root.render(<App />)
