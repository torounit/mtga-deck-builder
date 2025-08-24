import type { Deck } from '../types/deck'

/**
 * デッキ関連のユーティリティ関数
 */

/**
 * デッキの総カード枚数を取得する
 */
export const getTotalCards = (deck: Deck): { main: number; side: number } => {
  const mainCount = deck.mainDeck.reduce((sum, dc) => sum + dc.quantity, 0)
  const sideCount = deck.sideboard.reduce((sum, dc) => sum + dc.quantity, 0)
  return { main: mainCount, side: sideCount }
}
