class KeyboardKey {
  context: AudioContext
  bodyElement: HTMLElement
  gainNode: GainNode
  oscillator: OscillatorNode
  oscillatorType: OscillatorType
  audioAnalyser: AnalyserNode
  frequency: number
  fadeDuration: number
  gain: number
  note: string
  octave: number
  isPressed: boolean

  constructor(
    context: AudioContext,
    audioAnalyser: AnalyserNode,
    parentElement: HTMLElement,
    gain: number,
    note: string,
    octave: number,
    frequency: number,
    fadeDuration: number,
    oscillatorType: OscillatorType,
    extraClass: string
  ) {
    this.context = context
    this.audioAnalyser = audioAnalyser
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

    this.addEventListeners()
  }

  private addEventListeners() {
    this.bodyElement.addEventListener('pointerdown', () => {
      this.press()
    })

    this.bodyElement.addEventListener('pointerover', (e) => {
      if(e.pointerType === 'mouse') {
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
      this.gainNode.gain.value = this.gain
      this.gainNode.gain.exponentialRampToValueAtTime(
        0.00001,
        this.context.currentTime + this.fadeDuration
      )

      this.gainNode = null
    }

    if (this.oscillator) {
      this.oscillator.stop(this.context.currentTime + this.fadeDuration + 0.03)
      this.oscillator = null
    }
  }

  private playNote() {
    this.gainNode = this.context.createGain()
    this.gainNode.gain.value = this.gain

    const limiterNode = this.context.createDynamicsCompressor()

    this.oscillator = this.context.createOscillator()
    this.oscillator.type = this.oscillatorType
    this.oscillator.frequency.value = this.frequency
    this.oscillator
      .connect(this.gainNode)
      .connect(limiterNode)
      .connect(this.audioAnalyser)
      .connect(this.context.destination)
    this.oscillator.start(this.context.currentTime)
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
