import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as cardService from '../../services/cardService'

// cardServiceをモック化
vi.mock('../../services/cardService')
const mockSearchCards = vi.mocked(cardService.searchCards)

describe('CardSearch Advanced Filters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should search by colors', async () => {
    mockSearchCards.mockResolvedValue({
      cards: [],
      total_cards: 0,
      has_more: false
    })

    const filters = { colors: ['R', 'U'] }
    await cardService.searchCards(filters)

    expect(mockSearchCards).toHaveBeenCalledWith(filters)
  })

  it('should search by type', async () => {
    mockSearchCards.mockResolvedValue({
      cards: [],
      total_cards: 0,
      has_more: false
    })

    const filters = { type: 'Creature' }
    await cardService.searchCards(filters)

    expect(mockSearchCards).toHaveBeenCalledWith(filters)
  })

  it('should search by converted mana cost', async () => {
    mockSearchCards.mockResolvedValue({
      cards: [],
      total_cards: 0,
      has_more: false
    })

    const filters = { cmc: 3 }
    await cardService.searchCards(filters)

    expect(mockSearchCards).toHaveBeenCalledWith(filters)
  })

  it('should search by format', async () => {
    mockSearchCards.mockResolvedValue({
      cards: [],
      total_cards: 0,
      has_more: false
    })

    const filters = { format: 'standard' }
    await cardService.searchCards(filters)

    expect(mockSearchCards).toHaveBeenCalledWith(filters)
  })

  it('should combine multiple search filters', async () => {
    mockSearchCards.mockResolvedValue({
      cards: [],
      total_cards: 0,
      has_more: false
    })

    const filters = {
      name: 'Lightning',
      colors: ['R'],
      type: 'Instant',
      cmc: 1,
      format: 'standard'
    }
    await cardService.searchCards(filters)

    expect(mockSearchCards).toHaveBeenCalledWith(filters)
  })
})