import { useState, useEffect } from 'react';
import { generateQuiz } from '../data/hiragana'
import Modal from 'react-modal';
import './../App.css'


export default function QuizModal({ isOpen, onCorrect, onClose, quizEntry, setQuizEntry }) {
  const [answer, setAnswer] = useState(''); 
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnswer(''); // Reset the answer field when the modal opens
      setFeedback(''); // Reset Feedback
    }
  }, [isOpen, quizEntry]);

  if (!isOpen) return null; // If entry is null, don't render the modal. (Prevents a crash)

  const handleSubmit = (e) => {
    let question = document.getElementById('question');

    e.preventDefault(); //prevents the form from submitting.
    
    console.log(answer, quizEntry.answer);

    if (answer.trim().toLowerCase() === quizEntry.answer) {
      onCorrect();
      // onClose();

      setQuizEntry(generateQuiz());
      question.innerText = quizEntry.char;
    } else {
      setFeedback('ermmm NO NO NO NO STAY IN CHARACYER'); // Make sure the PLayer knows they are failing.
    }

    setAnswer(''); // Clears the Input field upon attempt

  };

  return (
    <Modal
      isOpen={isOpen}
      className="bg-green-100 rounded-xl shadow-2xl w-1/2 p-6 mx-4 relative outline-none"
      overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <span className="text-2xl font-bold text-gray-900 mb-2">ANSWER or DIE</span>
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
