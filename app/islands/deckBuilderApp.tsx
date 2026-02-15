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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div class="flex flex-col xl:flex-row gap-4 relative" style="height: calc(100vh - 4rem);">
      {/* トグルボタン - 小画面のみ表示 */}
      <button
        onClick={toggleSidebar}
        class="xl:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="デッキリストを表示"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* メインカラム - カード検索 */}
      <div class="flex-1 min-h-0 min-w-0">
        <CardSearch onCardAdd={handleCardAdd} />
      </div>

      {/* オーバーレイ - 小画面でサイドバーが開いている時のみ表示 */}
      {isSidebarOpen && (
        <div 
          class="xl:hidden fixed inset-0 bg-black/30 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* サイドバー - デッキビルダー */}
      <div 
        class={`
          xl:relative xl:w-auto xl:max-w-[400px] xl:min-h-0
          fixed top-0 right-0 h-full w-[90%] max-w-[400px] z-40
          xl:bg-transparent xl:shadow-none
          bg-white shadow-lg
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          xl:translate-x-0
          p-4 xl:p-0
        `}
        style="height: calc(100vh - 4rem);"
      >
        <div class="h-full flex flex-col">
          {/* 閉じるボタン - 小画面のみ表示 */}
          <button
            onClick={closeSidebar}
            class="xl:hidden absolute top-2 right-2 z-50 p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label="閉じる"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="h-full overflow-hidden">
            <DeckBuilder 
              deck={deck}
              onCardAdd={handleCardAdd}
              onCardRemove={handleCardRemove}
              onCardMove={handleCardMove}
              onDeckNameChange={handleDeckNameChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}