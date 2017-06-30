const canvas = document.querySelector('.gameCanvas')
const canvasContext = canvas.getContext('2d')

const FPS = 60
const PADDLE_HEIGHT = 100
const PADDDLE_WIDTH = 10
const WINNING_SCORE = 3
const CENTER_X = canvas.width / 2
const CENTER_Y = canvas.height / 2
const BALL_RADIUS = 10

let ballX = 50
let ballY = 50
let velocityX = 4
let velocityY = 2
let paddle1Y = 250
let paddle2Y = 250
let player1Score = 0
let player2Score = 0
let paused = false

setInterval(function() {
  move()
  draw()
}, 1000 / FPS)

canvas.addEventListener('mousemove', function(event) {
  const { y } = calculateMousePosition(event)

  paddle1Y = y - PADDLE_HEIGHT / 2
})

canvas.addEventListener('click', function() {
  if (!paused) {
    return
  }

  player1Score = 0
  player2Score = 0
  paused = false
})

function calculateMousePosition(event) {
  const rect = canvas.getBoundingClientRect()
  const root = document.documentElement
  const x = event.clientX - rect.left - root.scrollLeft
  const y = event.clientY - rect.top - root.scrollTop

  return { x, y }
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, 'black')

  if (paused) {
    canvasContext.fillStyle = 'white'
    canvasContext.fillText(
      player1Score > player2Score ? 'Left Player Won!' : 'Right Player Won!',
      CENTER_X,
      CENTER_Y
    )
    canvasContext.fillText('Click to Continue', CENTER_X, CENTER_Y + 50)

    return
  }

  // players paddle
  drawRect(0, paddle1Y, PADDDLE_WIDTH, 100, 'white')

  // computer paddle
  drawRect(canvas.width - PADDDLE_WIDTH, paddle2Y, PADDDLE_WIDTH, 100, 'white')

  drawNet()

  drawCircle(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2, true, 'white')

  // scores
  canvasContext.fillText(player1Score, 100, 100)
  canvasContext.fillText(player2Score, canvas.width - 100, 100)
}

function drawRect(left, top, width, height, color) {
  canvasContext.fillStyle = color
  canvasContext.fillRect(left, top, width, height)
}

function drawCircle(centerX, centerY, radius, color) {
  canvasContext.fillStyle = color
  canvasContext.beginPath()
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
  canvasContext.fill()
  canvasContext.closePath()
}

function drawNet() {
  for (let i = 2; i < canvas.height; i += 25) {
    drawRect(CENTER_X - 1, i, 2, 20, 'white')
  }
}

function resetBall() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    paused = true
  }

  velocityX = -velocityX
  velocityY = velocityY * 0.35
  ballX = CENTER_X
  ballY = CENTER_Y
}

function move() {
  if (paused) {
    return
  }

  ballX = ballX + velocityX
  ballY = ballY + velocityY

  moveComputer()

  // if ball hit the right paddle
  if (
    ballX + BALL_RADIUS >= canvas.width - PADDDLE_WIDTH &&
    ballY > paddle2Y &&
    ballY < paddle2Y + PADDLE_HEIGHT
  ) {
    let deltaY = ballY + 5 - (paddle2Y + PADDLE_HEIGHT / 2)

    velocityX = -velocityX
    velocityY = deltaY * 0.35
    // if ball hit the right edge
  } else if (ballX + BALL_RADIUS >= canvas.width) {
    player1Score = player1Score + 1
    resetBall()
  }

  // if ball hit the left paddle
  if (
    ballX - BALL_RADIUS <= PADDDLE_WIDTH &&
    ballY > paddle1Y &&
    ballY < paddle1Y + PADDLE_HEIGHT
  ) {
    let deltaY = ballY - BALL_RADIUS - (paddle1Y + PADDLE_HEIGHT / 2)

    velocityX = -velocityX
    velocityY = deltaY * 0.35
    // if ball hit the left edge
  } else if (ballX - BALL_RADIUS <= 0) {
    player2Score = player2Score + 1
    resetBall()
  }

  if (ballY + BALL_RADIUS >= canvas.height || ballY - BALL_RADIUS <= 0) {
    velocityY = -velocityY
  }
}

function moveComputer() {
  if (paddle2Y + PADDLE_HEIGHT / 2 < ballY - 35) {
    paddle2Y = paddle2Y + 6
  } else if (paddle2Y > ballY + 35) {
    paddle2Y = paddle2Y - 6
  }
}
