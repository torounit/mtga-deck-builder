import type { DeckCard } from '../types/deck'

interface DeckCardProps {
  deckCard: DeckCard
  location: 'main' | 'sideboard'
  onCardAdd: (cardId: string, location: 'main' | 'sideboard') => void
  onCardRemove: (cardId: string, location: 'main' | 'sideboard') => void
  onCardMove?: (cardId: string, fromLocation: 'main' | 'sideboard', toLocation: 'main' | 'sideboard', quantity: number) => void
  onDragStart: (e: DragEvent, deckCard: DeckCard, location: 'main' | 'sideboard') => void
}

function getCardBorderColor(colors: string[]) {
  if (colors.length === 0) {
    return 'border-gray-300'
  }
  
  if (colors.length === 1) {
    const colorMap = {
      W: 'border-yellow-400',
      U: 'border-blue-400', 
      B: 'border-gray-600',
      R: 'border-red-400',
      G: 'border-green-400',
      C: 'border-gray-300'
    }
    return colorMap[colors[0] as keyof typeof colorMap] || 'border-gray-300'
  }
  
  // 多色カードは金色の枠
  return 'border-yellow-600'
}

export default function DeckCard({
  deckCard,
  location,
  onCardAdd,
  onCardRemove,
  onCardMove,
  onDragStart
}: DeckCardProps) {
  const borderColor = getCardBorderColor(deckCard.card.colors)

  return (
    <div 
      class={`flex items-center justify-between p-2 border-2 rounded hover:bg-gray-50 cursor-move ${borderColor}`}
      draggable="true"
      onDragStart={(e: DragEvent) => {
        onDragStart(e, deckCard, location)
      }}
    >
      <div class="flex items-center gap-2 flex-1 pointer-events-none">
        <span class="font-medium">{deckCard.quantity}x </span>
        <span class="flex-1">{deckCard.card.name}</span>
        <span class="text-gray-500 text-sm">{deckCard.card.mana_cost}</span>
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