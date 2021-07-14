import "./styles/styles.css"
import Snake from "./components/Snake"
import Unit from "./components/Unit"
import { io } from "socket.io-client"
import { v4 as uuidv4 } from "uuid"
// @ts-ignore
import song from "./static/sounds/walk-in-the-park.mp3"
// @ts-ignore
import biteSound from "./static/sounds/cartoon_bite.mp3"
// @ts-ignore
import gameOverSound from "./static/sounds/pacman-game-over.mp3"

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
})

//Initialize socket client
const socket = io("https://sheltered-anchorage-03624.herokuapp.com/")

/**
 * Sounds
 */
const gameSong = new Audio(song)
gameSong.play()
gameSong.volume = 0.5
gameSong.addEventListener("ended", () => {
  gameSong.currentTime = 0
  gameSong.play()
})
const snakeEating = new Audio(biteSound)
snakeEating.volume = 1
const gameOver = new Audio(gameOverSound)

const ids_snakes_map: Map<string, Snake> = new Map()
socket.on("snake", (snake: Snake, emitterId: string) => {
  if (
    (food.x == snake.head.x && food.y == snake.head.y) ||
    (food.x == snake.previousHead.x && food.y == snake.previousHead.y) ||
    (food.x == snake.tail.x && food.y == snake.tail.y) ||
    (food.x == snake.previousTail.x && food.y == snake.previousTail.y)
  ) {
    food.drawAtRandomPosition(ctx)
  }
  Snake.draw(
    ctx,
    "black",
    snake.head,
    snake.tail,
    snake.previousHead,
    snake.previousTail
  )
  ids_snakes_map.set(emitterId, snake)
})

drawGrid()
let snake: Snake
let food: Unit
let score: number
resetGame()
let game = setInterval(init, 50)
function init() {
  if (snake.body[0].x == food.x && snake.body[0].y == food.y) {
    snakeEating.play()
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
      gameOver.play()
      snake.body.forEach((unit) => {
        Snake.clearRectAndDraw(ctx, unit.x, unit.y)
      })
      snake = new Snake(0, 0, "rgb(98, 0, 238)")
      socket.emit("snake", { snake, to: room })
      // clearInterval(game)
      showBoxDialog(score)
    }

    //detect collision with enemy bodies
    if (ids_snakes_map.size > 0) {
      for (let enemy of ids_snakes_map.values()) {
        enemy.body.forEach((unit) => {
          if (unit.x == snake.head.x && unit.y == snake.head.y) {
            gameOver.play()
            //end game
            snake.body.forEach((unit) => {
              Snake.clearRectAndDraw(ctx, unit.x, unit.y)
            })
            snake = new Snake(0, 0, "rgb(98, 0, 238)")
            socket.emit("snake", { snake, to: room })
            // clearInterval(game)
            showBoxDialog(score)
          }
        })
      }
    }

    //detect collapse with borders
    if (unit.x >= canvas.width) {
      unit.x = 0
      break
    } else if (unit.x < 0) {
      unit.x = canvas.width
      break
    } else if (unit.y >= canvas.height) {
      unit.y = 0
      break
    } else if (unit.y < 0) {
      unit.y = canvas.height
      break
    }
  }
  snake.update(ctx)
  if (room != null) {
    socket.emit("snake", { snake, to: room })
  }
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

function resetGame() {
  ctx.clearRect(0, 0, 600, 600)
  drawGrid()
  //Position must be a power of 20
  snake = new Snake(0, 0, "rgb(98, 0, 238)")
  score = 0
  food = new Unit("#52fc03")
  food.drawAtRandomPosition(ctx)
  gameSong.play()
}

document.getElementById("join-room-form").addEventListener("submit", joinRoom)
function joinRoom(e: Event) {
  e.preventDefault()
  const form = e.currentTarget as HTMLFormElement
  const data = new FormData(form)
  const friendRoom = data.get("friend-room-id")
  socket.emit("join", friendRoom)
  room = friendRoom as string
}

let room: string | null = null
document
  .getElementById("create-room-form")
  .addEventListener("submit", createRoom)
function createRoom(e: Event) {
  e.preventDefault()
  room = uuidv4()
  socket.emit("create room", room)
  const section = document.querySelector(".options")
  if (document.getElementById("copy-button") == null) {
    const container = document.createElement("div")
    const input = document.createElement("input")
    input.id = "room-id"
    input.setAttribute("type", "text")
    input.value = room
    input.readOnly = true
    input.classList.add("input")
    const button = document.createElement("button")
    button.addEventListener("click", copyToClipboard)
    button.textContent = "Copy"
    button.classList.add("button")
    button.id = "copy-button"
    container.appendChild(input)
    container.appendChild(button)
    section.appendChild(container)
    document.getElementById("join-room-form").style.display = "none"
  } else {
    const inp = document.getElementById("room-id") as HTMLInputElement
    inp.value = room
  }
}

function copyToClipboard() {
  const input = document.getElementById("room-id") as HTMLInputElement
  input.select()
  input.setSelectionRange(0, 999999)
  document.execCommand("copy")
}

export { size }
