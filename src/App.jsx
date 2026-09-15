import { useState, useEffect } from 'react'
import HiraganaTable from './components/HiraganaTable' 
import ExModal from './components/examplemodal'
import './App.css'


const CHARS = [
  'あ', 'い', 'う', 'え', 'お'
]


function App() {
  const [count, setCount] = useState(Number(localStorage.getItem('count')))

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);


  function randIndex(arr) {
    return Math.floor(Math.random()*arr.length);
  }




  return (
    <>
      <section id="center">
        <div className="hero">
        </div>
        <div>
          <h1>Mugen</h1>
          <ExModal />
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
           あ {count}
        </button>
      </section>

      <div className="ticks"></div>
      <div className="ticks"></div>





      <div id="playArea" className="flex justify-between">
        <div id="quiz" className="">
          <h1>Quiz</h1>

          <h2>{ CHARS[randIndex(CHARS)] }</h2>
          <input type="text" className="bg-amber-50" />
        </div>

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
