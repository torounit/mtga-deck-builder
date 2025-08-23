import type { Card } from '../types/card'
import CardItem from './CardItem'

interface CardGridProps {
  cards: Card[]
  onCardAdd?: (card: Card, location?: 'main' | 'sideboard') => void
  loading: boolean
  searchQuery: string
}

export default function CardGrid({
  cards,
  onCardAdd,
  loading,
  searchQuery
}: CardGridProps) {
  return (
    <>
      <div class="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onCardAdd={onCardAdd}
          />
        ))}
      </div>

      {cards.length === 0 && !loading && searchQuery && (
        <div class="text-center text-gray-500 mt-8">
          検索結果が見つかりませんでした
        </div>
      )}
    </>
  )
}