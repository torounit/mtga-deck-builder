import { useState } from 'hono/jsx'
import { DeckService } from '../services/deckService'
import type { Card } from '../types/card'
import type { Deck, DeckCard } from '../types/deck'

interface DragData {
  card: Card
  fromLocation: 'main' | 'sideboard'
  cardId: string
}

interface DeckBuilderProps {
  deck: Deck
  onCardAdd?: (card: Card, location?: 'main' | 'sideboard') => void
  onCardRemove?: (cardId: string, location: 'main' | 'sideboard') => void
  onCardMove?: (cardId: string, fromLocation: 'main' | 'sideboard', toLocation: 'main' | 'sideboard', quantity?: number) => void
  onDeckNameChange?: (name: string) => void
}

export default function DeckBuilder({ 
  deck, 
  onCardAdd, 
  onCardRemove, 
  onCardMove,
  onDeckNameChange 
}: DeckBuilderProps) {
  const [dragOverLocation, setDragOverLocation] = useState<'main' | 'sideboard' | null>(null)

  const handleAddCard = (card: Card, location: 'main' | 'sideboard' = 'main') => {
    onCardAdd?.(card, location)
  }

  const handleRemoveCard = (cardId: string, location: 'main' | 'sideboard') => {
    onCardRemove?.(cardId, location)
  }

  const handleDeckNameChange = (name: string) => {
    onDeckNameChange?.(name)
  }

  const handleDragOver = (e: DragEvent, location: 'main' | 'sideboard') => {
    e.preventDefault()
    
    // effectAllowedに基づいてdropEffectを設定
    if (e.dataTransfer) {
      const effectAllowed = e.dataTransfer.effectAllowed
      if (effectAllowed === 'move') {
        e.dataTransfer.dropEffect = 'move'
      } else if (effectAllowed === 'copy') {
        e.dataTransfer.dropEffect = 'copy'
      } else {
        e.dataTransfer.dropEffect = 'copy'
      }
    }
    
    setDragOverLocation(location)
  }

  const handleDragLeave = () => {
    setDragOverLocation(null)
  }


  const handleCardDragStart = (e: DragEvent, deckCard: DeckCard, location: 'main' | 'sideboard') => {
    if (e.dataTransfer) {
      const dragData = {
        card: deckCard.card,
        fromLocation: location,
        cardId: deckCard.card.id
      }
      e.dataTransfer.setData('application/json', JSON.stringify(dragData))
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  const handleCardDrop = (e: DragEvent, targetLocation: 'main' | 'sideboard') => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverLocation(null)
    
    if (!e.dataTransfer) return
    
    try {
      const data = e.dataTransfer.getData('application/json')
      if (data) {
        const dragData = JSON.parse(data) as Card | DragData
        
        // 検索結果からのドロップの場合（Cardオブジェクト）
        if ('name' in dragData && !('fromLocation' in dragData)) {
          const card = dragData
          handleAddCard(card, targetLocation)
        }
        // デッキ内でのカード移動の場合（DragDataオブジェクト）
        else if ('fromLocation' in dragData && 'cardId' in dragData) {
          const { cardId, fromLocation } = dragData
          if (fromLocation !== targetLocation) {
            onCardMove?.(cardId, fromLocation, targetLocation, 1)
          }
        }
      }
    } catch (error) {
      console.error('Failed to parse dropped card data:', error)
    }
  }

  const handleExport = () => {
    const exportText = DeckService.exportDeckToMTGA(deck)
    void navigator.clipboard.writeText(exportText)
    alert('デッキリストをクリップボードにコピーしました')
  }

  const stats = DeckService.getDeckStats(deck)

  const renderDeckSection = (
    title: string,
    cards: DeckCard[],
    location: 'main' | 'sideboard',
    maxSize: number
  ) => (
    <div 
      class={`bg-white rounded-lg shadow p-4 min-h-96 transition-colors border-2 ${
        dragOverLocation === location ? 'bg-blue-50 border-blue-300' : 'border-transparent'
      }`}
      onDragOver={(e: DragEvent) => {
        handleDragOver(e, location)
      }}
      onDragLeave={handleDragLeave}
      onDrop={(e: DragEvent) => {
        handleCardDrop(e, location)
      }}
    >
      <h3 class="text-lg font-semibold mb-3">
        {title} ({cards.reduce((sum, dc) => sum + dc.quantity, 0)}/{maxSize})
      </h3>
      <div class="space-y-2">
        {cards.map((deckCard) => (
          <div 
            key={deckCard.card.id} 
            class="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-move"
            draggable="true"
            onDragStart={(e: DragEvent) => {
              handleCardDragStart(e, deckCard, location)
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
                  handleAddCard(deckCard.card, location)
                }}
                class="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                title="1枚追加"
              >
                +
              </button>
              <button
                onClick={() => {
                  handleRemoveCard(deckCard.card.id, location)
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

  return (
    <div class="w-full">
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex items-center justify-between mb-4">
          <input
            type="text"
            value={deck.name}
            onInput={(e) => {
              handleDeckNameChange((e.target as HTMLInputElement).value)
            }}
            class="text-xl font-bold bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded"
          />
          <button
            onClick={handleExport}
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            MTGAにエクスポート
          </button>
        </div>
        
        <div class="flex gap-4 text-sm">
          <span class={stats.isValidMainDeck ? 'text-green-600' : 'text-red-600'}>
            メインデッキ: {stats.mainDeckSize}/60
          </span>
          <span class={stats.isValidSideboard ? 'text-green-600' : 'text-red-600'}>
            サイドボード: {stats.sideboardSize}/15
          </span>
        </div>
      </div>

      <div class="space-y-6">
        {renderDeckSection('メインデッキ', deck.mainDeck, 'main', 60)}
        {renderDeckSection('サイドボード', deck.sideboard, 'sideboard', 15)}
      </div>
    </div>
  )
}