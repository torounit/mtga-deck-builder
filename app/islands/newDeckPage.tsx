import { useState, useEffect } from 'hono/jsx'
import { DeckManagerService } from '../services/deckManagerService'
import { DeckService } from '../services/deckService'
import type { Card } from '../types/card'
import type { Deck } from '../types/deck'
import CardSearch from './cardSearch'
import DeckBuilder from './deckBuilder'

export default function NewDeckPage() {
  const [deck, setDeck] = useState<Deck>(() => DeckService.createEmptyDeck())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && deck.id) {
      // 新規デッキの場合は一度保存してからDeckManagerServiceで管理
      if (deck.mainDeck.length > 0 || deck.sideboard.length > 0) {
        // カードが追加されたら初回保存
        const existingDeck = DeckManagerService.getDeckById(deck.id)
        if (!existingDeck) {
          const savedDeck = DeckManagerService.createDeck(deck.name)
          setDeck(prev => ({ ...prev, id: savedDeck.id }))
        } else {
          DeckManagerService.updateDeck(deck)
        }
      }
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