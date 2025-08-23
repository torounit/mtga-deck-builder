import { describe, test, expect, vi, beforeEach } from 'vitest'
import type { CardSearchFilters } from '../../types/card'

// 実際のcardServiceをインポート
import { searchCards } from '../cardService'

// fetchをモック化
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('CardService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('カード名で検索ができる', async () => {
    const mockCard = {
      id: 'test-id',
      name: 'Lightning Strike',
      mana_cost: '{1}{R}',
      type_line: 'Instant',
      oracle_text: 'Lightning Strike deals 3 damage to any target.',
      colors: ['R'],
      color_identity: ['R'],
      cmc: 2,
      set: 'M21',
      rarity: 'common',
      image_uris: {
        small: 'test-small.jpg',
        normal: 'test-normal.jpg',
        large: 'test-large.jpg'
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [mockCard],
          total_cards: 1,
          has_more: false
        })
    })

    const filters: CardSearchFilters = { name: 'Lightning' }
    const result = await searchCards(filters)

    expect(result.cards).toBeDefined()
    expect(result.cards.length).toBe(1)
    expect(result.cards[0].name).toBe('Lightning Strike')
    expect(result.total_cards).toBe(1)
  })

  test('検索結果が空の場合を処理できる', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    const filters: CardSearchFilters = { name: 'NonExistentCard' }
    const result = await searchCards(filters)

    expect(result.cards).toEqual([])
    expect(result.total_cards).toBe(0)
    expect(result.has_more).toBe(false)
  })

  test('両面カードの画像を正しく処理できる', async () => {
    const mockDualFacedCard = {
      id: 'dual-card-id',
      name: 'Delver of Secrets',
      mana_cost: '{U}',
      type_line: 'Creature — Human Wizard',
      oracle_text: '',
      colors: ['U'],
      color_identity: ['U'],
      cmc: 1,
      set: 'ISD',
      rarity: 'common',
      image_uris: null,
      card_faces: [
        {
          name: 'Delver of Secrets',
          mana_cost: '{U}',
          type_line: 'Creature — Human Wizard',
          oracle_text: '',
          image_uris: {
            small: 'delver-small.jpg',
            normal: 'delver-normal.jpg',
            large: 'delver-large.jpg'
          }
        }
      ]
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [mockDualFacedCard],
          total_cards: 1,
          has_more: false
        })
    })

    const filters: CardSearchFilters = { name: 'Delver' }
    const result = await searchCards(filters)

    expect(result.cards[0].image_uris.normal).toBe('delver-normal.jpg')
  })

  test('APIエラーを適切に処理できる', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    const filters: CardSearchFilters = { name: 'Test' }

    await expect(searchCards(filters)).rejects.toThrow(
      'Scryfall API error: 500'
    )
  })

  test('ネットワークエラーを適切に処理できる', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const filters: CardSearchFilters = { name: 'Test' }

    await expect(searchCards(filters)).rejects.toThrow('Network error')
  })

  test('フィルターパラメータを正しくURLに変換する', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [],
          total_cards: 0,
          has_more: false
        })
    })

    const filters: CardSearchFilters = {
      name: 'Lightning',
      colors: ['R', 'U'],
      type: 'Instant',
      cmc: 2,
      format: 'standard'
    }

    await searchCards(filters)

    // URLエンコード後のパラメータをチェック
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain('name%3A%22Lightning%22')
    expect(url).toContain('type%3A%22Instant%22')
    expect(url).toContain('color%3ARU')
    expect(url).toContain('cmc%3A2')
    expect(url).toContain('format%3Astandard')
  })
})
