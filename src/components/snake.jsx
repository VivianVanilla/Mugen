
//   - Baby Snake:  vowel row + k row               
//   - Japan Snake: k, s, t, n rows                
//   - Hebi:        every hiragana row                

import { useEffect, useState } from 'react'
import { QUIZZES } from '../data/hiragana'
import { useCombo, ComboDisplay } from './ComboLogic'
import './snake.css'

// Game layout 

const GRID_COLS = 16
const GRID_ROWS = 12
const CELL_SIZE = 48 // per pixel 


const UP = { x: 0, y: -1 }
const DOWN = { x: 0, y: 1 }
const LEFT = { x: -1, y: 0 }
const RIGHT = { x: 1, y: 0 }

const KEY_TO_DIRECTION = {
  ArrowUp: UP,
  w: UP,
  W: UP,
  ArrowDown: DOWN,
  s: DOWN,
  S: DOWN,
  ArrowLeft: LEFT,
  a: LEFT,
  A: LEFT,
  ArrowRight: RIGHT,
  d: RIGHT,
  D: RIGHT,
}

// Where the snake starts every new game: length 3, facing right, roughly
// centered on the board.
const START_SNAKE = [
  { x: 3, y: 5 },
  { x: 2, y: 5 },
  { x: 1, y: 5 },
]

 // `tickMs` is how often the snake takes a step - lower = faster.
const DIFFICULTIES = {
  baby: {
    label: 'Baby Snake',
    description: 'Vowels + か row (easiest)',
    quizIds: ['vowel', 'k'],
    tickMs: 160,
  },
  japan: {
    label: 'Japan Snake',
    description: 'か さ た な rows (medium)',
    quizIds: ['k', 's', 't', 'n'],
    tickMs: 160,
  },
  hebi: {
    label: 'Hebi (蛇)',
    description: 'Every hiragana row (hardest)',
    quizIds: QUIZZES.map((quiz) => quiz.id), // "all of them"
    tickMs: 120,
  },
}

const DIFFICULTY_KEYS = ['baby', 'japan', 'hebi']

function getCharacterPool(quizIds) {
  const pool = []
  QUIZZES.filter((quiz) => quizIds.includes(quiz.id)).forEach((quiz) => {
    quiz.entries.forEach((entry) => pool.push(entry))
  })
  return pool
}

// Randomly picks `count` distinct items out of `items`, with no repeats.
// Used both for choosing the 2 wrong characters and for choosing which
function sampleDistinct(items, count) {
  const remaining = [...items]
  const picked = []
  while (picked.length < count && remaining.length > 0) {
    const randomIndex = Math.floor(Math.random() * remaining.length)
    picked.push(remaining[randomIndex])
    remaining.splice(randomIndex, 1)
  }
  return picked
}

// Returns every board cell NOT covered by `occupiedCells` 
function getEmptyCells(occupiedCells) {
  const occupiedKeys = new Set(occupiedCells.map((cell) => `${cell.x},${cell.y}`))
  const emptyCells = []
  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      if (!occupiedKeys.has(`${x},${y}`)) {
        emptyCells.push({ x, y })
      }
    }
  }
  return emptyCells
}

// Sets up one "round": picks the target sound, picks 2 wrong characters
function createRound(characterPool, snakeCells) {
  const target = characterPool[Math.floor(Math.random() * characterPool.length)]

  const wrongCandidates = characterPool.filter((entry) => entry.answer !== target.answer)
  const wrongs = sampleDistinct(wrongCandidates, 2)

  const emptyCells = getEmptyCells(snakeCells)
  const cells = sampleDistinct(emptyCells, 3)

  const entries = [
    { ...target, isCorrect: true },
    { ...wrongs[0], isCorrect: false },
    { ...wrongs[1], isCorrect: false },
  ]

  const options = entries.map((entry, i) => ({ ...entry, x: cells[i].x, y: cells[i].y }))

  return { targetSound: target.answer, options }
}

export default function Snake({ addPoints }) {
  // 'select' = choosing a difficulty, 'playing' = game running,
  // 'dead' = lost (ate the wrong character / hit a wall / hit self),
  // 'won' = filled almost the whole board (very rare, but handled cleanly).
  const [status, setStatus] = useState('select')
  const [difficulty, setDifficulty] = useState('baby')

  // The pool of {char, answer} entries this run is allowed to draw from.
  const [pool, setPool] = useState([])

  const [snake, setSnake] = useState(START_SNAKE) // array of {x, y}, index 0 is the head.
  const [direction, setDirection] = useState(RIGHT) // direction actually being applied.
  const [pendingDirection, setPendingDirection] = useState(RIGHT) // direction queued by the player, applied on the next tick.

  const [targetSound, setTargetSound] = useState('') // the romaji sound shown on the head right now.
  const [options, setOptions] = useState([]) // the 3 hiragana characters currently on the board.

  const [points, setPoints] = useState(0)
  const [deathReason, setDeathReason] = useState('') // shown on the game-over screen.

  // Combo Stuff

  const combo = useCombo(1)

   // Starts a game
  function startGame(difficultyKey) {
    const characterPool = getCharacterPool(DIFFICULTIES[difficultyKey].quizIds)
    const round = createRound(characterPool, START_SNAKE)

    setDifficulty(difficultyKey)
    setPool(characterPool)
    setSnake(START_SNAKE)
    setDirection(RIGHT)
    setPendingDirection(RIGHT)
    setPoints(0)
    setDeathReason('')
    setTargetSound(round.targetSound)
    setOptions(round.options)
    combo.reset() // a new game always starts with a clean streak
    setStatus('playing')
  }

  // Queues a turn. Ignored if the game isn't running, or if it would be an
  function turn(newDirection) {
    if (status !== 'playing') return
    const isReversal = newDirection.x === -direction.x && newDirection.y === -direction.y
    if (isReversal) return
    setPendingDirection(newDirection)
  }

  // Keyboard controls: arrow keys or WASD.
  useEffect(() => {
    
    function handleKeyDown(event) {
        
      const newDirection = KEY_TO_DIRECTION[event.key]
      if (newDirection) { 
        event.preventDefault()
        turn(newDirection)
    } 
    }
    window.addEventListener('keydown', handleKeyDown)
    
    return () => window.removeEventListener('keydown', handleKeyDown)
  
  }, [status, direction])

  useEffect(() => {
    if (status !== 'playing') return undefined

    const tickMs = DIFFICULTIES[difficulty].tickMs

    const intervalId = setInterval(() => {
      setDirection(pendingDirection) 

      const head = snake[0]
      const newHead = { x: head.x + pendingDirection.x, y: head.y + pendingDirection.y }

      // 1. Did we hit a wall?
      const hitWall = newHead.x < 0 || newHead.x >= GRID_COLS || newHead.y < 0 || newHead.y >= GRID_ROWS
      if (hitWall) {
        setStatus('dead')
        setDeathReason('LOL YOU DIED')
        addPoints(points);
        return
      }

      // 2. Did we run into our own body?
      const hitSelf = snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      if (hitSelf) {
        setStatus('dead')
        addPoints(points);
        setDeathReason('LOL YOU DIED BUT TO YOURSelf. Wait thats sad do you need to talk to someone?')
        return
      }

      // 3. Did we land on one of the 3 hiragana characters?
      const eaten = options.find((option) => option.x === newHead.x && option.y === newHead.y)

      if (eaten && eaten.isCorrect) {
    
        const grownSnake = [newHead, ...snake]
        setSnake(grownSnake)

        const bonus = combo.registerCorrect() // updates combo
        setPoints((previousPoints) => previousPoints + 1 + bonus)

        const emptyCells = getEmptyCells(grownSnake)
        if (emptyCells.length < 3) {
          // board is full. Rare, but treat it as a win rather than crash.
          setStatus('won')
          return
        }

        const round = createRound(pool, grownSnake)
        setTargetSound(round.targetSound)
        setOptions(round.options)
      } else if (eaten && !eaten.isCorrect) {
       
        combo.registerIncorrect()
        setStatus('dead')
        addPoints(points);
        setDeathReason(`${eaten.char} isn't "${targetSound}"! `)
      } else {
        // Normal step: add the new head, drop the old tail - length stays the same.
        const movedSnake = [newHead, ...snake.slice(0, -1)]
        setSnake(movedSnake)
      }
    }, tickMs)

    return () => clearInterval(intervalId)
    
  }, [status, difficulty, snake, pendingDirection, options, pool, targetSound])

 

  // Screen 1: pick a difficulty.
  if (status === 'select') {
    return (
      <div className="snake-game">
        <h2 className="text-2xl font-bold text-gray-900">🐍 Hiragana Snake</h2>
        <p className="max-w-md text-center text-sm text-gray-700">
          The snake's head shows a sound. Steer it into the hiragana character that makes that
          sound to grow. Eat the wrong one (or hit a wall or yourself) and it's game over.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {DIFFICULTY_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => startGame(key)}
              className="rounded-lg border-2 border-purple-300 bg-blue-950 px-6 py-4 text-left transition-colors hover:border-purple-500"
            >
              <div className="font-bold text-gray-100">{DIFFICULTIES[key].label}</div>
              <div className="text-xs text-gray-100">{DIFFICULTIES[key].description}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Screen 2: game over (lost).
  if (status === 'dead') {
    return (
      <div className="snake-game">
        <h2 className="text-2xl font-bold text-gray-900">Game Over</h2>
        <p className="text-gray-700">{deathReason}</p>
        <p className="text-gray-900">
          Final score: <strong>{points}</strong>
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => startGame(difficulty)}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Play Again
          </button>
          <button
            type="button"
            onClick={() => setStatus('select')}
            className="rounded bg-gray-600 px-4 py-2 font-bold hover:bg-gray-400"
          >
            Change Difficulty
          </button>
        </div>
      </div>
    )
  }

  // Unlikely anyone would actually beat the minigame but uits here regardless 
  if (status === 'won') {
    return (
      <div className="snake-game">
        <h2 className="text-2xl font-bold text-gray-900">🎉 You filled the board!</h2>
        <p className="text-gray-900">
          Final score: <strong>{points}</strong>
        </p>
        <button
          type="button"
          onClick={() => setStatus('select')}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Play Again
        </button>
      </div>
    )
  }

  // Screen 4: actively playing. Build the grid of cells to render #Holy
  const cells = []
  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      const isHead = snake[0].x === x && snake[0].y === y
      const isBody = !isHead && snake.some((segment) => segment.x === x && segment.y === y)
      const option = options.find((opt) => opt.x === x && opt.y === y)

      let className = 'snake-cell'
      let content = null

      if (isHead) {
        className += ' snake-cell--head'
        content = targetSound // the whole point of the game: the head shows the sound to hunt for
      } else if (isBody) {
        className += ' snake-cell--body'
      } else if (option) {
        className += ' snake-cell--option'
        content = option.char
      }

      cells.push(
        <div key={`${x}-${y}`} className={className}>
          {content}
        </div>,
      )
    }
  }

  return (
    <div className="snake-game">
      <div className="snake-hud">
        <span>
          Score: <strong>{points}</strong>
        </span>
        <ComboDisplay combo={combo.combo} bonus={combo.bonus} />
        <span  >
          Eat the sound: <strong>{targetSound}</strong>
        </span>
      </div>

     {/*Where the board esttings come in to play :devl emoji} /*/}

      <div
        className="snake-board"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
          width: GRID_COLS * CELL_SIZE,
          height: GRID_ROWS * CELL_SIZE,
        }}
      >
        {cells}
      </div>

      {/* On-screen controls for mobile (oh my god im so mobiel pilled) */}
      <div className="snake-controls">
        <button type="button" onClick={() => turn(UP)} aria-label="Up">
          ▲
        </button>
        <div className="snake-controls-row">
          <button type="button" onClick={() => turn(LEFT)} aria-label="Left">
            ◀
          </button>
          <button type="button" onClick={() => turn(DOWN)} aria-label="Down">
            ▼
          </button>
          <button type="button" onClick={() => turn(RIGHT)} aria-label="Right">
            ▶
          </button>
        </div>
      </div>
    </div>
  )
}
