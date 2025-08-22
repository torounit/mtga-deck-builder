import type { CardSearchFilters, CardSearchResult } from '../types/card'

export interface SearchOptions {
  page?: number
  pageSize?: number
}

export function searchCards(
  _filters: CardSearchFilters,
  _options: SearchOptions = {}
): Promise<CardSearchResult> {
  // まずテストを通すための最小限の実装（後でScryfall APIを実装）
  throw new Error('Not implemented yet')
}
