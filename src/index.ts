import './styles.css'
import App from './test2'

require('file-loader?name=[name].[ext]!../index.html')

window.addEventListener('load', () => {
  // Prevent magnify on IOS
  document.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault()
    },
    false
  )

  const app = new App()

  const initialise = () => {
    document.removeEventListener('click', initialise)
    app.initialise()
  }

  document.addEventListener('click', initialise)
})
