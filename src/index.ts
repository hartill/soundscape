import './styles.css'
import Keyboard from './instruments/Keyboard/Keyboard'
import AnimationController from './animationController'
import PlayDialog from './components/PlayDialog'

require('file-loader?name=[name].[ext]!../index.html')

window.addEventListener('load', () => {
  let initialised = false

  // Prevent magnify on IOS
  document.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault()
    },
    false
  )

  const roomViewer = document.createElement('div')
  roomViewer.className = 'room-viewer'
  document.body.appendChild(roomViewer)

  const canvas = <HTMLCanvasElement>document.createElement('canvas')
  roomViewer.appendChild(canvas)

  const instrumentViewer = document.createElement('div')
  instrumentViewer.className = 'instrument-viewer'
  document.body.appendChild(instrumentViewer)

  canvas.width = roomViewer.clientWidth
  canvas.height = roomViewer.clientHeight

  const ctx = canvas.getContext('2d')

  const keyboard = new Keyboard(instrumentViewer)
  keyboard.render(window.innerWidth)

  const playDialog = new PlayDialog(document.body)

  document.addEventListener('click', (e) => {
    if (!initialised) {
      playDialog.destroy()
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
