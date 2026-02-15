import { useState } from 'hono/jsx'
import DeckHeader from '../components/DeckHeader'
import DeckSection from '../components/DeckSection'
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

  const handleAddCard = (cardId: string, location: 'main' | 'sideboard') => {
    const card = deck.mainDeck.find(dc => dc.card.id === cardId)?.card ??
                 deck.sideboard.find(dc => dc.card.id === cardId)?.card
    if (card) {
      onCardAdd?.(card, location)
    }
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
          onCardAdd?.(card, targetLocation)
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

  return (
    <div class="w-full h-full flex flex-col">
      <div class="flex-shrink-0">
        <DeckHeader
          deck={deck}
          onDeckNameChange={handleDeckNameChange}
          onExport={handleExport}
        />
      </div>

      <div class="flex-1 overflow-y-auto space-y-6 xl:pr-2">
        <DeckSection
          title="メインデッキ"
          cards={deck.mainDeck}
          location="main"
          dragOverLocation={dragOverLocation}
          onCardAdd={handleAddCard}
          onCardRemove={handleRemoveCard}
          onCardMove={onCardMove}
          onDragStart={handleCardDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleCardDrop}
        />
        <DeckSection
          title="サイドボード"
          cards={deck.sideboard}
          location="sideboard"
          dragOverLocation={dragOverLocation}
          onCardAdd={handleAddCard}
          onCardRemove={handleRemoveCard}
          onCardMove={onCardMove}
          onDragStart={handleCardDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleCardDrop}
        />
      </div>
    </div>
  )
}