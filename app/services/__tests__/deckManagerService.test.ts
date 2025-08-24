import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Deck } from '../../types/deck'
import { DeckManagerService } from '../deckManagerService'

describe('DeckManagerService', () => {
  const mockGetItem = vi.fn()
  const mockSetItem = vi.fn()

  beforeEach(() => {
    mockGetItem.mockClear()
    mockSetItem.mockClear()

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    })
  })

  describe('getAllDecks', () => {
    it('保存されているデッキ一覧を取得できる', () => {
      const mockDecks: Deck[] = [
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
      mockGetItem.mockReturnValue(JSON.stringify(mockDecks))

      const result = DeckManagerService.getAllDecks()
      expect(result).toEqual(mockDecks)
      expect(mockGetItem).toHaveBeenCalledWith('mtga-decks')
    })

    it('保存されたデッキが無い場合は空配列を返す', () => {
      mockGetItem.mockReturnValue(null)

      const result = DeckManagerService.getAllDecks()
      expect(result).toEqual([])
    })
  })

  describe('createDeck', () => {
    it('新しいデッキを作成して保存できる', () => {
      const existingDecks: Deck[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'テストデッキ1',
          mainDeck: [],
          sideboard: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockGetItem.mockReturnValue(JSON.stringify(existingDecks))

      const newDeck = DeckManagerService.createDeck('新しいデッキ')

      expect(newDeck.name).toBe('新しいデッキ')
      expect(newDeck.id).toBeDefined()
      expect(newDeck.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      )
      expect(newDeck.mainDeck).toEqual([])
      expect(newDeck.sideboard).toEqual([])
      expect(newDeck.createdAt).toBeInstanceOf(Date)
      expect(newDeck.updatedAt).toBeInstanceOf(Date)
      expect(mockSetItem).toHaveBeenCalledWith(
        'mtga-decks',
        JSON.stringify([...existingDecks, newDeck])
      )
    })
  })

  describe('updateDeck', () => {
    it('既存デッキを更新できる', () => {
      const mockDecks: Deck[] = [
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
      mockGetItem.mockReturnValue(JSON.stringify(mockDecks))

      const updatedDeck = { ...mockDecks[0], name: '更新されたデッキ' }
      DeckManagerService.updateDeck(updatedDeck)

      expect(mockSetItem).toHaveBeenCalled()
      const savedData = mockSetItem.mock.calls[0]?.[1] as string
      const savedDecks = JSON.parse(savedData) as Deck[]
      expect(savedDecks[0]?.name).toBe('更新されたデッキ')
      expect(savedDecks[0]?.updatedAt).toBeDefined()
    })
  })

  describe('deleteDeck', () => {
    it('指定されたIDのデッキを削除できる', () => {
      const mockDecks: Deck[] = [
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
      mockGetItem.mockReturnValue(JSON.stringify(mockDecks))

      DeckManagerService.deleteDeck('550e8400-e29b-41d4-a716-446655440001')

      const expectedDecks = [mockDecks[1]]
      expect(mockSetItem).toHaveBeenCalledWith(
        'mtga-decks',
        JSON.stringify(expectedDecks)
      )
    })
  })

  describe('getDeckById', () => {
    it('IDでデッキを取得できる', () => {
      const mockDecks: Deck[] = [
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
      mockGetItem.mockReturnValue(JSON.stringify(mockDecks))

      const result = DeckManagerService.getDeckById(
        '550e8400-e29b-41d4-a716-446655440001'
      )
      expect(result).toEqual(mockDecks[0])
    })

    it('存在しないIDの場合はundefinedを返す', () => {
      const mockDecks: Deck[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'テストデッキ1',
          mainDeck: [],
          sideboard: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockGetItem.mockReturnValue(JSON.stringify(mockDecks))

      const result = DeckManagerService.getDeckById(
        '550e8400-e29b-41d4-a716-446655440999'
      )
      expect(result).toBeUndefined()
    })
  })
})
