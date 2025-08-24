import type { Card } from '../types/card'

interface CardItemProps {
  card: Card
  onCardAdd?: (card: Card, location?: 'main' | 'sideboard') => void
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

export default function CardItem({ card, onCardAdd }: CardItemProps) {
  const handleDragStart = (e: DragEvent, card: Card) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('application/json', JSON.stringify(card))
      e.dataTransfer.effectAllowed = 'copy'
    }
  }

  const borderColor = getCardBorderColor(card.colors)

  return (
    <div
      class={`border-2 rounded-lg p-3 hover:shadow-lg transition-shadow relative group cursor-move ${borderColor}`}
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
  )
}