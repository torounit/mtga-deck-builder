import { useState, useEffect } from 'hono/jsx'
import DeckList from '../components/DeckList'
import { DeckManagerService } from '../services/deckManagerService'
import type { Deck } from '../types/deck'

export default function DeckListPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedDecks = DeckManagerService.getAllDecks()
    setDecks(savedDecks)
  }, [])

  const handleDeleteDeck = (deckId: string) => {
    if (!isClient) return
    
    if (confirm('このデッキを削除しますか？')) {
      DeckManagerService.deleteDeck(deckId)
      setDecks(DeckManagerService.getAllDecks())
    }
  }

  const handleRefresh = () => {
    if (!isClient) return
    const savedDecks = DeckManagerService.getAllDecks()
    console.log('リフレッシュ: デッキ数', savedDecks.length)
    setDecks(savedDecks)
  }

  // デバッグ用: ブラウザコンソールからテスト可能
  useEffect(() => {
    if (isClient) {
      (window as any).testDeckCreation = () => {
        console.log('=== デッキ作成テスト開始 ===')
        const testName = 'ブラウザテスト' + Date.now()
        const newDeck = DeckManagerService.createDeck(testName)
        console.log('作成されたデッキ:', newDeck)
        
        const allDecks = DeckManagerService.getAllDecks()
        console.log('全デッキ数:', allDecks.length)
        
        setDecks(allDecks)
        return newDeck
      }
      
      (window as any).checkStorage = () => {
        const raw = localStorage.getItem('mtga-decks')
        console.log('ローカルストレージ:', raw)
        if (raw) {
          const parsed = JSON.parse(raw)
          console.log('パース結果:', parsed)
        }
      }
    }
  }, [isClient])


  return (
    <DeckList
      decks={decks}
      onDeleteDeck={handleDeleteDeck}
      onRefresh={handleRefresh}
    />
  )
}