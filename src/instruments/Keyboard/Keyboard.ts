import './styles.css'
import notes from '../../modules/notes'
import OscillatorTypeControl, {
  OscillatorType,
} from './OscillatorTypeControl/OscillatorTypeControl'
import VolumeControl from './GainControl/GainControl'
import NoteDurationControl from './NoteDurationControl/NoteDurationControl'
import KeyboardKey from './KeyboardKey'
import { createElement } from '../../modules/helpers'

export interface IGainNodeOscillator {
  gainNode: GainNode
  oscillator: OscillatorNode
  idle: boolean
}

class Keyboard {
  context: AudioContext
  parentElement: HTMLElement
  controlsContainer: HTMLElement
  bodyElement: HTMLElement
  oscillatorType: OscillatorType
  gain: number
  fadeDuration: number
  audioAnalyser: AnalyserNode
  octaves: number[]
  majorNotes: string[]
  minorNotes: string[]
  keyboardKeys: KeyboardKey[]
  width: number
  gainNodeOscillators: IGainNodeOscillator[]

  constructor(
    context: AudioContext,
    parentElement: HTMLElement,
    audioAnalyser: AnalyserNode
  ) {
    this.context = context
    this.parentElement = parentElement
    this.oscillatorType = OscillatorType.SINE
    this.gain = 0.5
    this.fadeDuration = 5
    this.audioAnalyser = audioAnalyser
    this.gainNodeOscillators = []

    for (let i = 0; i < 10; i++) {
      this.gainNodeOscillators.push(this.createGainNodeOscillator())
    }

    /*
    var limiterNode = this.context.createDynamicsCompressor()
    limiterNode.threshold.setValueAtTime(-5.0, this.context.currentTime)
    limiterNode.knee.setValueAtTime(0, this.context.currentTime)
    limiterNode.ratio.setValueAtTime(40.0, this.context.currentTime)
    limiterNode.attack.setValueAtTime(0.001, this.context.currentTime)
    limiterNode.release.setValueAtTime(0.1, this.context.currentTime)
    this.gainNode.connect(limiterNode)*/

    const keybordOuterElement = createElement(
      this.parentElement,
      'div',
      'keyboard-outer'
    )

    this.controlsContainer = createElement(
      keybordOuterElement,
      'div',
      'keyboard-controls-container'
    )

    const keyboardBodyContainer = createElement(
      keybordOuterElement,
      'div',
      'keyboard-body-container'
    )

    createElement(keyboardBodyContainer, 'div', 'keyboard-speaker')

    this.bodyElement = createElement(keyboardBodyContainer, 'div', 'keyboard')

    createElement(keyboardBodyContainer, 'div', 'keyboard-speaker')

    this.width =
      this.bodyElement.offsetWidth - 0.2 * this.bodyElement.offsetWidth

    this.octaves = [3]

    if (this.width > 600) {
      this.octaves = [3, 4, 5]
    } else if (this.width > 400) {
      this.octaves = [4, 5]
    }

    this.majorNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    this.minorNotes = ['C#', 'Eb', 'F#', 'G#', 'Bb']

    this.keyboardKeys = []
    this.addKeyListeners()
  }

  private createGainNodeOscillator(): IGainNodeOscillator {
    const gainNode = this.context.createGain()
    gainNode.connect(this.context.destination)
    gainNode.gain.value = this.gain
    gainNode.connect(this.audioAnalyser)

    const oscillator = this.context.createOscillator()
    oscillator.type = this.oscillatorType
    oscillator.connect(gainNode)

    return {
      gainNode: gainNode,
      oscillator: oscillator,
      idle: true,
    }
  }

  public render() {
    this.renderControls()
    this.renderKeyboard()
  }

  private renderControls() {
    const oscillatorTypeControl = new OscillatorTypeControl(
      this.controlsContainer,
      this.onOscillatorTypeChanged
    )
    oscillatorTypeControl.render()

    const volumeControl = new VolumeControl(
      this.controlsContainer,
      this.gain,
      this.onGainChanged
    )
    volumeControl.render()

    const noteDurationControl = new NoteDurationControl(
      this.controlsContainer,
      this.fadeDuration,
      this.onFadeDurationChanged
    )
    noteDurationControl.render()
  }

  private renderKeyboard() {
    const keyboardKeysContainer = document.createElement('div')
    keyboardKeysContainer.className = 'keyboard-keys-container'
    this.bodyElement.appendChild(keyboardKeysContainer)
    let majorKeyWidth = 0

    for (const octave of this.octaves) {
      for (const note of this.majorNotes) {
        const keyboardKey = new KeyboardKey(
          this.context,
          this.gainNodeOscillators,
          keyboardKeysContainer,
          note,
          octave,
          notes[note][octave],
          this.fadeDuration,
          'major-key'
        )

        this.keyboardKeys.push(keyboardKey)
        majorKeyWidth = keyboardKey.bodyElement.offsetWidth
      }
    }

    const minorKeyContainer = document.createElement('div')
    minorKeyContainer.className = 'minor-keys-container'
    keyboardKeysContainer.appendChild(minorKeyContainer)

    let minorKeyGroups: HTMLElement[] = []

    for (const octave of this.octaves) {
      let index = 1

      const minorKeyGroup = document.createElement('div')
      minorKeyGroup.className = 'minor-key-group'
      minorKeyContainer.appendChild(minorKeyGroup)

      for (const note of this.minorNotes) {
        const keyboardKey = new KeyboardKey(
          this.context,
          this.gainNodeOscillators,
          minorKeyGroup,
          note,
          octave,
          notes[note][octave],
          this.fadeDuration,
          'minor-key'
        )

        this.keyboardKeys.push(keyboardKey)

        if (index == 2) {
          const keyElement = document.createElement('div')
          keyElement.className = 'minor-key hidden'

          minorKeyGroup.appendChild(keyElement)
        }

        index += 1
        minorKeyGroups.push(minorKeyGroup)
      }
    }

    minorKeyGroups.forEach((minorKeyGroup) => {
      const minorKeyWidth = 0.1 * minorKeyGroup.offsetWidth
      const padding = majorKeyWidth - 0.32 * minorKeyWidth
      minorKeyGroup.style.padding = '0 ' + padding + 'px'
    })
  }

  private addKeyListeners() {
    const octave = 4
    const keyboardConfig = [
      {
        note: 'C',
        keyboardKey: 's',
      },
      {
        note: 'C#',
        keyboardKey: 'e',
      },
      {
        note: 'D',
        keyboardKey: 'd',
      },
      {
        note: 'Eb',
        keyboardKey: 'r',
      },
      {
        note: 'E',
        keyboardKey: 'f',
      },
      {
        note: 'F',
        keyboardKey: 'g',
      },
      {
        note: 'F#',
        keyboardKey: 'y',
      },
      {
        note: 'G',
        keyboardKey: 'h',
      },
      {
        note: 'G#',
        keyboardKey: 'u',
      },
      {
        note: 'A',
        keyboardKey: 'j',
      },
      {
        note: 'Bb',
        keyboardKey: 'i',
      },
      {
        note: 'B',
        keyboardKey: 'k',
      },
    ]
    window.addEventListener('keydown', (event) => {
      keyboardConfig.forEach((config) => {
        if (config.keyboardKey === event.key) {
          this.keyboardKeys.forEach((keyboardKey) => {
            if (
              keyboardKey.note === config.note &&
              keyboardKey.octave === octave
            ) {
              keyboardKey.press()
            }
          })
          return
        }
      })
    })

    window.addEventListener('keyup', (event) => {
      keyboardConfig.forEach((config) => {
        if (config.keyboardKey === event.key) {
          this.keyboardKeys.forEach((keyboardKey) => {
            if (
              keyboardKey.note === config.note &&
              keyboardKey.octave === octave
            ) {
              keyboardKey.release()
            }
          })
          return
        }
      })
    })
  }

  public onOscillatorTypeChanged = (oscillatorType: OscillatorType) => {
    this.gainNodeOscillators.forEach((gainNodeOscillator) => {
      gainNodeOscillator.oscillator.type = oscillatorType
    })
  }

  public onGainChanged = (gain: number) => {
    this.gain = gain
    this.gainNodeOscillators.forEach((gainNodeOscillator) => {
      gainNodeOscillator.gainNode.gain.value = gain
    })
  }

  public onFadeDurationChanged = (fadeDuration: number) => {
    this.keyboardKeys.forEach((keyboardKey) => {
      keyboardKey.changeFadeDuration(fadeDuration)
    })
  }
}

export default Keyboard
