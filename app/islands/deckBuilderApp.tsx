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
  }, [])

  useEffect(() => {
    if (!isClient) return
    
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
  }, [deckId, isClient])

  useEffect(() => {
    if (isClient && deck.id) {
      if (!deckId) {
        // 新規デッキの場合：カードが追加されたら初回保存
        if (deck.mainDeck.length > 0 || deck.sideboard.length > 0) {
          const existingDeck = DeckManagerService.getDeckById(deck.id)
          if (!existingDeck) {
            const savedDeck = DeckManagerService.createDeck(deck.name)
            setDeck(prev => ({ ...prev, id: savedDeck.id }))
          } else {
            DeckManagerService.updateDeck(deck)
          }
        }
      } else if (deck.id === deckId) {
        // 既存デッキ編集の場合：DeckManagerServiceで保存
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