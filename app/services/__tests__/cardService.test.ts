import { describe, test, expect } from 'vitest'
import type { CardSearchFilters } from '../../types/card'
import { searchCards } from '../cardService'

describe('CardService', () => {
  test('カード名で検索ができる', async () => {
    const filters: CardSearchFilters = { name: 'Lightning' }
    const result = await searchCards(filters)

    expect(result.cards).toBeDefined()
    expect(result.cards.length).toBeGreaterThan(0)
    expect(result.cards[0].name).toContain('Lightning')
    expect(result.total_cards).toBeGreaterThan(0)
  })

  test('ページネーションでカード検索ができる', async () => {
    const filters: CardSearchFilters = { name: 'Island' }
    const result = await searchCards(filters, { page: 1, pageSize: 16 })

    expect(result.cards).toBeDefined()
    expect(result.cards.length).toBeLessThanOrEqual(16)
    expect(result.total_cards).toBeGreaterThan(0)
  })

  test('色でカードをフィルターできる', async () => {
    const filters: CardSearchFilters = { colors: ['R'] }
    const result = await searchCards(filters)

    expect(result.cards).toBeDefined()
    result.cards.forEach((card) => {
      expect(card.colors).toContain('R')
    })
  })

  test('マナコストでカードをフィルターできる', async () => {
    const filters: CardSearchFilters = { cmc: 3 }
    const result = await searchCards(filters)

    expect(result.cards).toBeDefined()
    result.cards.forEach((card) => {
      expect(card.cmc).toBe(3)
    })
  })
})
