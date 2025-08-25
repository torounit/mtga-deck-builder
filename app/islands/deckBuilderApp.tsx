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

  // 保存が必要なデッキの変更を検出するための状態
  const [hasSaved, setHasSaved] = useState(false)
  
  // デッキ保存のロジック
  const saveDeck = (deckToSave: Deck) => {
    if (!isClient) return
    
    const shouldSave = deckToSave.name !== 'New Deck' || 
                      deckToSave.mainDeck.length > 0 || 
                      deckToSave.sideboard.length > 0
    
    if (!shouldSave) return
    
    if (!deckId) {
      // 新規デッキの場合
      const existingDeck = DeckManagerService.getDeckById(deckToSave.id)
      if (!existingDeck) {
        // 完全に新しいデッキを作成
        const savedDeck = DeckManagerService.createDeck(deckToSave.name)
        const completeNewDeck = {
          ...deckToSave,
          id: savedDeck.id,
          createdAt: savedDeck.createdAt,
          updatedAt: new Date()
        }
        
        // カードデータも含めて更新
        DeckManagerService.updateDeck(completeNewDeck)
        
        // 状態を同期
        if (deckToSave.id !== savedDeck.id) {
          setDeck(completeNewDeck)
        }
        
        setHasSaved(true)
      } else {
        // 既存デッキを更新
        DeckManagerService.updateDeck(deckToSave)
      }
    } else {
      // 既存デッキの編集
      DeckManagerService.updateDeck(deckToSave)
    }
  }
  
  // デッキ名の変更を監視
  useEffect(() => {
    if (deck.name !== 'New Deck' && !hasSaved && isClient) {
      saveDeck(deck)
    }
  }, [deck.name, hasSaved, isClient])
  
  // カードの変更を監視
  useEffect(() => {
    if ((deck.mainDeck.length > 0 || deck.sideboard.length > 0) && isClient) {
      saveDeck(deck)
    }
  }, [deck.mainDeck.length, deck.sideboard.length, isClient])

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
    <div class="h-screen grid grid-cols-1 xl:grid-cols-3 gap-6 p-4">
      <div class="xl:col-span-2 min-h-0">
        <CardSearch onCardAdd={handleCardAdd} />
      </div>
      <div class="xl:col-span-1 min-h-0">
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