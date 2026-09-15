import { useState } from 'react';
import Modal from 'react-modal';
import './../App.css'

 export default function ExModal() {
    const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
 <div>
      <h2>React-Modal Example</h2>
      
      {/* Trigger Button */}
      <button onClick={openModal}>Open Modal</button>

      {/* Modal Component */}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal} 
        className="bg-white rounded-xl shadow-2xl w-1/2 p-6 mx-4 relative outline-none"
         overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      >
        <span className="text-2xl font-bold text-gray-900 mb-2">
          Hello Robert San
        </span>
        <p className="text-gray-800">This is a basic modal- They are very goated.</p>
        
        <button onClick={closeModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Close Modal
        </button>
      </Modal>
    </div>
  );
}

