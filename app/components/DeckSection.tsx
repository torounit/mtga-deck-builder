import type { DeckCard as DeckCardType } from '../types/deck'
import { getCardListTotal } from '../utils/deckUtils'
import DeckCard from './DeckCard'

interface DeckSectionProps {
  title: string
  cards: DeckCardType[]
  location: 'main' | 'sideboard'
  dragOverLocation: 'main' | 'sideboard' | null
  onCardAdd: (cardId: string, location: 'main' | 'sideboard') => void
  onCardRemove: (cardId: string, location: 'main' | 'sideboard') => void
  onCardMove?: (cardId: string, fromLocation: 'main' | 'sideboard', toLocation: 'main' | 'sideboard', quantity: number) => void
  onDragStart: (e: DragEvent, deckCard: DeckCardType, location: 'main' | 'sideboard') => void
  onDragOver: (e: DragEvent, location: 'main' | 'sideboard') => void
  onDragLeave: () => void
  onDrop: (e: DragEvent, targetLocation: 'main' | 'sideboard') => void
}

export default function DeckSection({
  title,
  cards,
  location,
  dragOverLocation,
  onCardAdd,
  onCardRemove,
  onCardMove,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop
}: DeckSectionProps) {
  return (
    <div 
      class={`bg-white rounded-lg shadow p-4 min-h-96 transition-colors border-2 ${
        dragOverLocation === location ? 'bg-blue-50 border-blue-300' : 'border-transparent'
      }`}
      onDragOver={(e: DragEvent) => {
        onDragOver(e, location)
      }}
      onDragLeave={onDragLeave}
      onDrop={(e: DragEvent) => {
        onDrop(e, location)
      }}
    >
      <h3 class="text-lg font-semibold mb-3">
        {title} (<span class={
          location === 'main' 
            ? (getCardListTotal(cards) < 60 ? 'text-red-600' : 'text-gray-700')
            : (getCardListTotal(cards) > 15 ? 'text-red-600' : 'text-gray-700')
        }>{getCardListTotal(cards)}</span>/{location === 'main' ? '60+' : '15'})
      </h3>
      <div class="space-y-2">
        {cards.map((deckCard) => (
          <DeckCard
            key={deckCard.card.id}
            deckCard={deckCard}
            location={location}
            onCardAdd={onCardAdd}
            onCardRemove={onCardRemove}
            onCardMove={onCardMove}
            onDragStart={onDragStart}
          />
        ))}
        {cards.length === 0 && (
          <div class="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p>カードをここにドロップ</p>
            <p class="text-xs mt-1">または下のボタンで追加</p>
          </div>
        )}
      </div>
    </div>
  )
}