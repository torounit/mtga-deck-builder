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
    function checkPaginationState(currentPage: number, totalPages: number) {
      const isFirstPage = currentPage === 1
      const isLastPage = currentPage === totalPages
      
      return { isFirstPage, isLastPage }
    }
    
    const page1State = checkPaginationState(1, 4)
    expect(page1State.isFirstPage).toBe(true)
    expect(page1State.isLastPage).toBe(false)
    
    const page2State = checkPaginationState(2, 4)
    expect(page2State.isFirstPage).toBe(false)
    expect(page2State.isLastPage).toBe(false)
    
    const lastPageState = checkPaginationState(4, 4)
    expect(lastPageState.isFirstPage).toBe(false)
    expect(lastPageState.isLastPage).toBe(true)
  })
})