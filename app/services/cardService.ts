import type { Card, CardSearchFilters, CardSearchResult } from '../types/card'

export interface SearchOptions {
  page?: number
  pageSize?: number
}

interface ScryfallCard {
  id: string
  name: string
  mana_cost?: string
  type_line: string
  oracle_text?: string
  power?: string
  toughness?: string
  colors?: string[]
  color_identity?: string[]
  cmc: number
  set: string
  rarity: string
  image_uris?: {
    small: string
    normal: string
    large: string
  }
}

interface ScryfallResponse {
  data?: ScryfallCard[]
  total_cards?: number
  has_more?: boolean
}

const SCRYFALL_API_BASE = 'https://api.scryfall.com'

function buildSearchQuery(filters: CardSearchFilters): string {
  const queryParts: string[] = []

  if (filters.name) {
    queryParts.push(`name:"${filters.name}"`)
  }

  if (filters.colors && filters.colors.length > 0) {
    const colorQuery = filters.colors.join('')
    queryParts.push(`color:${colorQuery}`)
  }

  if (filters.type) {
    queryParts.push(`type:"${filters.type}"`)
  }

  if (filters.cmc !== undefined) {
    queryParts.push(`cmc:${String(filters.cmc)}`)
  }

  if (filters.set) {
    queryParts.push(`set:"${filters.set}"`)
  }

  // MTGA対応のカードのみ検索
  queryParts.push('game:arena')

  return queryParts.join(' ')
}

function transformScryfallCard(cardData: ScryfallCard): Card {
  return {
    id: cardData.id,
    name: cardData.name,
    mana_cost: cardData.mana_cost ?? '',
    type_line: cardData.type_line,
    oracle_text: cardData.oracle_text ?? '',
    power: cardData.power,
    toughness: cardData.toughness,
    colors: cardData.colors ?? [],
    color_identity: cardData.color_identity ?? [],
    cmc: cardData.cmc,
    set: cardData.set,
    rarity: cardData.rarity,
    image_uris: cardData.image_uris ?? {
      small: '',
      normal: '',
      large: ''
    }
  }
}

export async function searchCards(
  filters: CardSearchFilters,
  options: SearchOptions = {}
): Promise<CardSearchResult> {
  const { page = 1, pageSize = 16 } = options

  const query = buildSearchQuery(filters)
  const url = new URL(`${SCRYFALL_API_BASE}/cards/search`)
  url.searchParams.set('q', query)
  url.searchParams.set('page', page.toString())
  url.searchParams.set('format', 'json')

  try {
    const response = await fetch(url.toString())

    if (!response.ok) {
      if (response.status === 404) {
        // 結果なしの場合
        return {
          cards: [],
          total_cards: 0,
          has_more: false
        }
      }
      throw new Error(`Scryfall API error: ${String(response.status)}`)
    }

    const data: ScryfallResponse = await response.json()
    const responseData = data.data ?? []
    const cards = responseData.slice(0, pageSize).map(transformScryfallCard)

    return {
      cards,
      total_cards: data.total_cards ?? 0,
      has_more: data.has_more ?? false
    }
  } catch (error) {
    console.error('Failed to search cards:', error)
    throw error
  }
}
