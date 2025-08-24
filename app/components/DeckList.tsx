import type { Deck } from '../types/deck'

interface DeckListProps {
  decks: Deck[]
  onEditDeck: (deckId: string) => void
  onDeleteDeck: (deckId: string) => void
  onCreateDeck: () => void
}

export default function DeckList({
  decks,
  onEditDeck,
  onDeleteDeck,
  onCreateDeck
}: DeckListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getTotalCards = (deck: Deck) => {
    const mainCount = deck.mainDeck.reduce((sum, dc) => sum + dc.quantity, 0)
    const sideCount = deck.sideboard.reduce((sum, dc) => sum + dc.quantity, 0)
    return { main: mainCount, side: sideCount }
  }

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">デッキ一覧</h1>
        <button
          onClick={onCreateDeck}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          新しいデッキを作成
        </button>
      </div>

      {decks.length === 0 ? (
        <div class="text-center py-12">
          <p class="text-gray-500 text-lg mb-4">保存されたデッキがありません</p>
          <button
            onClick={onCreateDeck}
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            最初のデッキを作成
          </button>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => {
            const { main, side } = getTotalCards(deck)
            return (
              <div
                key={deck.id}
                class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-xl font-semibold text-gray-900 truncate">
                    {deck.name}
                  </h3>
                  <div class="flex gap-2 ml-2">
                    <button
                      onClick={() => onEditDeck(deck.id)}
                      class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => onDeleteDeck(deck.id)}
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