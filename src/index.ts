import './styles.css'
import Keyboard from './instruments/Keyboard/Keyboard'
import AnimationController from './animationController'

require('file-loader?name=[name].[ext]!../index.html')

window.addEventListener('load', () => {
  let initialised = false
  const bodyElement = document.body

  document.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault()
    },
    false
  )

  const roomViewer = document.createElement('div')
  roomViewer.className = 'room-viewer'
  bodyElement.appendChild(roomViewer)

  const canvas = <HTMLCanvasElement>document.createElement('canvas')
  roomViewer.appendChild(canvas)

  const instrumentViewer = document.createElement('div')
  instrumentViewer.className = 'instrument-viewer'
  bodyElement.appendChild(instrumentViewer)

  canvas.width = roomViewer.clientWidth
  canvas.height = roomViewer.clientHeight

  const ctx = canvas.getContext('2d')

  const keyboard = new Keyboard(instrumentViewer)
  keyboard.render(window.innerWidth)

  document.addEventListener('click', (e) => {
    if (!initialised) {
      const audioContext: AudioContext = new AudioContext()

      const audioAnalyser = audioContext.createAnalyser()
      audioAnalyser.connect(audioContext.destination)

      keyboard.initialise(audioContext, audioAnalyser)

      const animationController = new AnimationController(
        roomViewer,
        ctx,
        audioAnalyser
      )

      animationController.initialise()
    }
    initialised = true
  })
})
