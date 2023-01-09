import WaveVisualisation from './visualisations/waveVisualisation'
import TimeDomainLandscape from './visualisations/timeDomainLandscape'
import FrequencyDomainLandscape from './visualisations/frequencyDomainLandscape'

export default class AnimationController {
  visualiser: WaveVisualisation | TimeDomainLandscape | FrequencyDomainLandscape
  constructor(parentElement: HTMLElement, ctx: CanvasRenderingContext2D, audioAnalyser: AnalyserNode) {
    ctx.canvas.width = parentElement.clientWidth
    ctx.canvas.height = parentElement.clientHeight
    //this.visualiser = new WaveVisualisation(parentElement, ctx, audioAnalyser)
    //this.visualiser = new TimeDomainLandscape(parentElement, ctx, audioAnalyser)
    this.visualiser = new FrequencyDomainLandscape(parentElement, ctx, audioAnalyser)
  }

  render() {
    this.visualiser.render()
  }
}
