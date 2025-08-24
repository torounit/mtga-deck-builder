import { describe, it, expect, beforeEach, vi } from 'vitest'

// ローカルストレージの統合テスト
describe('DeckListPage 統合テスト', () => {
  const mockLocalStorage = {
    data: new Map<string, string>(),
    getItem: vi.fn((key: string) => mockLocalStorage.data.get(key) || null),
    setItem: vi.fn((key: string, value: string) => {
      mockLocalStorage.data.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      mockLocalStorage.data.delete(key)
    }),
    clear: vi.fn(() => {
      mockLocalStorage.data.clear()
    }),
    get length() {
      return mockLocalStorage.data.size
    },
    key: vi.fn((index: number) => {
      const keys = Array.from(mockLocalStorage.data.keys())
      return keys[index] || null
    })
  }

  beforeEach(() => {
    // ローカルストレージのモック設定
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
    
    // windowオブジェクトの設定
    Object.defineProperty(global, 'window', {
      value: { localStorage: mockLocalStorage },
      writable: true
    })
    
    // crypto.randomUUIDのモック
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: vi.fn(() => 'test-uuid-' + Date.now())
      },
      writable: true
    })
    
    // データをクリア
    mockLocalStorage.clear()
    vi.clearAllMocks()
  })

  it('デッキを作成して保存し、一覧で取得できる', async () => {
    // DeckManagerServiceを動的インポート（モックの後で）
    const { DeckManagerService } = await import('../../services/deckManagerService')
    
    console.log('=== テスト開始 ===')
    
    // 初期状態では空
    const initialDecks = DeckManagerService.getAllDecks()
    console.log('初期デッキ数:', initialDecks.length)
    expect(initialDecks).toEqual([])

    // デッキを作成
    const testDeckName = 'テスト用デッキ'
    console.log('デッキ作成開始:', testDeckName)
    const createdDeck = DeckManagerService.createDeck(testDeckName)
    
    console.log('作成されたデッキ:', createdDeck)
    expect(createdDeck.name).toBe(testDeckName)
    expect(createdDeck.id).toBeDefined()

    // 保存されているか確認
    console.log('ローカルストレージの内容:')
    const rawData = mockLocalStorage.getItem('mtga-decks')
    console.log('生データ:', rawData)
    
    if (rawData) {
      const parsedData = JSON.parse(rawData)
      console.log('パースされたデータ:', parsedData)
      console.log('パースされた配列の長さ:', parsedData.length)
    }

    // 再取得してテスト
    console.log('デッキ再取得開始')
    const retrievedDecks = DeckManagerService.getAllDecks()
    console.log('取得されたデッキ数:', retrievedDecks.length)
    console.log('取得されたデッキ:', retrievedDecks)
    
    expect(retrievedDecks).toHaveLength(1)
    expect(retrievedDecks[0]?.name).toBe(testDeckName)
  })

  it('複数のデッキを作成して管理できる', async () => {
    const { DeckManagerService } = await import('../../services/deckManagerService')
    
    // 3つのデッキを作成
    const deck1 = DeckManagerService.createDeck('デッキ1')
    const deck2 = DeckManagerService.createDeck('デッキ2') 
    const deck3 = DeckManagerService.createDeck('デッキ3')
    
    // 全てのデッキが取得できることを確認
    const allDecks = DeckManagerService.getAllDecks()
    expect(allDecks).toHaveLength(3)
    
    const names = allDecks.map(deck => deck.name)
    expect(names).toContain('デッキ1')
    expect(names).toContain('デッキ2')
    expect(names).toContain('デッキ3')
  })
})