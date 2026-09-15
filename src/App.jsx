import { useState, useEffect } from 'react'
import HiraganaTable from './components/HiraganaTable'
import QuizModal from './components/QuizModal'
import { generateQuiz } from './data/hiragana'
import './App.css'



function App() {
  const [count, setCount] = useState(Number(localStorage.getItem('count')))
  const [quizEntry, setQuizEntry] = useState(generateQuiz());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]); 

  {/* Start Quiz, Sleects the CHAR and the answer from hiaranagana.js (Moved there from here, incase of wanting to expand list.) */}

  

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
          onClick={() => setIsOpen(true)}
        >
           <div className="ticks"></div>
            {count}
        </button>


      </section>

      {/* Where the Quiz modal actually populates once turned on. */}
 <div className="ticks"></div>
      <QuizModal
        isOpen={isOpen}
        onCorrect={() => setCount((c) => c + 1)}
        onClose={() => setIsOpen(false)}
        quizEntry={quizEntry}
        setQuizEntry={setQuizEntry}
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
