import type { Card } from '../types/card'
import type { Deck, DeckCard } from '../types/deck'
import {
  MAX_CARD_COPIES,
  MAX_MAIN_DECK_SIZE,
  MAX_SIDEBOARD_SIZE
} from '../types/deck'

interface StoredDeck {
  id: string
  name: string
  mainDeck: DeckCard[]
  sideboard: DeckCard[]
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'mtga-deck-builder-deck'

function isClientSide(): boolean {
  return typeof window !== 'undefined'
}

function createEmptyDeck(): Deck {
  return {
    id: crypto.randomUUID(),
    name: 'New Deck',
    mainDeck: [],
    sideboard: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

function saveDeck(deck: Deck): void {
  if (!isClientSide()) return

  const deckToStore: StoredDeck = {
    ...deck,
    updatedAt: new Date().toISOString(),
    createdAt: deck.createdAt.toISOString()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deckToStore))
}

function loadDeck(): Deck | null {
  if (!isClientSide()) return null

  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return null

  try {
    const data = JSON.parse(saved) as StoredDeck
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    }
  } catch {
    return null
  }
}

export const DeckService = {
  createEmptyDeck,
  saveDeck,
  loadDeck,

  addCardToDeck: addCardToDeck,
  removeCardFromDeck: removeCardFromDeck,
  moveCardBetweenDecks: moveCardBetweenDecks,
  getDeckStats: getDeckStats,
  exportDeckToMTGA: exportDeckToMTGA
}

function addCardToDeck(
  deck: Deck,
  card: Card,
  location: 'main' | 'sideboard' = 'main'
): Deck {
  const targetDeck = location === 'main' ? deck.mainDeck : deck.sideboard
  const existingCard = targetDeck.find((dc) => dc.card.id === card.id)

  // Basic Landかどうかを判定
  const isBasicLand = card.type_line.includes('Basic Land')

  if (existingCard) {
    // 既存のカードの枚数を増やす
    // Basic Landは制限なし、その他のカードは4枚まで
    if (isBasicLand || existingCard.quantity < MAX_CARD_COPIES) {
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
}

function removeCardFromDeck(
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
}

export interface DeckStats {
  mainDeckSize: number
  sideboardSize: number
  isValidMainDeck: boolean
  isValidSideboard: boolean
}

function getDeckStats(deck: Deck): DeckStats {
  const mainDeckSize = deck.mainDeck.reduce((sum, dc) => sum + dc.quantity, 0)
  const sideboardSize = deck.sideboard.reduce((sum, dc) => sum + dc.quantity, 0)

  return {
    mainDeckSize,
    sideboardSize,
    isValidMainDeck: mainDeckSize >= MAX_MAIN_DECK_SIZE,
    isValidSideboard: sideboardSize <= MAX_SIDEBOARD_SIZE
  }
}

function moveCardBetweenDecks(
  deck: Deck,
  cardId: string,
  fromLocation: 'main' | 'sideboard',
  toLocation: 'main' | 'sideboard',
  quantity: number = 1
): Deck {
  if (fromLocation === toLocation) {
    return { ...deck }
  }

  // 新しい配列を作成
  const newMainDeck = [...deck.mainDeck]
  const newSideboard = [...deck.sideboard]

  const fromDeck = fromLocation === 'main' ? newMainDeck : newSideboard
  const toDeck = toLocation === 'main' ? newMainDeck : newSideboard

  const fromCardIndex = fromDeck.findIndex((dc) => dc.card.id === cardId)
  if (fromCardIndex === -1) {
    return { ...deck }
  }

  const fromCard = fromDeck[fromCardIndex]
  const moveQuantity = Math.min(quantity, fromCard.quantity)

  // 移動元から枚数を減らす
  if (fromCard.quantity <= moveQuantity) {
    fromDeck.splice(fromCardIndex, 1)
  } else {
    fromCard.quantity -= moveQuantity
  }

  // 移動先に追加
  const toCardIndex = toDeck.findIndex((dc) => dc.card.id === cardId)
  if (toCardIndex >= 0) {
    toDeck[toCardIndex].quantity += moveQuantity
  } else {
    toDeck.push({
      card: fromCard.card,
      quantity: moveQuantity
    })
  }

  // 新しいdeckオブジェクトを返す
  return {
    ...deck,
    mainDeck: newMainDeck,
    sideboard: newSideboard
  }
}

function exportDeckToMTGA(deck: Deck): string {
  const lines: string[] = []

  lines.push('Deck')
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
