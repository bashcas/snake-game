import "./styles/styles.css"
import Snake from "./components/Snake"
import Unit from "./components/Unit"

const canvas = <HTMLCanvasElement>document.querySelector("#canvas")
const size = 20
const units = canvas.width / size
const ctx = canvas.getContext("2d")

const boxDialogEl = document.querySelector(".box-dialog")
const scoreEl = document.querySelector(".score")

const showBoxDialog = (score: number) => {
  scoreEl.textContent = `${score}`
  boxDialogEl.classList.remove("hidden")
}

const restartBtn = document.querySelector(".btn")
restartBtn.addEventListener("click", () => {
  boxDialogEl.classList.add("hidden")
  resetGame()
  game = setInterval(init, 50)
})

drawGrid()
let snake: Snake
let food: Unit
let score: number
resetGame()
let game = setInterval(init, 50)

function resetGame() {
  ctx.clearRect(0, 0, 600, 600)
  drawGrid()
  //Position must be a power of 20
  snake = new Snake(0, 0, "#fcad03")
  score = 0
  food = new Unit("#52fc03")
  food.drawAtRandomPosition(ctx)
}

function init() {
  if (snake.body[0].x == food.x && snake.body[0].y == food.y) {
    snake.grow()
    score += 10
    food.drawAtRandomPosition(ctx)
  }
  for (let i = 0; i < snake.body.length; i++) {
    const unit = snake.body[i]
    //if food is generated inside snake body it needs to be generated again
    while (unit.x == food.x && unit.y == food.y) {
      food.drawAtRandomPosition(ctx)
    }
    //detect collision with own snake body
    if (
      snake.head.x == unit.x &&
      snake.head.y == unit.y &&
      snake.body.length > 3 &&
      snake.head != unit
    ) {
      //end game
      clearInterval(game)
      showBoxDialog(score)
    }
    if (unit.x >= canvas.width) {
      unit.x = -size
      break
    } else if (unit.x < 0) {
      unit.x = canvas.width
      break
    } else if (unit.y >= canvas.height) {
      unit.y = -size
      break
    } else if (unit.y < 0) {
      unit.y = canvas.height
      break
    }
  }
  snake.update(ctx)
}

function drawGrid() {
  for (let i = 0; i <= units; i++) {
    //draw horizontal lines
    ctx.strokeStyle = "#e6e6e6"
    ctx.moveTo(size * i, 0)
    ctx.lineTo(size * i, canvas.height)
    ctx.stroke()

    //draw vertical lines
    ctx.moveTo(0, size * i)
    ctx.lineTo(canvas.width, size * i)
    ctx.stroke()
  }
}

export { size }
