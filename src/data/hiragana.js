export const VOWELS = ['a', 'i', 'u', 'e', 'o']

export const CHARS = ['あ', 'い', 'う', 'え', 'お']

export const generateQuiz = () => {
  const i = Math.floor(Math.random() * CHARS.length)
  return { char: CHARS[i], answer: VOWELS[i] }
}