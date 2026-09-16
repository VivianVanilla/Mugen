import { useState, useEffect } from 'react'
import HiraganaTable from './components/HiraganaTable'
import QuizModal from './components/QuizModal'
import { QUIZZES, generateEntry } from './data/hiragana'
import './App.css'

function App() {
  const [count, setCount] = useState(Number(localStorage.getItem('count'))) // Player's $ currency.

  // Which quiz ids the player has unlocked; loaded from localStorage, starting with just the free vowel quiz.
  const [unlockedIds, setUnlockedIds] = useState(() => {
    const saved = localStorage.getItem('unlockedIds') // Look for a previously-saved unlock list.
    return saved ? JSON.parse(saved) : [QUIZZES[0].id] // Fall back to just the starter quiz.
  })

  const [activeQuizId, setActiveQuizId] = useState(null) // id of the quiz currently open in the modal.
  const [quizEntry, setQuizEntry] = useState(null) // Current question ({char, answer}) for that quiz.
  const [isOpen, setIsOpen] = useState(false) // Whether the quiz modal is showing.

  useEffect(() => {
    localStorage.setItem('count', count) // Save currency any time it changes.
  }, [count])

  useEffect(() => {
    localStorage.setItem('unlockedIds', JSON.stringify(unlockedIds)) // Save unlocks any time they change.
  }, [unlockedIds])

  {/* Start Quiz, Sleects the CHAR and the answer from hiaranagana.js (Moved there from here, incase of wanting to expand list.) */}

  // Opens a given quiz id in the modal and loads its first question.
  const openQuiz = (id) => {
    const quiz = QUIZZES.find((q) => q.id === id) // Look up the full quiz object by id.
    setActiveQuizId(id) // Remember which quiz is active.
    setQuizEntry(generateEntry(quiz)) // Pick its first question.
    setIsOpen(true) // Show the modal.
  }

  // Spends $ to unlock a quiz, if the player can afford its cost.
  const unlockQuiz = (quiz) => {
    if (count < quiz.cost) return // Not enough $ yet - do nothing.
    setCount((c) => c - quiz.cost) // Pay the unlock cost.
    setUnlockedIds((ids) => [...ids, quiz.id]) // Add this quiz to the unlocked list.
  }

  // Called by QuizModal when the player answers a question correctly.
  const handleCorrect = () => {
    const quiz = QUIZZES.find((q) => q.id === activeQuizId) // The quiz just answered.
    setCount((c) => c + quiz.reward) // Pay out that quiz's flat reward.
    setQuizEntry(generateEntry(quiz)) // Load the next question for the quiz that's still open.
  }

  const activeQuiz = QUIZZES.find((q) => q.id === activeQuizId) // Full object for the open quiz (or undefined).

  return (
    <>
      <section id="center">
        <div className="hero">
        </div>
        <div>
          <h1>Mugen</h1>
        </div>

        {/* Currency display - no longer a button, since opening a quiz now happens from the quiz list below. */}
        <div className="counter">
           <div className="ticks"></div>
            ${count}
        </div>

      </section>

      {/* Where the Quiz modal actually populates once turned on. */}
 <div className="ticks"></div>
      <QuizModal
        isOpen={isOpen}
        onCorrect={handleCorrect}
        onClose={() => setIsOpen(false)}
        quiz={activeQuiz}
        quizEntry={quizEntry}
      />

      <div className="ticks"></div>
      <div className="ticks"></div>

      <div id="playArea" className="flex justify-between">
        <div id="upgrades">
          <h1>Upgrades</h1>
          {/* One row per quiz: unlocked ones can be played, locked ones show their cost. */}
          {QUIZZES.map((quiz) => {
            const unlocked = unlockedIds.includes(quiz.id) // Has the player already bought this quiz?
            return (
              <div key={quiz.id} className="quiz-row">
                <span>{quiz.name} (${quiz.reward}/correct)</span>
                {unlocked ? (
                  <button type="button" onClick={() => openQuiz(quiz.id)}>
                    Play
                  </button>
                ) : (
                  <button type="button" disabled={count < quiz.cost} onClick={() => unlockQuiz(quiz)}>
                    Unlock (${quiz.cost})
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="ticks"></div>
      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <HiraganaTable />
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
