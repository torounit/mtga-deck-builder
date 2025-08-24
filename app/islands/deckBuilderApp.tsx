import { useState, useEffect } from 'hono/jsx'
import { DeckManagerService } from '../services/deckManagerService'
import { DeckService } from '../services/deckService'
import type { Card } from '../types/card'
import type { Deck } from '../types/deck'
import CardSearch from './cardSearch'
import DeckBuilder from './deckBuilder'

interface DeckBuilderAppProps {
  deckId?: string | null
}

export default function DeckBuilderApp({ deckId }: DeckBuilderAppProps) {
  const [deck, setDeck] = useState<Deck>(() => DeckService.createEmptyDeck())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // 特定のデッキIDが指定されている場合はそれをロード
    if (deckId) {
      const targetDeck = DeckManagerService.getDeckById(deckId)
      if (targetDeck) {
        setDeck(targetDeck)
        return
      }
    }
    
    // それ以外は従来通りローカルストレージからロード
    const savedDeck = DeckService.loadDeck()
    if (savedDeck) {
      setDeck(savedDeck)
    }
  }, [deckId])

  useEffect(() => {
    if (isClient && deck.id) {
      // 特定のデッキIDが指定されている場合はDeckManagerServiceで保存
      if (deckId && deck.id === deckId) {
        DeckManagerService.updateDeck(deck)
      } else {
        // 従来のローカルストレージでの保存も維持
        DeckService.saveDeck(deck)
      }
    }
  }, [deck, isClient, deckId])

  const handleCardAdd = (card: Card, location: 'main' | 'sideboard' = 'main') => {
    const updatedDeck = DeckService.addCardToDeck(deck, card, location)
    setDeck(updatedDeck)
  }

  const handleCardRemove = (cardId: string, location: 'main' | 'sideboard') => {
    const updatedDeck = DeckService.removeCardFromDeck(deck, cardId, location)
    setDeck(updatedDeck)
  }

  const handleCardMove = (
    cardId: string, 
    fromLocation: 'main' | 'sideboard', 
    toLocation: 'main' | 'sideboard',
    quantity: number = 1
  ) => {
    const updatedDeck = DeckService.moveCardBetweenDecks(deck, cardId, fromLocation, toLocation, quantity)
    setDeck(updatedDeck)
  }

  const handleDeckNameChange = (name: string) => {
    setDeck(prev => ({ ...prev, name }))
  }

  return (
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2">
        <CardSearch onCardAdd={handleCardAdd} />
      </div>
      <div class="xl:col-span-1">
        <DeckBuilder 
          deck={deck}
          onCardAdd={handleCardAdd}
          onCardRemove={handleCardRemove}
          onCardMove={handleCardMove}
          onDeckNameChange={handleDeckNameChange}
        />
      </div>
    </div>
  )
}