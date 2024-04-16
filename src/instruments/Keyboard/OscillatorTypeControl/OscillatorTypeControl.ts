import './styles.css'
const sineIcon = require('../../../icons/sine.svg')
const squareIcon = require('../../../icons/square.svg')
const triangleIcon = require('../../../icons/triangle.svg')
const sawToothIcon = require('../../../icons/sawTooth.svg')

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
    const oscillatorTypeIcons = document.createElement('div')
    oscillatorTypeIcons.className = 'oscillator-type-icons'
    this.bodyElement.appendChild(oscillatorTypeIcons)

    const sineIconImg = new Image()
    sineIconImg.src = sineIcon
    sineIconImg.className = 'oscillator-type-icon'
    oscillatorTypeIcons.appendChild(sineIconImg)

    const squareIconImg = new Image()
    squareIconImg.src = squareIcon
    squareIconImg.className = 'oscillator-type-icon'
    oscillatorTypeIcons.appendChild(squareIconImg)

    const triangleIconImg = new Image()
    triangleIconImg.src = triangleIcon
    triangleIconImg.className = 'oscillator-type-icon'
    oscillatorTypeIcons.appendChild(triangleIconImg)

    const sawIconImg = new Image()
    sawIconImg.src = sawToothIcon
    sawIconImg.className = 'oscillator-type-icon'
    oscillatorTypeIcons.appendChild(sawIconImg)

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
    if (this.selectedOscillator > this.oscillatorTypes.length - 1) {
      this.selectedOscillator = 0
    }

    this.onOscillatorTypeChanged(this.oscillatorTypes[this.selectedOscillator])
  }
}

export default OscillatorTypeControl
