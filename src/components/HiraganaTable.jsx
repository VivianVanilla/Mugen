
const VOWELS = ['a', 'i', 'u', 'e', 'o']

const ROWS = [
  { consonant: '∅', chars: ['あ', 'い', 'う', 'え', 'お'] },
  { consonant: 'k', chars: ['か', 'き', 'く', 'け', 'こ'] },
  { consonant: 's', chars: ['さ', 'し', 'す', 'せ', 'そ'] },
  { consonant: 't', chars: ['た', 'ち', 'つ', 'て', 'と'] },
  { consonant: 'n', chars: ['な', 'に', 'ぬ', 'ね', 'の'] },
  { consonant: 'h', chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
  { consonant: 'm', chars: ['ま', 'み', 'む', 'め', 'も'] },
  { consonant: 'y', chars: ['や', null, 'ゆ', null, 'よ'] },
  { consonant: 'r', chars: ['ら', 'り', 'る', 'れ', 'ろ'] },
  { consonant: 'w', chars: ['わ', 'ゐ', null, 'ゑ', 'を'] },
]

function HiraganaTable() {
  return (
    <div className="flex flex-col items-center hiragana-table">
      <table class="border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr>
            <th class="" scope="col" aria-hidden="true"></th>
            {VOWELS.map((vowel) => (
              <th class="border border-gray-300 px-4 py-2" key={vowel} scope="col">
                {vowel}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr class="border border-gray-300" key={row.consonant}>
              <th class="border border-gray-300 px-4 py-2" scope="row">
                {row.consonant}
              </th>
              {row.chars.map((char, i) => (
                <td key={VOWELS[i]}>{char ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hiragana-table-note border border-gray-300 px-27 py-2">ん (n)</p>
    </div>
  )
}

export default HiraganaTable
