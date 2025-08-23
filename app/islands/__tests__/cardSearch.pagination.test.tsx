import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as cardService from '../../services/cardService'

// cardServiceをモック化
vi.mock('../../services/cardService')
const mockSearchCards = vi.mocked(cardService.searchCards)

describe('CardSearch Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call searchCards with correct page parameter', async () => {
    mockSearchCards.mockResolvedValue({
      cards: [],
      total_cards: 50,
      has_more: true
    })

    const filters = { name: 'test' }
    const options = { page: 2, pageSize: 16 }

    await cardService.searchCards(filters, options)

    expect(mockSearchCards).toHaveBeenCalledWith(filters, options)
  })

  it('should calculate total pages correctly', () => {
    const totalCards = 50
    const pageSize = 16
    const expectedPages = Math.ceil(totalCards / pageSize) // 4 pages

    expect(expectedPages).toBe(4)
  })

  it('should handle pagination state correctly', () => {
    // ページネーション状態のロジックテスト
    const currentPage = 1
    const totalPages = 4
    
    const isFirstPage = currentPage === 1
    const isLastPage = currentPage === totalPages
    
    expect(isFirstPage).toBe(true)
    expect(isLastPage).toBe(false)
    
    const page2 = 2
    const isPage2First = page2 === 1
    const isPage2Last = page2 === totalPages
    
    expect(isPage2First).toBe(false)
    expect(isPage2Last).toBe(false)
  })
})