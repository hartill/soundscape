import { OscillatorType } from "./OscillatorTypeControl/OscillatorTypeControl"

class KeyboardKey {
  bodyElement: HTMLElement
  gainNode: GainNode
  oscillator: OscillatorNode
  oscillatorType: OscillatorType
  audioContext?: AudioContext
  audioAnalyser?: AnalyserNode
  frequency: number
  fadeDuration: number
  gain: number
  note: string
  octave: number
  isPressed: boolean

  constructor(
    parentElement: HTMLElement,
    gain: number,
    note: string,
    octave: number,
    frequency: number,
    fadeDuration: number,
    oscillatorType: OscillatorType,
    extraClass: string
  ) {
    this.bodyElement = document.createElement('div')
    this.bodyElement.className = 'keyboard-key ' + extraClass
    this.fadeDuration = fadeDuration
    this.frequency = frequency
    this.oscillatorType = oscillatorType
    this.gain = gain
    this.note = note
    this.octave = octave
    this.isPressed = false
    this.gainNode = null
    this.oscillator = null

    parentElement.appendChild(this.bodyElement)
  }

  public initialise(audioContext: AudioContext, audioAnalyser: AnalyserNode) {
    this.audioContext = audioContext
    this.audioAnalyser = audioAnalyser

    this.addEventListeners()
  }

  private addEventListeners() {
    this.bodyElement.addEventListener('pointerdown', (e: PointerEvent) => {
      this.bodyElement.releasePointerCapture(e.pointerId)
      this.press()
    })

    this.bodyElement.addEventListener('pointerover', (e: PointerEvent) => {
      this.bodyElement.releasePointerCapture(e.pointerId)
      if (e.pointerType === 'mouse') {
        if (e.buttons === 1) {
          this.press()
        }
      } else {
        this.press()
      }
    })

    this.bodyElement.addEventListener('pointerup', () => {
      this.release()
    })

    this.bodyElement.addEventListener('pointerleave', () => {
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

    if (this.gainNode) {
      this.gainNode.gain.value = this.normaliseGain(this.gain)
      this.gainNode.gain.exponentialRampToValueAtTime(
        0.00001,
        this.audioContext.currentTime + this.fadeDuration
      )

      this.gainNode = null
    }

    if (this.oscillator) {
      this.oscillator.stop(
        this.audioContext.currentTime + this.fadeDuration + 0.03
      )
      this.oscillator = null
    }
  }

  private normaliseGain(gainIn: number): number {
    let gain = gainIn

    switch(this.oscillatorType) {
      case OscillatorType.SQUARE:
        gain = this.gain * 0.65
        break
      case OscillatorType.TRIANGLE:
        gain = this.gain * 1.1
        break
      case OscillatorType.SAWTOOTH:
        gain = this.gain * 0.85
        break
    }

    return gain
  }

  private playNote() {
    this.gainNode = this.audioContext.createGain()
    this.gainNode.gain.value = this.normaliseGain(this.gain)

    const limiterNode = this.audioContext.createDynamicsCompressor()

    this.oscillator = this.audioContext.createOscillator()
    this.oscillator.type = this.oscillatorType
    this.oscillator.frequency.value = this.frequency
    this.oscillator
      .connect(this.gainNode)
      .connect(limiterNode)
      .connect(this.audioAnalyser)
      .connect(this.audioContext.destination)
    this.oscillator.start(this.audioContext.currentTime)
  }

  public changeOscillatorType = (oscillatorType: OscillatorType) => {
    this.oscillatorType = oscillatorType
  }

  public changeGain = (gain: number) => {
    this.gain = gain
  }

  public changeFadeDuration = (fadeDuration: number) => {
    this.fadeDuration = fadeDuration
  }
}

export default KeyboardKey
