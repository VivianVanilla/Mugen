import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { ComboDisplay } from './ComboLogic'
import './../App.css'

export default function QuizModal({ isOpen, quiz, quizEntry, onCorrect, onIncorrect, onClose, comboCount = 0, comboBonus = 0 }) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(''); 

  useEffect(() => {
    if (isOpen) {
      setAnswer(''); 
      setFeedback(''); 
    }
  }, [isOpen, quizEntry]);

  if (!isOpen || !quizEntry) return null; 

  const handleSubmit = (e) => {
    e.preventDefault(); //prevents the form from submitting.

    if (answer.trim().toLowerCase() === quizEntry.answer) {
      onCorrect(); // Right answer.
    } else {
      setFeedback('ermmm NO NO NO NO STAY IN CHARACYER'); // Make sure the PLayer knows they are failing.
      onIncorrect?.(); 
    }

    setAnswer('');

  };

  return (
    <Modal
      isOpen={isOpen}
      className="bg-green-100 rounded-xl shadow-2xl w-1/2 p-6 mx-4 relative outline-none"
      overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <span className="text-2xl font-bold text-gray-900 mb-2">{quiz?.name ?? 'Quiz'}</span>
      {/* Only shows up once the player has a streak going - see ComboDisplay in ComboLogic.jsx. */}
      <div className="mb-2"><ComboDisplay combo={comboCount} bonus={comboBonus} /></div>
      <p id="question" className="text-6xl text-center text-gray-900 my-4">{quizEntry.char}</p>
      <form onSubmit={handleSubmit}>

        {/**Input field**/}

        <input
          id="inputTarget"
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          autoFocus
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2 text-gray-900"
          placeholder="type the sound"
        />

        {/** Feedback message */}

        {feedback && <p className="text-red-800 size-10 mb-2">{feedback}</p>}
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Submit
          </button>
          <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </form>
    </Modal>
  );
}
