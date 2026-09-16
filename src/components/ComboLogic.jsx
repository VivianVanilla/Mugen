//   1. Import the hook:            import { useCombo } from './ComboLogic'
//   2. Call it inside your component:   const combo = useCombo(1) // 1 point of bonus per combo step
//   3. On a correct answer, call:       const bonus = combo.registerCorrect()
//      - This both (a) extends the streak, and (b) hands you back the flat
//        bonus for THIS answer, ready to add to whatever reward you were
//        already going to give out.
//   4. On a wrong answer, call:         combo.registerIncorrect()
//      - This breaks the streak back down to 0.
//   5. Whenever you start a fresh session (new quiz, new game), call:
//                                       combo.reset()
//                                       <ComboDisplay combo={combo.combo} bonus={combo.bonus} />

import { useState } from 'react'


export function useCombo(bonusPerCombo = 1) {
  // How many correct answers the player currently has in a row.
  const [combo, setCombo] = useState(0)

  const registerCorrect = () => {
    const nextCombo = combo + 1
    setCombo(nextCombo)
    return nextCombo * bonusPerCombo
  }

  // Call this the moment the player gets something wrong. Breaks the streak.
  const registerIncorrect = () => {
    setCombo(0)
  }

 
  const reset = () => {
    setCombo(0)
  }

  return {
    combo, // Current streak length - use this to show "Combo x3" etc.
    bonus: combo * bonusPerCombo, // Current flat bonus
    registerCorrect, // Call on every correct answe
    registerIncorrect, // Call on every wrong answer
    reset, // Call when starting a new quiz/game session.
  }
}

// readout
export function ComboDisplay({ combo, bonus }) {
  if (combo <= 0) return null

  return (
    <span className="inline-flex items-center gap-1 font-bold text-purple-600">
      Combo x{combo}
      <span className="text-purple-400">(+{bonus})</span>
    </span>
  )
}
