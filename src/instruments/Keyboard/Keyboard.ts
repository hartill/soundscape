import './styles.css'
import notes from '../../modules/notes'
import OscillatorTypeControl, {
  OscillatorType,
} from './OscillatorTypeControl/OscillatorTypeControl'
import VolumeControl from './GainControl/GainControl'
import NoteDurationControl from './NoteDurationControl/NoteDurationControl'
import KeyboardKey from './KeyboardKey'
import { createElement } from '../../modules/helpers'

class Keyboard {
  isInitialised: boolean
  parentElement: HTMLElement
  controlsContainer: HTMLElement
  bodyElement: HTMLElement
  oscillatorType: OscillatorType
  gain: number
  gainNode: GainNode
  noteDuration: number
  audioContext?: AudioContext
  audioAnalyser?: AnalyserNode
  octaves: number[]
  majorNotes: string[]
  minorNotes: string[]
  keyboardKeys: KeyboardKey[]
  keyboardKeysContainer?: HTMLElement
  width: number

  constructor(parentElement: HTMLElement) {
    this.parentElement = parentElement
    this.oscillatorType = OscillatorType.SINE
    this.gain = 0.05
    this.noteDuration = 5
    this.majorNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    this.minorNotes = ['C#', 'Eb', 'F#', 'G#', 'Bb']
    this.octaves = [3]

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
  }

  public initialise(audioContext: AudioContext, audioAnalyser: AnalyserNode) {
    this.audioContext = audioContext
    this.audioAnalyser = audioAnalyser

    this.keyboardKeys.forEach((key) => {
      key.initialise(this.audioContext, this.audioAnalyser)
    })

    this.addKeyListeners()
  }

  public render(windowWidth: number) {
    this.width = windowWidth * 0.8

    if (this.width > 660) {
      this.octaves = [3, 4, 5]
    } else if (this.width > 400) {
      this.octaves = [4, 5]
    }

    this.keyboardKeys = []

    this.renderControls()
    this.renderKeyboard()
  }

  public onWindowResize(windowWidth: number) {
    this.width = windowWidth * 0.8

    if (this.width > 660) {
      this.octaves = [3, 4, 5]
    } else if (this.width > 400) {
      this.octaves = [4, 5]
    } else {
      this.octaves = [3]
    }

    this.keyboardKeys = []

    this.renderKeyboard()

    this.keyboardKeys.forEach((key) => {
      key.initialise(this.audioContext, this.audioAnalyser)
    })
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
      this.noteDuration,
      this.onFadeDurationChanged
    )
    noteDurationControl.render()
  }

  private renderKeyboard() {
    if (!this.keyboardKeysContainer) {
      this.keyboardKeysContainer = document.createElement('div')
      this.keyboardKeysContainer.className = 'keyboard-keys-container'
      this.bodyElement.appendChild(this.keyboardKeysContainer)
    } else {
      this.keyboardKeysContainer.innerHTML = ''
    }

    let majorKeyWidth = 0

    for (const octave of this.octaves) {
      for (const note of this.majorNotes) {
        const keyboardKey = new KeyboardKey(
          this.keyboardKeysContainer,
          this.gain,
          note,
          octave,
          notes[note][octave],
          this.noteDuration,
          this.oscillatorType,
          'major-key'
        )

        this.keyboardKeys.push(keyboardKey)
        majorKeyWidth = keyboardKey.bodyElement.offsetWidth
      }
    }

    const minorKeyContainer = document.createElement('div')
    minorKeyContainer.className = 'minor-keys-container'
    this.keyboardKeysContainer.appendChild(minorKeyContainer)

    let minorKeyGroups: HTMLElement[] = []

    for (const octave of this.octaves) {
      let index = 1

      const minorKeyGroup = document.createElement('div')
      minorKeyGroup.className = 'minor-key-group'
      minorKeyContainer.appendChild(minorKeyGroup)

      for (const note of this.minorNotes) {
        const keyboardKey = new KeyboardKey(
          minorKeyGroup,
          this.gain,
          note,
          octave,
          notes[note][octave],
          this.noteDuration,
          this.oscillatorType,
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
    this.keyboardKeys.forEach((keyboardKey) => {
      keyboardKey.changeOscillatorType(oscillatorType)
    })
  }

  public onGainChanged = (gain: number) => {
    this.keyboardKeys.forEach((keyboardKey) => {
      keyboardKey.changeGain(gain)
    })
  }

  public onFadeDurationChanged = (fadeDuration: number) => {
    this.keyboardKeys.forEach((keyboardKey) => {
      keyboardKey.changeFadeDuration(fadeDuration)
    })
  }
}

export default Keyboard
