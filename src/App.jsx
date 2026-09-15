import { useState, useEffect } from 'react'
import HiraganaTable from './components/HiraganaTable'
import './App.css'

function App() {
  const [count, setCount] = useState(Number(localStorage.getItem('count')))

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);

  return (
    <>
      <section id="center">
        <div className="hero">
        </div>
        <div>
          <h1>Mugen</h1>
          <p>
           
          </p>
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
