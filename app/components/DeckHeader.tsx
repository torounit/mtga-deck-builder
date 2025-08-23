import type { DeckStats } from '../services/deckService'
import type { Deck } from '../types/deck'

interface DeckHeaderProps {
  deck: Deck
  stats: DeckStats
  onDeckNameChange: (name: string) => void
  onExport: () => void
}

export default function DeckHeader({
  deck,
  stats,
  onDeckNameChange,
  onExport
}: DeckHeaderProps) {
  return (
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex items-center justify-between mb-4">
        <input
          type="text"
          value={deck.name}
          onInput={(e) => {
            onDeckNameChange((e.target as HTMLInputElement).value)
          }}
          class="text-xl font-bold bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded"
        />
        <button
          onClick={onExport}
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          MTGAにエクスポート
        </button>
      </div>
      
      <div class="flex gap-4 text-sm">
        <span class={stats.isValidMainDeck ? 'text-green-600' : 'text-red-600'}>
          メインデッキ: {stats.mainDeckSize}/60
        </span>
        <span class={stats.isValidSideboard ? 'text-green-600' : 'text-red-600'}>
          サイドボード: {stats.sideboardSize}/15
        </span>
      </div>
    </div>
  )
}