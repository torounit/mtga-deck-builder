import type { DeckCard } from '../types/deck'

interface DeckCardProps {
  deckCard: DeckCard
  location: 'main' | 'sideboard'
  onCardAdd: (cardId: string, location: 'main' | 'sideboard') => void
  onCardRemove: (cardId: string, location: 'main' | 'sideboard') => void
  onCardMove?: (cardId: string, fromLocation: 'main' | 'sideboard', toLocation: 'main' | 'sideboard', quantity: number) => void
  onDragStart: (e: DragEvent, deckCard: DeckCard, location: 'main' | 'sideboard') => void
}

export default function DeckCard({
  deckCard,
  location,
  onCardAdd,
  onCardRemove,
  onCardMove,
  onDragStart
}: DeckCardProps) {
  return (
    <div 
      class="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-move"
      draggable="true"
      onDragStart={(e: DragEvent) => {
        onDragStart(e, deckCard, location)
      }}
    >
      <div class="flex-1 pointer-events-none">
        <span class="font-medium">{deckCard.quantity}x </span>
        <span>{deckCard.card.name}</span>
        <span class="text-gray-500 text-sm ml-2">{deckCard.card.mana_cost}</span>
      </div>
      <div class="flex gap-1 pointer-events-auto">
        <button
          onClick={() => {
            onCardAdd(deckCard.card.id, location)
          }}
          class="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          title="1枚追加"
        >
          +
        </button>
        <button
          onClick={() => {
            onCardRemove(deckCard.card.id, location)
          }}
          class="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          title="1枚削除"
        >
          -
        </button>
        {onCardMove && (
          <button
            onClick={() => {
              const targetLocation = location === 'main' ? 'sideboard' : 'main'
              onCardMove(deckCard.card.id, location, targetLocation, 1)
            }}
            class="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            title={location === 'main' ? 'サイドボードに移動' : 'メインデッキに移動'}
          >
            {location === 'main' ? '→S' : '→M'}
          </button>
        )}
      </div>
    </div>
  )
}