import type { Deck, DeckCard } from '../types/deck'

interface SerializedDeck {
  id: string
  name: string
  mainDeck: DeckCard[]
  sideboard: DeckCard[]
  createdAt: string
  updatedAt: string
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DeckManagerService {
  private static readonly STORAGE_KEY = 'mtga-decks'

  static getAllDecks(): Deck[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return []

      const decks = JSON.parse(stored) as SerializedDeck[]
      return decks.map((deck) => ({
        ...deck,
        createdAt: new Date(deck.createdAt),
        updatedAt: new Date(deck.updatedAt)
      }))
    } catch {
      return []
    }
  }

  static createDeck(name: string): Deck {
    const now = new Date()
    const newDeck: Deck = {
      id: crypto.randomUUID(),
      name,
      mainDeck: [],
      sideboard: [],
      createdAt: now,
      updatedAt: now
    }

    const decks = this.getAllDecks()
    decks.push(newDeck)
    this.saveDecks(decks)

    return newDeck
  }

  static updateDeck(updatedDeck: Deck): void {
    const decks = this.getAllDecks()
    const index = decks.findIndex((deck) => deck.id === updatedDeck.id)

    if (index !== -1) {
      decks[index] = {
        ...updatedDeck,
        updatedAt: new Date()
      }
      this.saveDecks(decks)
    }
  }

  static deleteDeck(deckId: string): void {
    const decks = this.getAllDecks()
    const filteredDecks = decks.filter((deck) => deck.id !== deckId)
    this.saveDecks(filteredDecks)
  }

  static getDeckById(deckId: string): Deck | undefined {
    const decks = this.getAllDecks()
    return decks.find((deck) => deck.id === deckId)
  }

  private static saveDecks(decks: Deck[]): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(decks))
    } catch (error) {
      console.error('Failed to save decks:', error)
    }
  }
}
