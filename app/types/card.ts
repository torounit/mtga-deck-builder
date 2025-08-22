export interface Card {
  id: string
  name: string
  mana_cost: string
  type_line: string
  oracle_text: string
  power?: string
  toughness?: string
  colors: string[]
  color_identity: string[]
  cmc: number
  set: string
  rarity: string
  image_uris: {
    small: string
    normal: string
    large: string
  }
}

export interface CardSearchFilters {
  name?: string
  colors?: string[]
  type?: string
  cmc?: number
  set?: string
}

export interface CardSearchResult {
  cards: Card[]
  total_cards: number
  has_more: boolean
}
