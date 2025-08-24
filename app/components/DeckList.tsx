import { DeckService } from '../services/deckService'
import type { Deck } from '../types/deck'
import { getColorCircle } from '../utils/colorUtils'
import { formatDate } from '../utils/dateUtils'
import { getTotalCards } from '../utils/deckUtils'

interface DeckListProps {
  decks: Deck[]
  onDeleteDeck: (deckId: string) => void
}

export default function DeckList({
  decks,
  onDeleteDeck
}: DeckListProps) {

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">デッキ一覧</h1>
        <a
          href="/deck/new"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          新しいデッキを作成
        </a>
      </div>

      {decks.length === 0 ? (
        <div class="text-center py-12">
          <p class="text-gray-500 text-lg mb-4">保存されたデッキがありません</p>
          <a
            href="/deck/new"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            最初のデッキを作成
          </a>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => {
            const { main, side } = getTotalCards(deck)
            const colors = DeckService.getDeckColors(deck)
            return (
              <div
                key={deck.id}
                class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex justify-between items-start mb-4">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-xl font-semibold text-gray-900 truncate">
                      {deck.name}
                    </h3>
                    <div class="flex gap-1 mt-2">
                      {colors.length > 0 ? (
                        colors.map((color) => getColorCircle(color))
                      ) : (
                        <span class="text-xs text-gray-500">無色</span>
                      )}
                    </div>
                  </div>
                  <div class="flex gap-2 ml-2">
                    <a
                      href={`/deck/${deck.id}`}
                      class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      編集
                    </a>
                    <button
                      onClick={() => { onDeleteDeck(deck.id); }}
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      削除
                    </button>
                  </div>
                </div>

                <div class="space-y-2 mb-4">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">メインデッキ:</span>
                    <span class={`font-medium ${main < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                      {main}/60+
                    </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">サイドボード:</span>
                    <span class={`font-medium ${side > 15 ? 'text-red-600' : 'text-gray-900'}`}>
                      {side}/15
                    </span>
                  </div>
                </div>

                <div class="text-xs text-gray-500">
                  <div>作成: {formatDate(deck.createdAt)}</div>
                  <div>更新: {formatDate(deck.updatedAt)}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}