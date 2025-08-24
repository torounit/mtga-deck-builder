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

  return (
    <DeckList
      decks={decks}
      onDeleteDeck={handleDeleteDeck}
    />
  )
}