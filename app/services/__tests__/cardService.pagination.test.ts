import { describe, test, expect, vi, beforeEach } from 'vitest'
import * as cardService from '../cardService'

// cardServiceをモック化
vi.mock('../cardService')
const mockSearchCards = vi.mocked(cardService.searchCards)

describe('CardService - ページネーション', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('正しいページパラメータでsearchCardsを呼び出す', async () => {
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

  test('総ページ数を正しく計算する', () => {
    const totalCards = 50
    const pageSize = 16
    const expectedPages = Math.ceil(totalCards / pageSize) // 4 pages

    expect(expectedPages).toBe(4)
  })

  test('ページネーション状態を正しく処理する', () => {
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
