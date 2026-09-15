import { useState, useEffect } from 'react'
import HiraganaTable from './components/HiraganaTable'
import QuizModal from './components/QuizModal'
import { CHARS, VOWELS } from './data/hiragana'
import './App.css'

function App() {
  const [count, setCount] = useState(Number(localStorage.getItem('count')))
  const [quizEntry, setQuizEntry] = useState(null)

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]); 

  {/* Start Quiz, Sleects the CHAR and the answer from hiaranagana.js (Moved there from here, incase of wanting to expand list.) */}

  const startQuiz = () => {
    const i = Math.floor(Math.random() * CHARS.length)
    setQuizEntry({ char: CHARS[i], answer: VOWELS[i] })
  }

  return (
    <>
      <section id="center">
        <div className="hero">
        </div>
        <div>
          <h1>Mugen</h1>
        </div> 

        {/* Quiz + Counter Button */}

        <button
          type="button"
          className="counter"
          onClick={startQuiz}
        >
           <div className="ticks"></div>
            {count}
        </button>


      </section>

      {/* Where the Quiz modal actually populates once turned on. */}
 <div className="ticks"></div>
      <QuizModal
        isOpen={quizEntry !== null}
        entry={quizEntry}
        onClose={() => setQuizEntry(null)}
        onCorrect={() => setCount((c) => c + 1)}
      />

      <div className="ticks"></div>
      <div className="ticks"></div>

      <div id="playArea" className="flex justify-between">
        <div id="upgrades">
          <h1>Upgrades</h1>
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
