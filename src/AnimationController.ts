import WaveVisualisation from './visualisations/waveVisualisation'
import FrequencyDomainLandscape from './visualisations/frequencyDomainLandscape'
export default class AnimationController {
  parentElement: HTMLElement
  ctx: CanvasRenderingContext2D
  audioAnalyser: AnalyserNode
  visualiser: WaveVisualisation | FrequencyDomainLandscape
  selectedVisualiser: number
  constructor(
    parentElement: HTMLElement,
    ctx: CanvasRenderingContext2D,
    audioAnalyser: AnalyserNode
  ) {
    this.parentElement = parentElement
    this.ctx = ctx
    this.audioAnalyser = audioAnalyser

    this.selectedVisualiser = 0
    this.setVisualiser()
  }

  public toggleVisualiser() {
    this.selectedVisualiser += 1

    if (this.selectedVisualiser > 1) {
      this.selectedVisualiser = 0
    }

    this.setVisualiser()
  }

  private setVisualiser() {
    switch (this.selectedVisualiser) {
      case 0:
        this.visualiser = new FrequencyDomainLandscape(
          this.parentElement,
          this.ctx,
          this.audioAnalyser
        )
        return
      case 1:
        this.visualiser = new WaveVisualisation(
          this.parentElement,
          this.ctx,
          this.audioAnalyser
        )
        return
    }
  }

  public initialise() {
    requestAnimationFrame(this.update.bind(this))
  }

  private update() {
    requestAnimationFrame(this.update.bind(this))
    this.visualiser.render()
  }

  public onWindowSizeChange() {
    this.visualiser.onWindowSizeChange()
  }
}
