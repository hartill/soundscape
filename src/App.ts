import AnimationController from './AnimationController'
import PlayDialog from './components/PlayDialog'
import Keyboard from './instruments/Keyboard/Keyboard'

export default class App {
  playDialog: PlayDialog
  keyboard: Keyboard
  ctx: CanvasRenderingContext2D
  roomViewer: HTMLElement
  constructor() {
    this.roomViewer = document.createElement('div')
    this.roomViewer.className = 'room-viewer'
    document.body.appendChild(this.roomViewer)

    const canvas = <HTMLCanvasElement>document.createElement('canvas')
    this.roomViewer.appendChild(canvas)

    const instrumentViewer = document.createElement('div')
    instrumentViewer.className = 'instrument-viewer'
    document.body.appendChild(instrumentViewer)

    canvas.width = this.roomViewer.clientWidth
    canvas.height = this.roomViewer.clientHeight

    this.ctx = canvas.getContext('2d')

    this.keyboard = new Keyboard(instrumentViewer)
    this.keyboard.render(window.innerWidth)

    this.playDialog = new PlayDialog()
    this.playDialog.render(document.body)
  }

  public initialise() {
    this.playDialog.destroy()
    const audioContext: AudioContext = new AudioContext()

    const audioAnalyser = audioContext.createAnalyser()
    audioAnalyser.connect(audioContext.destination)

    this.keyboard.initialise(audioContext, audioAnalyser)

    const animationController = new AnimationController(
      this.roomViewer,
      this.ctx,
      audioAnalyser
    )

    animationController.initialise()
  }
}
