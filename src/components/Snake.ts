import { size } from "../index"
import Unit from "./Unit"

export default class Snake {
  x: number
  y: number
  color: string
  direction: string
  body: Unit[] = []
  tail: Unit
  head: Unit

  constructor(x: number, y: number, color: string) {
    this.x = x
    this.y = y
    this.color = color
    this.direction = "ArrowRight"
    this.head = new Unit(this.color, this.x, this.y)
    this.body.push(this.head)
    this.tail = this.body[this.body.length - 1]
    window.addEventListener("keydown", (event) => {
      if (
        (event.key == "ArrowRight" && this.direction == "ArrowLeft") ||
        (event.key == "ArrowLeft" && this.direction == "ArrowRight") ||
        (event.key == "ArrowUp" && this.direction == "ArrowDown") ||
        (event.key == "ArrowDown" && this.direction == "ArrowUp")
      ) {
        return
      }
      this.direction = event.key
    })
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.head.x, this.head.y, size, size)
  }
  update(ctx: CanvasRenderingContext2D) {
    //Special case: when length of snake is 1
    if (this.head == this.tail) {
      ctx.clearRect(this.head.x, this.head.y, size, size)
      ctx.beginPath()
      ctx.moveTo(this.head.x, this.head.y)
      ctx.lineTo(this.head.x + size, this.head.y)
      ctx.lineTo(this.head.x + size, this.head.y + size)
      ctx.lineTo(this.head.x, this.head.y + size)
      ctx.closePath()
      ctx.stroke()

      switch (this.direction) {
        case "ArrowUp":
          this.head.y -= size
          break
        case "ArrowRight":
          this.head.x += size
          break
        case "ArrowDown":
          this.head.y += size
          break
        case "ArrowLeft":
          this.head.x -= size
          break
      }
      this.draw(ctx)
      return
    }

    ctx.clearRect(this.tail.x, this.tail.y, size, size)
    ctx.beginPath()
    ctx.moveTo(this.tail.x, this.tail.y)
    ctx.lineTo(this.tail.x + size, this.tail.y)
    ctx.lineTo(this.tail.x + size, this.tail.y + size)
    ctx.lineTo(this.tail.x, this.tail.y + size)
    ctx.closePath()
    ctx.stroke()
    for (let i = this.body.length - 1; i > 0; i--) {
      const current = this.body[i]
      const following = this.body[i - 1]
      ctx.fillStyle = this.color
      if (following.x != current.x) {
        current.x = following.x
      } else if (following.y != current.y) {
        current.y = following.y
      }
    }
    switch (this.direction) {
      case "ArrowUp":
        this.head.y -= size
        break
      case "ArrowRight":
        this.head.x += size
        break
      case "ArrowDown":
        this.head.y += size
        break
      case "ArrowLeft":
        this.head.x -= size
        break
    }
    this.draw(ctx)
  }
  grow() {
    switch (this.direction) {
      case "ArrowUp":
        this.body.push(new Unit(this.color, this.tail.x, this.tail.y + size))
        break
      case "ArrowRight":
        this.body.push(new Unit(this.color, this.tail.x - size, this.tail.y))
        break
      case "ArrowDown":
        this.body.push(new Unit(this.color, this.tail.x, this.tail.y - size))
        break
      case "ArrowLeft":
        this.body.push(new Unit(this.color, this.tail.x + size, this.tail.y))
        break
    }
    this.tail = this.body[this.body.length - 1]
  }

  eraseTail() {}
}
