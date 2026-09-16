// One row = one quiz. `reward` is $ earned per correct answer.
// `chars`/`sounds` line up by index; `null` marks hiragana that don't exist (e.g. yi, wu).
const ROWS = [
  { id: 'vowel', name: 'Vowel Quiz', reward: 1, chars: ['あ', 'い', 'う', 'え', 'お'], sounds: ['a', 'i', 'u', 'e', 'o'] },
  { id: 'k', name: 'K Quiz', reward: 2, chars: ['か', 'き', 'く', 'け', 'こ'], sounds: ['ka', 'ki', 'ku', 'ke', 'ko'] },
  { id: 's', name: 'S Quiz', reward: 3, chars: ['さ', 'し', 'す', 'せ', 'そ'], sounds: ['sa', 'shi', 'su', 'se', 'so'] },
  { id: 't', name: 'T Quiz', reward: 4, chars: ['た', 'ち', 'つ', 'て', 'と'], sounds: ['ta', 'chi', 'tsu', 'te', 'to'] },
  { id: 'n', name: 'N Quiz', reward: 5, chars: ['な', 'に', 'ぬ', 'ね', 'の'], sounds: ['na', 'ni', 'nu', 'ne', 'no'] },
  { id: 'h', name: 'H Quiz', reward: 6, chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'], sounds: ['ha', 'hi', 'fu', 'he', 'ho'] },
  { id: 'm', name: 'M Quiz', reward: 7, chars: ['ま', 'み', 'む', 'め', 'も'], sounds: ['ma', 'mi', 'mu', 'me', 'mo'] },
  { id: 'y', name: 'Y Quiz', reward: 8, chars: ['や', null, 'ゆ', null, 'よ'], sounds: ['ya', null, 'yu', null, 'yo'] },
  { id: 'r', name: 'R Quiz', reward: 9, chars: ['ら', 'り', 'る', 'れ', 'ろ'], sounds: ['ra', 'ri', 'ru', 're', 'ro'] },
  { id: 'w', name: 'W Quiz', reward: 10, chars: ['わ', 'ゐ', null, 'ゑ', 'を'], sounds: ['wa', 'wi', null, 'we', 'wo'] },
]

// First unlock (K Quiz) costs this much; every quiz after that costs 6x the previous one.
const BASE_COST = 10

// Build the real quiz list from ROWS: adds `cost` and turns chars/sounds into {char, answer} pairs.
export const QUIZZES = ROWS.map((row, i) => ({
  ...row, // Copy id, name, reward, chars, sounds through unchanged.
  cost: i === 0 ? 0 : BASE_COST * 6 ** (i - 1), // Vowel quiz is free/starter; each next quiz is 6x the last (10, 60, 360, ...).
  entries: row.chars
    .map((char, j) => ({ char, answer: row.sounds[j] })) // Pair each character with its answer.
    .filter((entry) => entry.char !== null), // Drop the empty slots 
}))

// Returns a random {char, answer} question from the given quiz.
export const generateEntry = (quiz) => {
  const i = Math.floor(Math.random() * quiz.entries.length) // Random index into that quiz's questions.
  return quiz.entries[i]
}
