import './styles.css'

class NoteDurationControl {
  parentElement: HTMLElement
  bodyElement: HTMLElement
  onNoteDurationChanged: Function
  noteDuration: number

  constructor(
    parentElement: HTMLElement,
    initialNoteDuration: number,
    onNoteDurationChanged: Function
  ) {
    this.parentElement = parentElement
    this.bodyElement = document.createElement('div')
    this.bodyElement.className = 'keyboard-control-note-duration'
    this.parentElement.appendChild(this.bodyElement)
    this.onNoteDurationChanged = onNoteDurationChanged
    this.noteDuration = initialNoteDuration
  }

  render() {
    const noteDurationIndicator = document.createElement('div')
    noteDurationIndicator.className =
      'note-duration-indicator'
    this.bodyElement.appendChild(noteDurationIndicator)
    noteDurationIndicator.textContent = this.noteDuration.toString()

    const noteDurationButtons = document.createElement('div')
    noteDurationButtons.className = 'note-duration-buttons-container'
    this.bodyElement.appendChild(noteDurationButtons)

    const keyboardVolumeIncreaseBtn = document.createElement('div')
    keyboardVolumeIncreaseBtn.className = 'note-duration-button'
    noteDurationButtons.appendChild(keyboardVolumeIncreaseBtn)
    keyboardVolumeIncreaseBtn.textContent = '+'

    keyboardVolumeIncreaseBtn.addEventListener('pointerdown', () => {
      this.increaseNoteDuration()
      noteDurationIndicator.textContent = this.noteDuration.toString()
    })

    const keyboardVolumeDecreaseBtn = document.createElement('div')
    keyboardVolumeDecreaseBtn.className = 'note-duration-button'
    noteDurationButtons.appendChild(keyboardVolumeDecreaseBtn)
    keyboardVolumeDecreaseBtn.textContent = '-'

    keyboardVolumeDecreaseBtn.addEventListener('pointerdown', () => {
      this.decreaseNoteDuration()
      noteDurationIndicator.textContent = this.noteDuration.toString()
    })
  }

  private increaseNoteDuration() {
    if (this.noteDuration < 100) {
      this.noteDuration += 1
      this.onNoteDurationChanged(this.noteDuration)
    }
  }

  private decreaseNoteDuration() {
    if (this.noteDuration > 0) {
      this.noteDuration -= 1
      this.onNoteDurationChanged(this.noteDuration)
    }
  }
}

export default NoteDurationControl
