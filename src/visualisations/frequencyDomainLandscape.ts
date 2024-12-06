import { drawCurveThroughPoints, scale } from '../modules/helpers'
import { ICoordinate } from '../modules/types'

export default class FrequencyDomainLandscape {
  ctx: CanvasRenderingContext2D
  colors: string[]
  audioAnalyser: AnalyserNode
  frequencyDataArray: Uint8Array
  sampleSize: number
  timeDataArrayHistory: number[][]
  spacingX: number
  spacingY: number
  historyLength: number
  timeOffset: number
  parentElement: HTMLElement
  constructor(
    parentElement: HTMLElement,
    ctx: CanvasRenderingContext2D,
    audioAnalyser: AnalyserNode
  ) {
    this.parentElement = parentElement
    this.ctx = ctx
    this.audioAnalyser = audioAnalyser
    this.frequencyDataArray = new Uint8Array(1024)
    this.sampleSize = 64
    this.spacingX = ctx.canvas.width / 1024
    this.historyLength = 150
    this.timeOffset = 3
    this.spacingY = (ctx.canvas.height - 40) / (this.historyLength - 1)
    this.timeDataArrayHistory = []
  }

  render() {
    this.spacingX = this.ctx.canvas.width / 1024
    this.spacingY = (this.ctx.canvas.height - 40) / (this.historyLength - 1)

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.audioAnalyser.getByteFrequencyData(this.frequencyDataArray)
    const frequencyData = this.frequencyDataArray.slice(0, this.sampleSize)

    if (this.timeDataArrayHistory.length >= this.historyLength) {
      this.timeDataArrayHistory.pop()
    }

    this.timeDataArrayHistory.unshift(Array.from(frequencyData))

    let offsetX = 0
    const offsetChange = this.ctx.canvas.width / 150
    for (
      let i = 0;
      i < this.timeDataArrayHistory.length;
      i += this.timeOffset
    ) {
      let apparentVolume = 0
      let spacingX = (this.ctx.canvas.width - offsetX * 2) / this.sampleSize
      let points: ICoordinate[] = []
      this.timeDataArrayHistory[i].forEach((data, index) => {
        apparentVolume += data
        const maxHeight = scale(i, 0, this.historyLength, 140, 5)
        const y = scale(data, 0, 256, 0, maxHeight)
        points.push({
          x: offsetX + index * spacingX,
          y: this.ctx.canvas.height - 20 - i * this.spacingY - y,
        })
      })

      const opacity = scale(apparentVolume, 0, 500, 0, 1)
      this.ctx.strokeStyle = `rgba(20,20,20,${opacity})`

      drawCurveThroughPoints(this.ctx, points)

      offsetX += offsetChange
    }
  }
}
