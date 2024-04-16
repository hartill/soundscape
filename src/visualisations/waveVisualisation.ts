import { drawCurveThroughPoints, scale } from '../modules/helpers'
import { ICoordinate } from '../modules/types'

export default class WaveVisualisation {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  colors: string[]
  audioAnalyser: AnalyserNode
  frequencyDataArray: Uint8Array
  timeDataArray: Uint8Array
  sampleSize: number
  spacingX: number
  constructor(
    parentElement: HTMLElement,
    ctx: CanvasRenderingContext2D,
    audioAnalyser: AnalyserNode
  ) {
    this.ctx = ctx
    this.audioAnalyser = audioAnalyser
    this.frequencyDataArray = new Uint8Array(1024)
    this.timeDataArray = new Uint8Array(1024)
    this.sampleSize = 128
    this.width = parentElement.clientWidth
    this.height = parentElement.clientHeight
    this.spacingX = this.width / 1024
  }

  calculateYWavePosition(input: number) {
    const y = scale(
      input,
      0,
      256,
      -this.ctx.canvas.height / 2,
      this.ctx.canvas.height / 2
    )

    const output = this.ctx.canvas.height / 2 + y

    return output
  }

  render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    
    this.audioAnalyser.getByteFrequencyData(this.frequencyDataArray)

    const frequencyData = this.frequencyDataArray.slice(0, this.sampleSize)
    let apparentVolume = 0

    frequencyData.forEach((data, index) => {
      if (data > 20) {
        apparentVolume += data
        const radius = scale(index, 0, this.sampleSize, 0, this.height)
        const opacity = scale(data, 0, 256, 0, 1)
        this.ctx.strokeStyle = `rgba(20,20,20,${opacity})`
        this.ctx.beginPath()
        this.ctx.arc(this.width / 2, this.height / 2, radius, 0, 2 * Math.PI)
        this.ctx.closePath()
        this.ctx.stroke()
      }
    })

    let points: ICoordinate[] = []

    if (apparentVolume > 300) {
      this.audioAnalyser.getByteTimeDomainData(this.timeDataArray)
      this.timeDataArray.forEach((data, index) => {
        const y = this.calculateYWavePosition(data)
        points.push({
          x: index * this.spacingX,
          y: y,
        })
      })

      drawCurveThroughPoints(this.ctx, points)
    }
  }
}
