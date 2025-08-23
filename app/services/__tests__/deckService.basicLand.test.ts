import { describe, test, expect } from 'vitest'
import type { Card } from '../../types/card'
import { DeckService } from '../deckService'

describe('DeckService - 基本土地ルール', () => {
  const createMockCard = (name: string, typeLine: string): Card => ({
    id: `mock-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    mana_cost: '',
    type_line: typeLine,
    oracle_text: '',
    colors: [],
    color_identity: [],
    cmc: 0,
    set: 'TST',
    rarity: 'common',
    image_uris: {
      small: '',
      normal: '',
      large: ''
    }
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
