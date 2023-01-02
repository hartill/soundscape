import { IGainNodeOscillator } from "./Keyboard"

class KeyboardKey {
  context: AudioContext
  bodyElement: HTMLElement
  gainNodeOscillators: IGainNodeOscillator[]
  audioAnalyser: AnalyserNode
  frequency: number
  fadeDuration: number
  note: string
  octave: number
  isPressed: boolean

  constructor(
    context: AudioContext,
    gainNodeOscillators: IGainNodeOscillator[],
    parentElement: HTMLElement,
    note: string,
    octave: number,
    frequency: number,
    fadeDuration: number,
    extraClass: string
  ) {
    this.context = context
    this.gainNodeOscillators = gainNodeOscillators
    this.bodyElement = document.createElement('div')
    this.bodyElement.className = 'keyboard-key ' + extraClass
    this.fadeDuration = fadeDuration
    this.frequency = frequency
    this.note = note
    this.octave = octave
    this.isPressed = false

    parentElement.appendChild(this.bodyElement)

    this.addEventListeners()
  }

  private addEventListeners() {
    this.bodyElement.addEventListener('mousedown', () => {
      this.press()
    })

    this.bodyElement.addEventListener('mouseup', () => {
      this.release()
    })

    this.bodyElement.addEventListener('mouseleave', () => {
      this.release()
    })
  }

  public press() {
    if (!this.isPressed) {
      this.isPressed = true
      this.bodyElement.classList.add('pressed')
      this.playNote()
    }
  }

  public release() {
    if (this.isPressed) {
      this.bodyElement.classList.remove('pressed')
      this.isPressed = false
    }

    this.gainNodeOscillators.forEach((gainNodeOscillator) => {
      console.log(gainNodeOscillator)
      if (
        !gainNodeOscillator.idle &&
        gainNodeOscillator.oscillator.frequency.value === this.frequency
      ) {
        gainNodeOscillator.gainNode.gain.exponentialRampToValueAtTime(
          0.00001,
          this.context.currentTime + this.fadeDuration
        )
        window.setTimeout(() => gainNodeOscillator.idle = true, this.fadeDuration)
        return
      }
    })
  }

  private playNote() {
    this.gainNodeOscillators.every((gainNodeOscillator) => {
      if (gainNodeOscillator.idle) {
        console.log(gainNodeOscillator)
        gainNodeOscillator.oscillator.frequency.value = this.frequency
        gainNodeOscillator.oscillator.start(0)
        gainNodeOscillator.idle = false
        return false
      }
      return true
    })
  }

  public changeFadeDuration = (fadeDuration: number) => {
    this.fadeDuration = fadeDuration
  }
}

export default KeyboardKey
