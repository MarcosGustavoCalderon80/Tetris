import './style.css'

// 1. inicializar el canvas

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

// cargamo el puntaje
const $score = document.querySelector('span')

const BLOCK_SIZE = 20
const BOARD_WINDTH = 14
const BOARD_HEIGHT = 30

let score = 0

canvas.width = BLOCK_SIZE * BOARD_WINDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT
context.scale(BLOCK_SIZE, BLOCK_SIZE)

// 3. board

const board = createBoard(BOARD_WINDTH, BOARD_HEIGHT)

function createBoard (width, height) {
  return Array(height).fill().map(() => Array(width).fill(0))
}
// 4. pieza player

const piece = {
  position: { x: 6, y: -1 },
  shape: [
    [1, 1],
    [1, 1]
  ]
}
// Random pieces
const PIECES = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [
    [1, 1, 1],
    [0, 1, 0]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1]
  ]
]
// 2.game loop. Baja de forma automatica
let dropCounter = 0
let lastTime = 0

function update (time = 0) {
  const deltaTime = time - lastTime
  lastTime = time
  dropCounter += deltaTime
  if (dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0

    if (checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }
  draw()
  window.requestAnimationFrame(update)
}

function draw () {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })
  // position de la piece
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = 'red'
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })
  $score.innerText = score
}
// movimiento de la piece
document.addEventListener('keydown', Event => {
  if (Event.key === 'ArrowLeft') {
    piece.position.x--
    if (checkCollision()) {
      piece.position.x++
    }
  }
  if (Event.key === 'ArrowRight') {
    piece.position.x++
    if (checkCollision()) {
      piece.position.x--
    }
  }
  if (Event.key === 'ArrowDown') {
    piece.position.y++
    if (checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }
  // Rotar la piece
  if (Event.key === 'ArrowUp') {
    const rotated = []

    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = []

      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i])
      }
      rotated.push(row)
    }
    const previousShape = piece.shape
    piece.shape = rotated
    if (checkCollision()) {
      piece.shape = previousShape
    }
  }
})
function checkCollision () {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}
// solidificamos la piece
function solidifyPiece () {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })
  // get random shape
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]
  // reseteamos la posicion de la piece
  piece.position.x = Math.floor(BOARD_WINDTH / 2 - 2)
  piece.position.y = 0
  // gameover
  if (checkCollision()) {
    window.alert('GAME OVER!!! SORRY!')
    board.forEach((row) => row.fill(0))
  }
}

function removeRows () {
  const rowsToRemove = []

  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WINDTH).fill(0)
    board.unshift(newRow)
    score += 100
  })
}
const $section = document.querySelector('section')
$section.addEventListener('click', () => {
  update()
  $section.remove()
  const audio = new window.Audio('./tetris.mp3')
  audio.volume = 0.2
  audio.play()
})
