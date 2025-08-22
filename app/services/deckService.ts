import type { Card } from '../types/card'
import type { Deck, DeckCard } from '../types/deck'
import {
  MAX_CARD_COPIES,
  MAX_MAIN_DECK_SIZE,
  MAX_SIDEBOARD_SIZE
} from '../types/deck'

const STORAGE_KEY = 'mtga-deck-builder-deck'

export const DeckService = {
  createEmptyDeck(): Deck {
    return {
      id: crypto.randomUUID(),
      name: 'New Deck',
      mainDeck: [],
      sideboard: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },

  saveDeck(deck: Deck): void {
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      deck.updatedAt = new Date()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deck))
    }
  },

  loadDeck(): Deck | null {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') {
      return null
    }

    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = JSON.parse(saved)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        ...data,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        createdAt: new Date(data.createdAt),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        updatedAt: new Date(data.updatedAt)
      }
    } catch {
      return null
    }
  },

  addCardToDeck(
    deck: Deck,
    card: Card,
    location: 'main' | 'sideboard' = 'main'
  ): Deck {
    const targetDeck = location === 'main' ? deck.mainDeck : deck.sideboard
    const existingCard = targetDeck.find((dc) => dc.card.id === card.id)

    if (existingCard) {
      // 既存のカードの枚数を増やす
      if (existingCard.quantity < MAX_CARD_COPIES) {
        existingCard.quantity++
      }
    } else {
      // 新しいカードを追加
      const newDeckCard: DeckCard = {
        card,
        quantity: 1
      }
      targetDeck.push(newDeckCard)
    }

    return { ...deck }
  },

  removeCardFromDeck(
    deck: Deck,
    cardId: string,
    location: 'main' | 'sideboard'
  ): Deck {
    const targetDeck = location === 'main' ? deck.mainDeck : deck.sideboard
    const cardIndex = targetDeck.findIndex((dc) => dc.card.id === cardId)

    if (cardIndex >= 0) {
      const deckCard = targetDeck[cardIndex]
      if (deckCard.quantity > 1) {
        deckCard.quantity--
      } else {
        targetDeck.splice(cardIndex, 1)
      }
    }

    return { ...deck }
  },

  getDeckStats(deck: Deck): {
    mainDeckSize: number
    sideboardSize: number
    isValidMainDeck: boolean
    isValidSideboard: boolean
  } {
    const mainDeckSize = deck.mainDeck.reduce((sum, dc) => sum + dc.quantity, 0)
    const sideboardSize = deck.sideboard.reduce(
      (sum, dc) => sum + dc.quantity,
      0
    )

    return {
      mainDeckSize,
      sideboardSize,
      isValidMainDeck: mainDeckSize >= MAX_MAIN_DECK_SIZE,
      isValidSideboard: sideboardSize <= MAX_SIDEBOARD_SIZE
    }
  },

  exportDeckToMTGA(deck: Deck): string {
    const lines: string[] = []

    lines.push(`Deck`)
    deck.mainDeck.forEach((dc) => {
      lines.push(`${String(dc.quantity)} ${dc.card.name}`)
    })

    if (deck.sideboard.length > 0) {
      lines.push('')
      lines.push('Sideboard')
      deck.sideboard.forEach((dc) => {
        lines.push(`${String(dc.quantity)} ${dc.card.name}`)
      })
    }

    return lines.join('\n')
  }
}
