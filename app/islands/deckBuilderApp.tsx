import { useState, useEffect } from 'hono/jsx'
import { DeckService } from '../services/deckService'
import type { Card } from '../types/card'
import type { Deck } from '../types/deck'
import CardSearch from './cardSearch'
import DeckBuilder from './deckBuilder'

export default function DeckBuilderApp() {
  const [deck, setDeck] = useState<Deck>(() => DeckService.createEmptyDeck())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // クライアントサイドでのみローカルストレージからロード
    const savedDeck = DeckService.loadDeck()
    if (savedDeck) {
      setDeck(savedDeck)
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      DeckService.saveDeck(deck)
    }
  }, [deck, isClient])

  const handleCardAdd = (card: Card, location: 'main' | 'sideboard' = 'main') => {
    const updatedDeck = DeckService.addCardToDeck(deck, card, location)
    setDeck(updatedDeck)
  }

  const handleCardRemove = (cardId: string, location: 'main' | 'sideboard') => {
    const updatedDeck = DeckService.removeCardFromDeck(deck, cardId, location)
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
          onDeckNameChange={handleDeckNameChange}
        />
      </div>
    </div>
  )
}