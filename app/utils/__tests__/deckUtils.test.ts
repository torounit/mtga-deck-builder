import { describe, test, expect } from 'vitest'
import type { Deck } from '../../types/deck'
import { getTotalCards } from '../deckUtils'

const createMockDeck = (mainCards: number[], sideCards: number[]): Deck => ({
  id: 'test-deck',
  name: 'Test Deck',
  mainDeck: mainCards.map((quantity, index) => ({
    card: {
      id: `main-card-${String(index)}`,
      name: `Main Card ${String(index)}`,
      mana_cost: '',
      type_line: 'Creature',
      oracle_text: '',
      colors: [],
      color_identity: [],
      cmc: 1,
      set: 'TST',
      rarity: 'common',
      image_uris: { small: '', normal: '', large: '' }
    },
    quantity
  })),
  sideboard: sideCards.map((quantity, index) => ({
    card: {
      id: `side-card-${String(index)}`,
      name: `Side Card ${String(index)}`,
      mana_cost: '',
      type_line: 'Instant',
      oracle_text: '',
      colors: [],
      color_identity: [],
      cmc: 2,
      set: 'TST',
      rarity: 'common',
      image_uris: { small: '', normal: '', large: '' }
    },
    quantity
  })),
  createdAt: new Date(),
  updatedAt: new Date()
})

describe('deckUtils', () => {
  describe('getTotalCards', () => {
    test('メインデッキとサイドボードの枚数を正しく計算する', () => {
      const deck = createMockDeck([4, 3, 2], [2, 1])
      const result = getTotalCards(deck)

      expect(result.main).toBe(9) // 4 + 3 + 2
      expect(result.side).toBe(3) // 2 + 1
    })

    test('空のデッキでも正しく処理する', () => {
      const deck = createMockDeck([], [])
      const result = getTotalCards(deck)

      expect(result.main).toBe(0)
      expect(result.side).toBe(0)
    })

    test('メインデッキのみのデッキを処理する', () => {
      const deck = createMockDeck([4, 4, 4], [])
      const result = getTotalCards(deck)

      expect(result.main).toBe(12)
      expect(result.side).toBe(0)
    })

    test('サイドボードのみのデッキを処理する', () => {
      const deck = createMockDeck([], [3, 2, 1])
      const result = getTotalCards(deck)

      expect(result.main).toBe(0)
      expect(result.side).toBe(6)
    })
  })
})
