import { useState, useEffect } from 'hono/jsx'
import DeckList from '../components/DeckList'
import { DeckManagerService } from '../services/deckManagerService'
import type { Deck } from '../types/deck'
import DeckBuilderApp from './deckBuilderApp'

export default function MainApp() {
  const [currentView, setCurrentView] = useState<'list' | 'builder'>('list')
  const [decks, setDecks] = useState<Deck[]>([])
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // クライアントサイドでのみローカルストレージからロード
    const savedDecks = DeckManagerService.getAllDecks()
    setDecks(savedDecks)
  }, [])

  const handleCreateDeck = () => {
    if (!isClient) return
    
    const newDeck = DeckManagerService.createDeck('新しいデッキ')
    setDecks(DeckManagerService.getAllDecks())
    setCurrentDeckId(newDeck.id)
    setCurrentView('builder')
  }

  const handleEditDeck = (deckId: string) => {
    setCurrentDeckId(deckId)
    setCurrentView('builder')
  }

  const handleDeleteDeck = (deckId: string) => {
    if (!isClient) return
    
    if (confirm('このデッキを削除しますか？')) {
      DeckManagerService.deleteDeck(deckId)
      setDecks(DeckManagerService.getAllDecks())
    }
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setCurrentDeckId(null)
    // デッキ一覧を更新
    setDecks(DeckManagerService.getAllDecks())
  }

  if (currentView === 'builder') {
    return (
      <div>
        <div class="mb-6">
          <button
            onClick={handleBackToList}
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← デッキ一覧に戻る
          </button>
        </div>
        <DeckBuilderApp deckId={currentDeckId} />
      </div>
    )
  }

  return (
    <DeckList
      decks={decks}
      onEditDeck={handleEditDeck}
      onDeleteDeck={handleDeleteDeck}
      onCreateDeck={handleCreateDeck}
    />
  )
}