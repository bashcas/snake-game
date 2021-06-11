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
  previousHead: Unit
  previousTail: Unit
  lastKeyPressedTime: number

  constructor(x: number, y: number, color: string) {
    this.x = x
    this.y = y
    this.color = color
    this.direction = "ArrowRight"
    this.head = new Unit(this.color, this.x, this.y)
    this.previousHead = new Unit(this.color, this.x, this.y)
    this.body.push(this.head)
    this.tail = this.body[this.body.length - 1]
    this.previousTail = new Unit(this.color, this.x, this.y)
    this.lastKeyPressedTime = 0
    window.addEventListener("keydown", (event) => {
      if (event.timeStamp - this.lastKeyPressedTime < 50) return
      this.lastKeyPressedTime = event.timeStamp
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
      Snake.clearRectAndDraw(ctx, this.head.x, this.head.y)
      this.previousHead.x = this.head.x
      this.previousHead.y = this.head.y
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

    Snake.clearRectAndDraw(ctx, this.tail.x, this.tail.y)

    for (let i = this.body.length - 1; i > 0; i--) {
      const current = this.body[i]
      const following = this.body[i - 1]
      ctx.fillStyle = this.color

      //save tail position before update
      if (current == this.tail) {
        this.previousTail.x = current.x
        this.previousTail.y = current.y
      }

      //Update body position
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

  static draw(
    ctx: CanvasRenderingContext2D,
    color: string,
    head: Unit,
    tail: Unit,
    previousHead: Unit,
    previousTail: Unit
  ) {
    if (head.x == tail.x && head.y == tail.y) {
      //erase previous head position
      Snake.clearRectAndDraw(ctx, previousHead.x, previousHead.y)
      //draw head
      ctx.fillStyle = color
      ctx.fillRect(head.x, head.y, size, size)
      return
    }

    //erase previous tail position
    Snake.clearRectAndDraw(ctx, previousTail.x, previousTail.y)
    //draw head
    ctx.fillStyle = color
    ctx.fillRect(head.x, head.y, size, size)
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

  static clearRectAndDraw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.clearRect(x, y, size, size)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + size, y)
    ctx.lineTo(x + size, y + size)
    ctx.lineTo(x, y + size)
    ctx.closePath()
    ctx.stroke()
  }
}
