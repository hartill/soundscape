import './styles.css'
import { scale } from './modules/helpers'
import Keyboard from './instruments/Keyboard/Keyboard'
import AnimationController from './animationController'

window.addEventListener('load', (event) => {
  const bodyElement = document.body

  const roomViewer = document.createElement('div')
  roomViewer.className = 'room-viewer'
  bodyElement.appendChild(roomViewer)

  const htmlCanvas = <HTMLCanvasElement>document.createElement('canvas')
  roomViewer.appendChild(htmlCanvas)
  const ctx = htmlCanvas.getContext('2d')

  const instrumentViewer = document.createElement('div')
  instrumentViewer.className = 'instrument-viewer'
  bodyElement.appendChild(instrumentViewer)

  const context: AudioContext = new AudioContext()
  const audioAnalyser = context.createAnalyser()
  audioAnalyser.connect(context.destination)

  const keyboard = new Keyboard(context, instrumentViewer, audioAnalyser)
  keyboard.render()

  const animationController = new AnimationController(roomViewer, ctx, audioAnalyser)

  function animate() {
    ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height)

    animationController.render()
  }

  setInterval(animate, 1000 / 60)
})
