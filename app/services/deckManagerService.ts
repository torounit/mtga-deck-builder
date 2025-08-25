import type { Deck, DeckCard } from '../types/deck'

interface SerializedDeck {
  id: string
  name: string
  mainDeck: DeckCard[]
  sideboard: DeckCard[]
  createdAt: string
  updatedAt: string
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DeckManagerService {
  private static readonly STORAGE_KEY = 'mtga-decks'

  static getAllDecks(): Deck[] {
    if (typeof window === 'undefined') {
      console.log('DeckManagerService: windowが未定義')
      return []
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      console.log(
        'DeckManagerService: ローカルストレージから取得:',
        stored ? `${String(stored.length)}文字` : 'null'
      )

      if (!stored) return []

      const decks = JSON.parse(stored) as SerializedDeck[]
      console.log('DeckManagerService: パース結果デッキ数:', decks.length)

      return decks.map((deck) => ({
        ...deck,
        createdAt: new Date(deck.createdAt),
        updatedAt: new Date(deck.updatedAt)
      }))
    } catch (error) {
      console.error('DeckManagerService: getAllDecksエラー:', error)
      return []
    }
  }

  static createDeck(name: string): Deck {
    console.log('DeckManagerService: createDeck呼び出し:', name)

    const now = new Date()
    const newDeck: Deck = {
      id: crypto.randomUUID(),
      name,
      mainDeck: [],
      sideboard: [],
      createdAt: now,
      updatedAt: now
    }

    const decks = this.getAllDecks()
    console.log('DeckManagerService: createDeck前のデッキ数:', decks.length)

    decks.push(newDeck)
    this.saveDecks(decks)

    console.log('DeckManagerService: createDeck後のデッキ数:', decks.length)

    // 保存確認
    const savedDecks = this.getAllDecks()
    console.log('DeckManagerService: 保存後の確認デッキ数:', savedDecks.length)

    return newDeck
  }

  static updateDeck(updatedDeck: Deck): void {
    console.log(
      'DeckManagerService: updateDeck呼び出し:',
      updatedDeck.name,
      'ID:',
      updatedDeck.id
    )

    const decks = this.getAllDecks()
    console.log('DeckManagerService: updateDeck前のデッキ数:', decks.length)

    const index = decks.findIndex((deck) => deck.id === updatedDeck.id)
    console.log('DeckManagerService: 対象デッキのインデックス:', index)

    if (index !== -1) {
      decks[index] = {
        ...updatedDeck,
        updatedAt: new Date()
      }
      this.saveDecks(decks)
      console.log('DeckManagerService: updateDeck完了')
    } else {
      console.log('DeckManagerService: 対象デッキが見つかりません')
    }
  }

  static deleteDeck(deckId: string): void {
    const decks = this.getAllDecks()
    const filteredDecks = decks.filter((deck) => deck.id !== deckId)
    this.saveDecks(filteredDecks)
  }

  static getDeckById(deckId: string): Deck | undefined {
    const decks = this.getAllDecks()
    return decks.find((deck) => deck.id === deckId)
  }

  private static saveDecks(decks: Deck[]): void {
    if (typeof window === 'undefined') {
      console.log('DeckManagerService: saveDecks - windowが未定義')
      return
    }

    try {
      const jsonData = JSON.stringify(decks)
      console.log(
        'DeckManagerService: saveDecks - 保存データ:',
        `${String(jsonData.length)}文字, ${String(decks.length)}デッキ`
      )
      localStorage.setItem(this.STORAGE_KEY, jsonData)

      // 確認のため再読み込み
      const verification = localStorage.getItem(this.STORAGE_KEY)
      console.log(
        'DeckManagerService: saveDecks - 保存確認:',
        verification ? '成功' : '失敗'
      )
    } catch (error) {
      console.error('DeckManagerService: saveDecks - 保存エラー:', error)
    }
  }
}
