import { useState, useEffect } from 'react'
import HiraganaTable from './components/HiraganaTable'
import QuizModal from './components/QuizModal'
import Snake from './components/snake'
import { useCombo } from './components/ComboLogic'
import { QUIZZES, generateEntry } from './data/hiragana'
import './App.css'

function App() {
  const [count, setCount] = useState(Number(localStorage.getItem('count'))) // Player's $ currency.

  // Which quiz ids the player has unlocked; loaded from localStorage, starting with just the free vowel quiz.
  const [unlockedIds, setUnlockedIds] = useState(() => {
    const saved = localStorage.getItem('unlockedIds') // Look for a previously-saved unlock list.
    return saved ? JSON.parse(saved) : [QUIZZES[0].ids] // Fall back to just the starter quiz.
  })

  const [activeQuizId, setActiveQuizId] = useState(null) 
  const [quizEntry, setQuizEntry] = useState(null) 
  const [isOpen, setIsOpen] = useState(false) // Whether the quiz modal is showing.

  // Tracks correct-answers-in-a-row for the typed quiz and turns that streak
  const quizCombo = useCombo(1) // +1 bonus $ per combo step.
  const [quizColor, setQuizColor] = useState('') // determines background of quiz modal
  const [quizColorReset, setQuizColorReset] = useState(null) // variable to hold timeout to reset color

  useEffect(() => {
    localStorage.setItem('count', count) // Save currency any time it changes.
  }, [count])

  useEffect(() => {
    localStorage.setItem('unlockedIds', JSON.stringify(unlockedIds)) // Save unlocks any time they change.
  }, [unlockedIds])

  {/* Start Quiz, Sleects the CHAR and the answer from hiaranagana.js (Moved there from here, incase of wanting to expand list.) */}

  // Opens a given quiz id in the modal and loads its first question.
  const openQuiz = (id) => {
    const quiz = QUIZZES.find((q) => q.id === id) 
    setActiveQuizId(id) 
    setQuizEntry(generateEntry(quiz)) 
    setIsOpen(true) 
    quizCombo.reset() 
  }

  // Spends $ to unlock a quiz, if the player can afford its cost.
  const unlockQuiz = (quiz) => {
    if (count < quiz.cost) return // Not enough $ yet - do nothing.
    setCount((c) => c - quiz.cost) // Pay the unlock cost.
    setUnlockedIds((ids) => [...ids, quiz.id]) // Add this quiz to the unlocked list.
  }

  const changeQuizModalBackground = (className) => {
    // am i insane
    setQuizColor(className); // set background of quizmodal to green

    if (quizColorReset) {
      clearTimeout(quizColorReset);
      // if there is already a timeout active, i guess if the user is getting
      // it correct at a faster rate than 10ms, this clears the old one so
      // multiple do not run at the same time
    }
    setQuizColorReset(setTimeout(() => {
      setQuizColor('');
      setQuizColorReset(null);
    }, 10)); // removes correct background color after 10ms, with 800ms fade
  }

  // Called by QuizModal when the player answers a question correctly.
  const handleCorrect = () => {
    const quiz = QUIZZES.find((q) => q.id === activeQuizId) // The quiz just answered.
    const comboBonus = quizCombo.registerCorrect() // Extend the streak; get this answer's flat bonus back right away.
    setCount((c) => c + quiz.reward + comboBonus) // Pay out the quiz's flat reward, plus the combo bonus on top.
    setQuizEntry(generateEntry(quiz)) // Load the next question for the quiz that's still open.
    changeQuizModalBackground('greenFlash'); // flashes green on quiz modal
  }

  // Called by QuizModal when the player answers a question incorrectly
  const handleIncorrect = () => {
    changeQuizModalBackground('redFlash'); // flashes red on quiz modal
    quizCombo.registerIncorrect()
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

        {/* Currency display */}
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
        onIncorrect={handleIncorrect}
        onClose={() => setIsOpen(false)}
        quiz={activeQuiz}
        quizEntry={quizEntry}
        comboCount={quizCombo.combo}
        comboBonus={quizCombo.bonus}
        quizColor={quizColor}
      />

      <div className="ticks"></div>
      <div className="ticks"></div>

      <div id="playArea" className="flex justify-between">
        <div id="upgrades">
          <h1>Upgrades</h1>
          {/* One row per quiz*/}
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

      {/* The Snake mini-game */}
      <section id="snake-section">
        <Snake
          addPoints={(x) => setCount((y) => y + x)}
        />
      </section>

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
