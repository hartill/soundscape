import AnimationController from './AnimationController'
import PlayDialog from './components/PlayDialog'
import Keyboard from './instruments/Keyboard/Keyboard'

export default class App {
  playDialog: PlayDialog
  keyboard: Keyboard
  ctx: CanvasRenderingContext2D
  roomViewer: HTMLElement
  instrumentViewer: HTMLElement
  animationController: AnimationController
  constructor() {
    this.roomViewer = document.createElement('div')
    this.roomViewer.className = 'room-viewer'
    document.body.appendChild(this.roomViewer)

    const canvas = <HTMLCanvasElement>document.createElement('canvas')
    this.roomViewer.appendChild(canvas)

    this.instrumentViewer = document.createElement('div')
    this.instrumentViewer.className = 'instrument-viewer'
    document.body.appendChild(this.instrumentViewer)

    this.ctx = canvas.getContext('2d')

    this.setupSizes()

    this.keyboard = new Keyboard(this.instrumentViewer)
    this.keyboard.render(window.innerWidth)

    this.playDialog = new PlayDialog()
    this.playDialog.render(document.body)

    window.onresize = (e) => {
      this.onWindowResize()
    }
  }

  private setupSizes() {
    const windowHeight = window.innerHeight

    let instrumentViewerHeight = 220
    if (windowHeight < 400) {
      instrumentViewerHeight = 180
    }
    let roomViewerHeight = windowHeight - instrumentViewerHeight

    this.instrumentViewer.style.height = `${instrumentViewerHeight}px`
    this.roomViewer.style.height = `${roomViewerHeight}px`

    this.ctx.canvas.width = this.roomViewer.clientWidth
    this.ctx.canvas.height = this.roomViewer.clientHeight
  }

  private onWindowResize() {
    this.setupSizes()
    if (this.keyboard) {
      this.keyboard.onWindowResize(window.innerWidth)
    }
    if (this.animationController) {
      this.animationController.onWindowSizeChange()
    }
  }

  public initialise() {
    this.playDialog.destroy()
    const audioContext: AudioContext = new AudioContext()

    const audioAnalyser = audioContext.createAnalyser()
    audioAnalyser.connect(audioContext.destination)

    this.keyboard.initialise(audioContext, audioAnalyser, this.changeVisualiser.bind(this))

    this.animationController = new AnimationController(
      this.roomViewer,
      this.ctx,
      audioAnalyser
    )

    this.animationController.initialise()
  }

  public changeVisualiser() {
    this.animationController?.toggleVisualiser()
  }
}
