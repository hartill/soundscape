import { drawCurveThroughPoints, scale } from '../modules/helpers'
import { ICoordinate } from '../modules/types'

export default class TimeDomainLandscape {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  colors: string[]
  audioAnalyser: AnalyserNode
  timeDataArray: Uint8Array
  timeDataArrayHistory: number[][]
  spacingX: number
  spacingY: number
  historyLength: number
  timeOffset: number
  constructor(
    parentElement: HTMLElement,
    ctx: CanvasRenderingContext2D,
    audioAnalyser: AnalyserNode
  ) {
    this.ctx = ctx
    this.audioAnalyser = audioAnalyser
    this.timeDataArray = new Uint8Array(1024)
    this.width = parentElement.clientWidth
    this.height = parentElement.clientHeight
    this.spacingX = this.width / 1024
    this.historyLength = 150
    this.timeOffset = 3
    this.spacingY = (this.height - 40) / (this.historyLength - 1)
    this.timeDataArrayHistory = []
  }

  render() {
    this.audioAnalyser.getByteTimeDomainData(this.timeDataArray)
    //this.audioAnalyser.getByteFrequencyData(this.timeDataArray)

    if (this.timeDataArrayHistory.length >= this.historyLength) {
      this.timeDataArrayHistory.pop()
    }

    this.timeDataArrayHistory.unshift(Array.from(this.timeDataArray))

    let offsetX = 0
    for (
      let i = 0;
      i < this.timeDataArrayHistory.length;
      i += this.timeOffset
    ) {
      let spacingX = (this.width - offsetX * 2) / 1024
      let points: ICoordinate[] = []
      this.timeDataArrayHistory[i].forEach((data, index) => {
        const minHeight = scale(i, 0, this.historyLength, -20, -5)
        const maxHeight = scale(i, 0, this.historyLength, 20, 5)
        const y = scale(data, 0, 256, minHeight, maxHeight)
        points.push({
          x: offsetX + index * spacingX,
          y: this.height - 20 - i * this.spacingY + y,
        })
      })

      drawCurveThroughPoints(this.ctx, points)

      offsetX += 10
    }
  }
}
