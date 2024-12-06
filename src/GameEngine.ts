import AnimationController from './AnimationController'
import Keyboard from './instruments/Keyboard/Keyboard'

export default class GameEngine {
  keyboard: Keyboard
  ctx: CanvasRenderingContext2D
  roomViewer: HTMLElement
  instrumentViewer: HTMLElement
  animationController: AnimationController
  constructor(
    canvas: HTMLCanvasElement,
    instrumentViewerDiv: HTMLElement,
    roomViewerDiv: HTMLElement
  ) {
    this.ctx = canvas.getContext('2d')

    this.roomViewer = roomViewerDiv

    this.keyboard = new Keyboard(instrumentViewerDiv)
    this.keyboard.render(window.innerWidth)
  }

  public onWindowResize() {
    if (this.keyboard) {
      this.keyboard.onWindowResize(window.innerWidth)
    }
  }

  public initialise() {
    const audioContext: AudioContext = new AudioContext()

    const audioAnalyser = audioContext.createAnalyser()
    audioAnalyser.connect(audioContext.destination)

    this.keyboard.initialise(
      audioContext,
      audioAnalyser
    )

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
