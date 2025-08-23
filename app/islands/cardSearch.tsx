import { useState } from 'hono/jsx'
import { searchCards } from '../services/cardService'
import type { Card, CardSearchFilters } from '../types/card'

interface CardSearchProps {
  onCardAdd?: (card: Card, location?: 'main' | 'sideboard') => void
}

export default function CardSearch({ onCardAdd }: CardSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState('')
  const [selectedCmc, setSelectedCmc] = useState<number | undefined>(undefined)
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCards, setTotalCards] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  
  const pageSize = 16
  
  const colors = [
    { code: 'W', name: '白', color: 'bg-yellow-100 text-yellow-800' },
    { code: 'U', name: '青', color: 'bg-blue-100 text-blue-800' },
    { code: 'B', name: '黒', color: 'bg-gray-100 text-gray-800' },
    { code: 'R', name: '赤', color: 'bg-red-100 text-red-800' },
    { code: 'G', name: '緑', color: 'bg-green-100 text-green-800' }
  ]

  const handleDragStart = (e: DragEvent, card: Card) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('application/json', JSON.stringify(card))
      e.dataTransfer.effectAllowed = 'copy'
    }
  }

  const toggleColor = (colorCode: string) => {
    setSelectedColors(prev => {
      if (prev.includes(colorCode)) {
        return prev.filter(c => c !== colorCode)
      } else {
        return [...prev, colorCode]
      }
    })
  }

  const performSearch = async (page: number = 1) => {
    if (!searchQuery.trim() && selectedColors.length === 0 && !selectedType && selectedCmc === undefined) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const filters: CardSearchFilters = {}
      
      if (searchQuery.trim()) {
        filters.name = searchQuery
      }
      if (selectedColors.length > 0) {
        filters.colors = selectedColors
      }
      if (selectedType) {
        filters.type = selectedType
      }
      if (selectedCmc !== undefined) {
        filters.cmc = selectedCmc
      }
      
      const result = await searchCards(filters, { page, pageSize })
      setCards(result.cards)
      setTotalCards(result.total_cards)
      setHasMore(result.has_more)
      setCurrentPage(page)
      
    } catch (err) {
      setError('カード検索中にエラーが発生しました')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: Event) => {
    e.preventDefault()
    setCurrentPage(1)
    void performSearch(1)
  }

  const handleNextPage = () => {
    const nextPage = currentPage + 1
    void performSearch(nextPage)
  }

  const handlePreviousPage = () => {
    const prevPage = currentPage - 1
    if (prevPage >= 1) {
      void performSearch(prevPage)
    }
  }

  return (
    <div class="w-full max-w-6xl mx-auto p-4">
      <form onSubmit={handleSearch} class="mb-6 space-y-4">
        {/* カード名検索 */}
        <div class="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onInput={(e) => {
              setSearchQuery((e.target as HTMLInputElement).value)
            }}
            placeholder="カード名またはテキストを入力..."
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

        {/* 高度な検索フィルター */}
        <div class="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 class="font-medium text-gray-700">詳細フィルター</h3>
          
          {/* 色選択 */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">色</label>
            <div class="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.code}
                  type="button"
                  onClick={() => { toggleColor(color.code); }}
                  class={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedColors.includes(color.code)
                      ? `${color.color} ring-2 ring-blue-500`
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* タイプ選択 */}
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">タイプ</label>
              <select
                value={selectedType}
                onChange={(e) => { setSelectedType((e.target as HTMLSelectElement).value); }}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべてのタイプ</option>
                <option value="Creature">クリーチャー</option>
                <option value="Instant">インスタント</option>
                <option value="Sorcery">ソーサリー</option>
                <option value="Enchantment">エンチャント</option>
                <option value="Artifact">アーティファクト</option>
                <option value="Planeswalker">プレインズウォーカー</option>
                <option value="Land">土地</option>
              </select>
            </div>

            {/* マナコスト選択 */}
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">マナコスト</label>
              <select
                value={selectedCmc ?? ''}
                onChange={(e) => {
                  const value = (e.target as HTMLSelectElement).value
                  setSelectedCmc(value === '' ? undefined : parseInt(value))
                }}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべてのコスト</option>
                {Array.from({ length: 16 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>

      {error && (
        <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div class="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div 
            key={card.id} 
            class="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow relative group cursor-move"
            draggable="true"
            onDragStart={(e: DragEvent) => {
              handleDragStart(e, card)
            }}
          >
            {card.image_uris.normal && (
              <img
                src={card.image_uris.normal}
                alt={card.name}
                class="w-full h-auto rounded mb-2 pointer-events-none"
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

      {/* ページネーション */}
      {totalCards > 0 && (
        <div class="flex justify-center items-center mt-6 gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || loading}
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            前のページ
          </button>
          
          <span class="text-gray-700">
            {currentPage} / {Math.ceil(totalCards / pageSize)} ページ ({totalCards}件中 {Math.min((currentPage - 1) * pageSize + 1, totalCards)}-{Math.min(currentPage * pageSize, totalCards)}件目)
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={!hasMore || loading}
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            次のページ
          </button>
        </div>
      )}
    </div>
  )
}