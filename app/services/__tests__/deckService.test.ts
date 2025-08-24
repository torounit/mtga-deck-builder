import { describe, test, expect } from 'vitest'
import type { Card } from '../../types/card'
import { DeckService } from '../deckService'

const createMockCard = (
  name: string,
  typeLine: string,
  cmc: number = 0,
  colors: string[] = [],
  colorIdentity: string[] = []
): Card => ({
  id: `mock-${name.toLowerCase().replace(/\s+/g, '-')}`,
  name,
  mana_cost: cmc > 0 ? `{${String(cmc)}}` : '',
  type_line: typeLine,
  oracle_text: '',
  colors,
  color_identity: colorIdentity,
  cmc,
  set: 'TST',
  rarity: 'common',
  image_uris: {
    small: '',
    normal: '',
    large: ''
  }
})

describe('DeckService', () => {
  describe('createEmptyDeck', () => {
    test('空のデッキを作成できる', () => {
      const deck = DeckService.createEmptyDeck()

      expect(deck.id).toBeDefined()
      expect(deck.name).toBe('New Deck')
      expect(deck.mainDeck).toEqual([])
      expect(deck.sideboard).toEqual([])
      expect(deck.createdAt).toBeInstanceOf(Date)
      expect(deck.updatedAt).toBeInstanceOf(Date)
    })
  })

  describe('addCardToDeck', () => {
    test('カードをメインデッキに追加できる', () => {
      let deck = DeckService.createEmptyDeck()
      const card = createMockCard('Lightning Bolt', 'Instant')

      deck = DeckService.addCardToDeck(deck, card, 'main')

      expect(deck.mainDeck).toHaveLength(1)
      expect(deck.mainDeck[0]?.card.name).toBe('Lightning Bolt')
      expect(deck.mainDeck[0]?.quantity).toBe(1)
    })

    test('カードをサイドボードに追加できる', () => {
      let deck = DeckService.createEmptyDeck()
      const card = createMockCard('Counterspell', 'Instant')

      deck = DeckService.addCardToDeck(deck, card, 'sideboard')

      expect(deck.sideboard).toHaveLength(1)
      expect(deck.sideboard[0]?.card.name).toBe('Counterspell')
      expect(deck.sideboard[0]?.quantity).toBe(1)
    })

    test('同じカードを複数回追加すると枚数が増加する', () => {
      let deck = DeckService.createEmptyDeck()
      const card = createMockCard('Lightning Bolt', 'Instant')

      deck = DeckService.addCardToDeck(deck, card, 'main')
      deck = DeckService.addCardToDeck(deck, card, 'main')

      expect(deck.mainDeck).toHaveLength(1)
      expect(deck.mainDeck[0]?.quantity).toBe(2)
    })

    test('非基本カードは4枚までに制限される', () => {
      let deck = DeckService.createEmptyDeck()
      const nonBasicCard = createMockCard('Lightning Bolt', 'Instant')

      // 5枚の非基本カードを追加しようとする
      for (let i = 0; i < 5; i++) {
        deck = DeckService.addCardToDeck(deck, nonBasicCard, 'main')
      }

      const boltCard = deck.mainDeck.find(
        (dc) => dc.card.name === 'Lightning Bolt'
      )
      expect(boltCard?.quantity).toBe(4) // 4枚まで
    })

    test('基本土地は4枚を超えてデッキに入れることができる', () => {
      let deck = DeckService.createEmptyDeck()
      const basicLand = createMockCard('Plains', 'Basic Land — Plains')

      // 5枚の基本土地を追加
      for (let i = 0; i < 5; i++) {
        deck = DeckService.addCardToDeck(deck, basicLand, 'main')
      }

      const plainsCard = deck.mainDeck.find((dc) => dc.card.name === 'Plains')
      expect(plainsCard?.quantity).toBe(5)
    })

    test('異なる基本土地タイプを認識する', () => {
      const basicLands = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest']

      basicLands.forEach((landName) => {
        let deck = DeckService.createEmptyDeck()
        const basicLand = createMockCard(landName, `Basic Land — ${landName}`)

        // 5枚追加
        for (let i = 0; i < 5; i++) {
          deck = DeckService.addCardToDeck(deck, basicLand, 'main')
        }

        const landCard = deck.mainDeck.find((dc) => dc.card.name === landName)
        expect(landCard?.quantity).toBe(5)
      })
    })

    test('タイプにBasicが含まれるが基本土地ではないカードを正しく処理する', () => {
      let deck = DeckService.createEmptyDeck()
      const nonBasicCard = createMockCard('Basic Conjuration', 'Sorcery')

      // 5枚追加しようとする
      for (let i = 0; i < 5; i++) {
        deck = DeckService.addCardToDeck(deck, nonBasicCard, 'main')
      }

      const card = deck.mainDeck.find(
        (dc) => dc.card.name === 'Basic Conjuration'
      )
      expect(card?.quantity).toBe(4) // Basic Landではないので4枚まで
    })
  })

  describe('removeCardFromDeck', () => {
    test('カードをメインデッキから削除できる', () => {
      let deck = DeckService.createEmptyDeck()
      const card = createMockCard('Lightning Bolt', 'Instant')

      deck = DeckService.addCardToDeck(deck, card, 'main')
      deck = DeckService.addCardToDeck(deck, card, 'main')
      expect(deck.mainDeck[0]?.quantity).toBe(2)

      deck = DeckService.removeCardFromDeck(deck, card.id, 'main')
      expect(deck.mainDeck[0]?.quantity).toBe(1)
    })

    test('最後の1枚を削除するとカード自体がデッキから削除される', () => {
      let deck = DeckService.createEmptyDeck()
      const card = createMockCard('Lightning Bolt', 'Instant')

      deck = DeckService.addCardToDeck(deck, card, 'main')
      expect(deck.mainDeck).toHaveLength(1)

      deck = DeckService.removeCardFromDeck(deck, card.id, 'main')
      expect(deck.mainDeck).toHaveLength(0)
    })

    test('存在しないカードを削除しようとしても何も変わらない', () => {
      let deck = DeckService.createEmptyDeck()
      const card = createMockCard('Lightning Bolt', 'Instant')

      deck = DeckService.addCardToDeck(deck, card, 'main')
      const originalLength = deck.mainDeck.length

      deck = DeckService.removeCardFromDeck(deck, 'non-existent-id', 'main')
      expect(deck.mainDeck).toHaveLength(originalLength)
    })
  })

  describe('moveCardBetweenDecks', () => {
    test('カードをメインデッキからサイドボードに移動できる', () => {
      let deck = DeckService.createEmptyDeck()
      const card = createMockCard('Counterspell', 'Instant')

      deck = DeckService.addCardToDeck(deck, card, 'main')
      deck = DeckService.addCardToDeck(deck, card, 'main')
      expect(deck.mainDeck[0]?.quantity).toBe(2)

      deck = DeckService.moveCardBetweenDecks(
        deck,
        card.id,
        'main',
        'sideboard',
        1
      )

      expect(deck.mainDeck[0]?.quantity).toBe(1)
      expect(deck.sideboard[0]?.quantity).toBe(1)
      expect(deck.sideboard[0]?.card.name).toBe('Counterspell')
    })

    test('複数枚を一度に移動できる', () => {
      let deck = DeckService.createEmptyDeck()
      const card = createMockCard('Shock', 'Instant')

      // メインデッキに4枚追加
      for (let i = 0; i < 4; i++) {
        deck = DeckService.addCardToDeck(deck, card, 'main')
      }

      deck = DeckService.moveCardBetweenDecks(
        deck,
        card.id,
        'main',
        'sideboard',
        2
      )

      expect(deck.mainDeck[0]?.quantity).toBe(2)
      expect(deck.sideboard[0]?.quantity).toBe(2)
    })
  })

  describe('getDeckStats', () => {
    test('デッキの統計を正しく計算する', () => {
      let deck = DeckService.createEmptyDeck()
      const card1 = createMockCard('Lightning Bolt', 'Instant', 1)
      const card2 = createMockCard('Counterspell', 'Instant', 2)

      deck = DeckService.addCardToDeck(deck, card1, 'main')
      deck = DeckService.addCardToDeck(deck, card1, 'main')
      deck = DeckService.addCardToDeck(deck, card2, 'main')

      const stats = DeckService.getDeckStats(deck)

      expect(stats.mainDeckSize).toBe(3)
      expect(stats.sideboardSize).toBe(0)
      expect(stats.totalSize).toBe(3)
    })
  })

  describe('exportDeckToMTGA', () => {
    test('MTGAフォーマットでデッキをエクスポートできる', () => {
      let deck = DeckService.createEmptyDeck()
      const card1 = createMockCard('Lightning Bolt', 'Instant')
      const card2 = createMockCard('Counterspell', 'Instant')

      deck = DeckService.addCardToDeck(deck, card1, 'main')
      deck = DeckService.addCardToDeck(deck, card1, 'main')
      deck = DeckService.addCardToDeck(deck, card2, 'sideboard')

      const exported = DeckService.exportDeckToMTGA(deck)

      expect(exported).toContain('2 Lightning Bolt')
      expect(exported).toContain('1 Counterspell')
      expect(exported).toContain('Sideboard')
    })

    test('空のデッキもエクスポートできる', () => {
      const deck = DeckService.createEmptyDeck()
      const exported = DeckService.exportDeckToMTGA(deck)

      expect(exported).toBe('')
    })
  })

  describe('getDeckColors', () => {
    test('デッキの色を正しく取得できる', () => {
      let deck = DeckService.createEmptyDeck()
      const redCard = createMockCard(
        'Lightning Bolt',
        'Instant',
        1,
        ['R'],
        ['R']
      )
      const blueCard = createMockCard(
        'Counterspell',
        'Instant',
        2,
        ['U'],
        ['U']
      )
      const colorlessCard = createMockCard('Sol Ring', 'Artifact', 1, [], [])

      deck = DeckService.addCardToDeck(deck, redCard, 'main')
      deck = DeckService.addCardToDeck(deck, blueCard, 'main')
      deck = DeckService.addCardToDeck(deck, colorlessCard, 'main')

      const colors = DeckService.getDeckColors(deck)

      expect(colors).toContain('R')
      expect(colors).toContain('U')
      expect(colors).not.toContain('W')
      expect(colors).not.toContain('G')
      expect(colors).not.toContain('B')
      expect(colors).toHaveLength(2)
    })

    test('サイドボードの色も含める', () => {
      let deck = DeckService.createEmptyDeck()
      const redCard = createMockCard(
        'Lightning Bolt',
        'Instant',
        1,
        ['R'],
        ['R']
      )
      const greenCard = createMockCard(
        'Giant Growth',
        'Instant',
        1,
        ['G'],
        ['G']
      )

      deck = DeckService.addCardToDeck(deck, redCard, 'main')
      deck = DeckService.addCardToDeck(deck, greenCard, 'sideboard')

      const colors = DeckService.getDeckColors(deck)

      expect(colors).toContain('R')
      expect(colors).toContain('G')
      expect(colors).toHaveLength(2)
    })

    test('空のデッキは空の配列を返す', () => {
      const deck = DeckService.createEmptyDeck()
      const colors = DeckService.getDeckColors(deck)

      expect(colors).toEqual([])
    })

    test('多色カードの色を正しく取得する', () => {
      let deck = DeckService.createEmptyDeck()
      const multiColorCard = createMockCard(
        'Boros Charm',
        'Instant',
        2,
        ['R', 'W'],
        ['R', 'W']
      )

      deck = DeckService.addCardToDeck(deck, multiColorCard, 'main')

      const colors = DeckService.getDeckColors(deck)

      expect(colors).toContain('R')
      expect(colors).toContain('W')
      expect(colors).toHaveLength(2)
    })
  })
})
