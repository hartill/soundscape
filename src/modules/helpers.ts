import { ICoordinate } from './types'

export function scale(
  number: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

export function createElement(
  parentElement: HTMLElement,
  type: string,
  className: string
): HTMLElement {
  const newElement = document.createElement(type)
  newElement.className = className
  parentElement.appendChild(newElement)
  return newElement
}

export function drawCurveThroughPoints(
  ctx: CanvasRenderingContext2D,
  points: ICoordinate[],
) {
  ctx.moveTo(points[0].x, points[0].y)
  ctx.beginPath()

  for (let i = 1; i < points.length - 2; i++) {
    var xc = (points[i].x + points[i + 1].x) / 2
    var yc = (points[i].y + points[i + 1].y) / 2
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
  }

  ctx.quadraticCurveTo(
    points[points.length - 2].x,
    points[points.length - 2].y,
    points[points.length - 1].x,
    points[points.length - 1].y
  )

  ctx.stroke()

  ctx.closePath()
}
