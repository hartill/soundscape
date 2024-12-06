import { useEffect, useRef, useState } from 'react'
import PlayDialog from './components/PlayDialog'
import useWindowSize from './hooks/useWindowSize'
import GameEngine from './GameEngine'
import { InstrumentViewer, RoomViewer } from './styles'

export default function App() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const roomViewer = useRef<HTMLDivElement>(null)
  const instrumentViewer = useRef<HTMLDivElement>(null)
  const [windowWidth, windowHeight] = useWindowSize()
  const [gameEngine, setGameEngine] = useState<GameEngine>()
  const [playDialogVisible, setPlayDialogVisible] = useState<boolean>(true)

  useEffect(() => {
    if (canvas.current && instrumentViewer.current && roomViewer.current) {
      if (!gameEngine) {
        const gameEngine = new GameEngine(
          canvas.current,
          instrumentViewer.current,
          roomViewer.current
        )
        setGameEngine(gameEngine)
      }
    }
  }, [canvas, instrumentViewer, roomViewer])

  useEffect(() => {
    if (canvas.current && roomViewer.current && instrumentViewer.current) {
      let instrumentViewerHeight = 220
      if (windowHeight < 400) {
        instrumentViewerHeight = 180
      }
      let roomViewerHeight = windowHeight - instrumentViewerHeight

      instrumentViewer.current.style.height = `${instrumentViewerHeight}px`
      roomViewer.current.style.height = `${roomViewerHeight}px`

      canvas.current.width = roomViewer.current.clientWidth
      canvas.current.height = roomViewer.current.clientHeight

      if (gameEngine) {
        gameEngine.onWindowResize()
      }
    }
  }, [
    canvas.current,
    roomViewer.current,
    instrumentViewer.current,
    windowWidth,
    windowHeight,
  ])

  const handleClosePlayDialog = () => {
    setPlayDialogVisible(false)

    if (gameEngine) {
      gameEngine.initialise()
    }
  }

  const handleChangeVisiualiser = () => {
    gameEngine.changeVisualiser()
  }

  return (
    <>
      {playDialogVisible && <PlayDialog handleClose={handleClosePlayDialog} />}
      <RoomViewer ref={roomViewer}>
        <canvas ref={canvas} onClick={handleChangeVisiualiser}/>
      </RoomViewer>
      <InstrumentViewer ref={instrumentViewer} />
    </>
  )
}

/*
export default class App {
  playDialog: PlayDialog
  keyboard: Keyboard
  ctx: CanvasRenderingContext2D
  roomViewer: HTMLElement
  instrumentViewer: HTMLElement
  animationController: AnimationController
  constructor() {


    this.ctx = canvas.getContext('2d')

    this.keyboard = new Keyboard(this.instrumentViewer)
    this.keyboard.render(window.innerWidth)

    this.playDialog = new PlayDialog()
    this.playDialog.render(document.body)

    window.onresize = (e) => {
      this.onWindowResize()
    }
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
*/
