import './styles.css'
import sineIcon from '../../../icons/sine.svg'
import squareIcon from '../../../icons/square.svg'
import triangleIcon from '../../../icons/triangle.svg'
import sawToothIcon from '../../../icons/sawtooth.svg'

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

    const sineIconDiv = document.createElement('div')
    sineIconDiv.innerHTML = sineIcon
    sineIconDiv.className = 'oscillator-type-icon'
    oscillatorTypeIcons.appendChild(sineIconDiv)

    const squareIconDiv = document.createElement('div')
    squareIconDiv.innerHTML = squareIcon
    squareIconDiv.className = 'oscillator-type-icon'
    oscillatorTypeIcons.appendChild(squareIconDiv)

    const triangleIconDiv = document.createElement('div')
    triangleIconDiv.innerHTML = triangleIcon
    triangleIconDiv.className = 'oscillator-type-icon'
    oscillatorTypeIcons.appendChild(triangleIconDiv)

    const sawIconImg = document.createElement('div')
    sawIconImg.innerHTML = sawToothIcon
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
