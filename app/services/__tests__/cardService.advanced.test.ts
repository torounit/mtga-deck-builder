import { describe, test, expect, vi, beforeEach } from 'vitest'
import * as cardService from '../cardService'

// cardServiceをモック化
vi.mock('../cardService')
const mockSearchCards = vi.mocked(cardService.searchCards)

describe('CardService - 高度な検索フィルター', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('色で検索ができる', async () => {
    mockSearchCards.mockResolvedValue({
      cards: [],
      total_cards: 0,
      has_more: false
    })

    const filters = { colors: ['R', 'U'] }
    await cardService.searchCards(filters)

    expect(mockSearchCards).toHaveBeenCalledWith(filters)
  })

  test('タイプで検索ができる', async () => {
    mockSearchCards.mockResolvedValue({
      cards: [],
      total_cards: 0,
      has_more: false
    })

    const filters = { type: 'Creature' }
    await cardService.searchCards(filters)

    expect(mockSearchCards).toHaveBeenCalledWith(filters)
  })

  test('マナコストで検索ができる', async () => {
    mockSearchCards.mockResolvedValue({
      cards: [],
      total_cards: 0,
      has_more: false
    })

    const filters = { cmc: 3 }
    await cardService.searchCards(filters)

    expect(mockSearchCards).toHaveBeenCalledWith(filters)
  })

  test('フォーマットで検索ができる', async () => {
    mockSearchCards.mockResolvedValue({
      cards: [],
      total_cards: 0,
      has_more: false
    })

    const filters = { format: 'standard' }
    await cardService.searchCards(filters)

    expect(mockSearchCards).toHaveBeenCalledWith(filters)
  })

  test('複数の検索フィルターを組み合わせて検索ができる', async () => {
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
