import './styles.css'

export default class PlayDialog {
  rootElement: HTMLElement
  constructor() {}

  public render(parentElement: HTMLElement) {
    const playDialogMilk = document.createElement('div')
    playDialogMilk.id = 'play-dialog-milk'
    parentElement.appendChild(playDialogMilk)
    this.rootElement = playDialogMilk

    const playDialog = document.createElement('div')
    playDialog.id = 'play-dialog'
    playDialogMilk.appendChild(playDialog)

    playDialog.innerHTML = `
      <div>
        <b>This application plays sounds...</b>
      </div>
      <ul>
        <li>
          Make sure your device isn't muted
        </li>
        <li>
          Click anywhere to continue
        </li>
      </ul>
    `
  }

  public destroy() {
    this.rootElement.remove()
  }
}
