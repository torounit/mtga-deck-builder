import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeckManagerService } from '../deckManagerService'

describe('DeckManagerService', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // localStorageをモック化
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
  })

  describe('getAllDecks', () => {
    it('保存されているデッキ一覧を取得できる', () => {
      const mockDecks = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'テストデッキ1',
          mainDeck: [],
          sideboard: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'テストデッキ2',
          mainDeck: [],
          sideboard: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockDecks))

      const result = DeckManagerService.getAllDecks()
      expect(result).toEqual(mockDecks)
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('mtga-decks')
    })

    it('保存されたデッキが無い場合は空配列を返す', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const result = DeckManagerService.getAllDecks()
      expect(result).toEqual([])
    })
  })

  describe('createDeck', () => {
    it('新しいデッキを作成して保存できる', () => {
      const beforeCreate = Date.now()
      const existingDecks = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'テストデッキ1',
          mainDeck: [],
          sideboard: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingDecks))

      const newDeck = DeckManagerService.createDeck('新しいデッキ')
      const afterCreate = Date.now()

      expect(newDeck.name).toBe('新しいデッキ')
      expect(newDeck.id).toBeDefined()
      expect(newDeck.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      )
      expect(newDeck.mainDeck).toEqual([])
      expect(newDeck.sideboard).toEqual([])
      expect(newDeck.createdAt).toBeInstanceOf(Date)
      expect(newDeck.updatedAt).toBeInstanceOf(Date)
      expect(newDeck.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate)
      expect(newDeck.createdAt.getTime()).toBeLessThanOrEqual(afterCreate)
      expect(newDeck.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate)
      expect(newDeck.updatedAt.getTime()).toBeLessThanOrEqual(afterCreate)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'mtga-decks',
        JSON.stringify([...existingDecks, newDeck])
      )
    })
  })

  describe('updateDeck', () => {
    it('既存デッキを更新できる', () => {
      const mockDecks = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'テストデッキ1',
          mainDeck: [],
          sideboard: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'テストデッキ2',
          mainDeck: [],
          sideboard: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockDecks))

      const updatedDeck = { ...mockDecks[0], name: '更新されたデッキ' }
      DeckManagerService.updateDeck(updatedDeck)

      expect(mockLocalStorage.setItem).toHaveBeenCalled()
      const savedData = mockLocalStorage.setItem.mock.calls[0]?.[1] as string
      const savedDecks = JSON.parse(savedData) as {
        name: string
        updatedAt: Date
      }[]
      expect(savedDecks[0]?.name).toBe('更新されたデッキ')
      expect(savedDecks[0]?.updatedAt).toBeDefined()
    })
  })

  describe('deleteDeck', () => {
    it('指定されたIDのデッキを削除できる', () => {
      const mockDecks = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'テストデッキ1',
          mainDeck: [],
          sideboard: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'テストデッキ2',
          mainDeck: [],
          sideboard: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockDecks))

      DeckManagerService.deleteDeck('550e8400-e29b-41d4-a716-446655440001')

      const expectedDecks = [mockDecks[1]]
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'mtga-decks',
        JSON.stringify(expectedDecks)
      )
    })
  })

  describe('getDeckById', () => {
    it('IDでデッキを取得できる', () => {
      const mockDecks = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'テストデッキ1',
          mainDeck: [],
          sideboard: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'テストデッキ2',
          mainDeck: [],
          sideboard: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockDecks))

      const result = DeckManagerService.getDeckById(
        '550e8400-e29b-41d4-a716-446655440001'
      )
      expect(result).toEqual(mockDecks[0])
    })

    it('存在しないIDの場合はundefinedを返す', () => {
      const mockDecks = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'テストデッキ1',
          mainDeck: [],
          sideboard: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockDecks))

      const result = DeckManagerService.getDeckById(
        '550e8400-e29b-41d4-a716-446655440999'
      )
      expect(result).toBeUndefined()
    })
  })
})
