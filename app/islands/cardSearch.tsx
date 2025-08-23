import { useState, useEffect } from 'hono/jsx'
import CardGrid from '../components/CardGrid'
import Pagination from '../components/Pagination'
import SearchFilters from '../components/SearchFilters'
import SearchForm from '../components/SearchForm'
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
  const [selectedFormat, setSelectedFormat] = useState('standard')
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCards, setTotalCards] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const pageSize = 16

  const handleToggleColor = (colorCode: string) => {
    setSelectedColors(prev => {
      if (prev.includes(colorCode)) {
        return prev.filter(c => c !== colorCode)
      } else {
        return [...prev, colorCode]
      }
    })
  }

  // 初期ロード時のスタンダード一覧表示
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
      void performSearch(1)
    }
  }, [])

  // フィルターが変更されたら即座に検索実行
  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(1)
      void performSearch(1)
    }
  }, [selectedColors, selectedType, selectedCmc, selectedFormat])

  // 検索クエリが変更されたら500ms後に検索実行（デバウンス）
  useEffect(() => {
    if (!isInitialLoad) {
      const timeoutId = setTimeout(() => {
        setCurrentPage(1)
        void performSearch(1)
      }, 500)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [searchQuery])

  const performSearch = async (page: number = 1) => {
    // フォーマットが選択されている場合は検索を実行
    if (!searchQuery.trim() && selectedColors.length === 0 && !selectedType && selectedCmc === undefined && !selectedFormat) {
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
      if (selectedFormat) {
        filters.format = selectedFormat
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
    <div class="w-full max-w-6xl mx-auto p-4 space-y-6">
      <SearchForm
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSubmit={handleSearch}
        loading={loading}
      />

      <SearchFilters
        selectedColors={selectedColors}
        selectedType={selectedType}
        selectedCmc={selectedCmc}
        selectedFormat={selectedFormat}
        onToggleColor={handleToggleColor}
        onTypeChange={setSelectedType}
        onCmcChange={setSelectedCmc}
        onFormatChange={setSelectedFormat}
      />

      {error && (
        <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <CardGrid
        cards={cards}
        onCardAdd={onCardAdd}
        loading={loading}
        searchQuery={searchQuery}
      />

      <Pagination
        currentPage={currentPage}
        totalCards={totalCards}
        pageSize={pageSize}
        hasMore={hasMore}
        loading={loading}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </div>
  )
}
