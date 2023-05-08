import './styles.css'

class GainControl {
  parentElement: HTMLElement
  bodyElement: HTMLElement
  onGainChanged: Function
  gain: number
  maxGain: number

  constructor(
    parentElement: HTMLElement,
    initialGain: number,
    onGainChanged: Function
  ) {
    this.parentElement = parentElement
    this.bodyElement = document.createElement('div')
    this.bodyElement.className = 'keyboard-gain-control'
    this.parentElement.appendChild(this.bodyElement)
    this.onGainChanged = onGainChanged
    this.gain = initialGain
    this.maxGain = 0.1
  }

  render() {
    const gainIndicator = document.createElement('div')
    gainIndicator.className = 'gain-control-indicator'
    this.bodyElement.appendChild(gainIndicator)
    this.renderGainBars(gainIndicator)

    const gainButtonsContainer = document.createElement('div')
    gainButtonsContainer.className = 'gain-buttons-container'
    this.bodyElement.appendChild(gainButtonsContainer)

    const increaseGainBtn = document.createElement('div')
    increaseGainBtn.className = 'gain-btn'
    gainButtonsContainer.appendChild(increaseGainBtn)
    increaseGainBtn.textContent = '+'

    increaseGainBtn.addEventListener('pointerdown', () => {
      this.increaseGain()
      this.renderGainBars(gainIndicator)
    })

    const decreaseGainBtn = document.createElement('div')
    decreaseGainBtn.className = 'gain-btn'
    gainButtonsContainer.appendChild(decreaseGainBtn)
    decreaseGainBtn.textContent = '-'

    decreaseGainBtn.addEventListener('pointerdown', () => {
      this.decreaseGain()
      this.renderGainBars(gainIndicator)
    })
  }

  private renderGainBars(containerElement: HTMLElement) {
    containerElement.innerHTML = ''
    const percentageGain = Math.round((this.gain / this.maxGain) * 100)
    for (let i = 10; i <= 100; i += 10) {
      const gainBar = document.createElement('div')
      const extraClass = i <= percentageGain ? ' filled' : ''
      gainBar.className = 'gain-bar' + extraClass
      gainBar.style.height = i + '%'
      containerElement.appendChild(gainBar)
    }
  }

  private increaseGain() {
    if (this.gain < this.maxGain) {
      this.gain = this.gain + this.maxGain / 10
      this.onGainChanged(this.gain)
    }
  }

  private decreaseGain() {
    if (this.gain > 0) {
      this.gain = this.gain - this.maxGain / 10
      this.onGainChanged(this.gain)
    }
  }
}

export default GainControl
