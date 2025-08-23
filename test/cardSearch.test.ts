import { describe, it, expect } from 'vitest'
import { searchCards } from '../app/services/cardService'
import type { CardSearchFilters } from '../app/types/card'

describe('Card Search Service', () => {
  it('should search cards by name', async () => {
    const filters: CardSearchFilters = { name: 'Lightning' }
    const result = await searchCards(filters)

    expect(result.cards).toBeDefined()
    expect(result.cards.length).toBeGreaterThan(0)
    expect(result.cards[0].name).toContain('Lightning')
    expect(result.total_cards).toBeGreaterThan(0)
  })

  it('should search cards with pagination', async () => {
    const filters: CardSearchFilters = { name: 'Island' }
    const result = await searchCards(filters, { page: 1, pageSize: 16 })

    expect(result.cards).toBeDefined()
    expect(result.cards.length).toBeLessThanOrEqual(16)
    expect(result.total_cards).toBeGreaterThan(0)
  })

  it('should filter cards by color', async () => {
    const filters: CardSearchFilters = { colors: ['R'] }
    const result = await searchCards(filters)

    expect(result.cards).toBeDefined()
    result.cards.forEach((card) => {
      expect(card.colors).toContain('R')
    })
  })

  it('should filter cards by converted mana cost', async () => {
    const filters: CardSearchFilters = { cmc: 3 }
    const result = await searchCards(filters)

    expect(result.cards).toBeDefined()
    result.cards.forEach((card) => {
      expect(card.cmc).toBe(3)
    })
  })
})
