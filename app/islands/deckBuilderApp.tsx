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
      }
    }
    // 新規デッキの場合はcreateEmptyDeckで作成済みなので何もしない
  }, [deckId, isClient])

  useEffect(() => {
    if (isClient && deck.id) {
      if (!deckId) {
        // 新規デッキの場合：デッキ名が変更されたりカードが追加されたら保存
        const shouldSave = deck.name !== 'New Deck' || 
                          deck.mainDeck.length > 0 || 
                          deck.sideboard.length > 0
        
        if (shouldSave) {
          const existingDeck = DeckManagerService.getDeckById(deck.id)
          if (!existingDeck) {
            // 新規デッキを作成し、現在のデッキデータで更新
            const savedDeck = DeckManagerService.createDeck(deck.name)
            const deckWithNewId = { ...deck, id: savedDeck.id }
            DeckManagerService.updateDeck(deckWithNewId)
            setDeck(deckWithNewId)
          } else {
            DeckManagerService.updateDeck(deck)
          }
        }
      } else if (deck.id === deckId) {
        // 既存デッキ編集の場合：DeckManagerServiceで保存
        DeckManagerService.updateDeck(deck)
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