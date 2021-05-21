import { size } from "../index"

export default class Unit {
  color: string
  x: number
  y: number

  constructor(color: string, x?: number, y?: number) {
    this.color = color
    this.x = x
    this.y = y
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, size, size)
  }

  drawAtRandomPosition(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    this.x = Math.floor(Math.random() * 30) * size
    this.y = Math.floor(Math.random() * 30) * size
    ctx.fillRect(this.x, this.y, size, size)
  }
}
