import './styles.css'

export enum OscillatorType {
  SINE = 'sine',
  SQUARE = 'square',
  TRIANGLE = 'triangle',
  SAWTOOTH = 'sawtooth',
}

class OscillatorTypeControl {
  parentElement: HTMLElement
  bodyElement: HTMLElement
  oscillatorTypes: OscillatorType[]
  selectedOscillator: number
  onOscillatorTypeChanged: Function

  constructor(parentElement: HTMLElement, onOscillatorTypeChanged: Function) {
    this.parentElement = parentElement
    this.bodyElement = document.createElement('div')
    this.bodyElement.className = 'keyboard-controls-oscillator-type'
    this.parentElement.appendChild(this.bodyElement)
    this.oscillatorTypes = Object.values(OscillatorType)
    this.selectedOscillator = 0
    this.onOscillatorTypeChanged = onOscillatorTypeChanged
  }

  render() {
    const oscillatorTypeIndicator = document.createElement('div')
    oscillatorTypeIndicator.className = 'oscillator-type-indicator'
    this.bodyElement.appendChild(oscillatorTypeIndicator)

    this.bodyElement.addEventListener('pointerdown', () => {
      this.changeOscillatorType()
      oscillatorTypeIndicator.style.left =
        this.selectedOscillator * 20 + 20 + '%'
    })
  }

  private changeOscillatorType() {
    this.selectedOscillator += 1
    if (this.selectedOscillator > 3) {
      this.selectedOscillator = 0
    }

    this.onOscillatorTypeChanged(this.oscillatorTypes[this.selectedOscillator])
  }
}

export default OscillatorTypeControl
