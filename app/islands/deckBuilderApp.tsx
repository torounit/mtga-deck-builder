import { useState } from 'hono/jsx'
import type { Card } from '../types/card'
import type { Deck } from '../types/deck'
import CardSearch from './cardSearch'
import DeckBuilder from './deckBuilder'
import { DeckService } from '../services/deckService'

export default function DeckBuilderApp() {
  const [deck, setDeck] = useState<Deck>(() => DeckService.createEmptyDeck())

  const handleCardAdd = (card: Card) => {
    const updatedDeck = DeckService.addCardToDeck(deck, card, 'main')
    setDeck(updatedDeck)
    DeckService.saveDeck(updatedDeck)
  }

  return (
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2">
        <CardSearch onCardAdd={handleCardAdd} />
      </div>
      <div class="xl:col-span-1">
        <DeckBuilder />
      </div>
    </div>
  )
}