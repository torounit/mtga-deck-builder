import { useState } from 'hono/jsx'
import { searchCards } from '../services/cardService'
import type { Card, CardSearchFilters } from '../types/card'

interface CardSearchProps {
  onCardAdd?: (card: Card, location?: 'main' | 'sideboard') => void
}

export default function CardSearch({ onCardAdd }: CardSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = (e: Event) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    const performSearch = async () => {
      try {
        const filters: CardSearchFilters = {
          name: searchQuery
        }
        
        const result = await searchCards(filters, { pageSize: 16 })
        setCards(result.cards)
      } catch (err) {
        setError('カード検索中にエラーが発生しました')
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }

    void performSearch()
  }

  return (
    <div class="w-full max-w-6xl mx-auto p-4">
      <form onSubmit={handleSearch} class="mb-6">
        <div class="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onInput={(e) => {
              setSearchQuery((e.target as HTMLInputElement).value)
            }}
            placeholder="カード名を入力..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '検索中...' : '検索'}
          </button>
        </div>
      </form>

      {error && (
        <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div class="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.id} class="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow relative group">
            {card.image_uris.normal && (
              <img
                src={card.image_uris.normal}
                alt={card.name}
                class="w-full h-auto rounded mb-2"
              />
            )}
            <h3 class="font-semibold text-sm mb-1">{card.name}</h3>
            <p class="text-xs text-gray-600 mb-1">{card.mana_cost}</p>
            <p class="text-xs text-gray-500 mb-2">{card.type_line}</p>
            
            {onCardAdd && (
              <div class="flex gap-1">
                <button
                  onClick={() => {
                    onCardAdd(card, 'main')
                  }}
                  class="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  メイン
                </button>
                <button
                  onClick={() => {
                    onCardAdd(card, 'sideboard')
                  }}
                  class="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                >
                  サイド
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {cards.length === 0 && !loading && searchQuery && (
        <div class="text-center text-gray-500 mt-8">
          検索結果が見つかりませんでした
        </div>
      )}
    </div>
  )
}