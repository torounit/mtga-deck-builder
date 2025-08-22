import type { Card, CardSearchFilters, CardSearchResult } from '../types/card'

export interface SearchOptions {
  page?: number
  pageSize?: number
}

const SCRYFALL_API_BASE = 'https://api.scryfall.com'

export async function searchCards(
  filters: CardSearchFilters,
  options: SearchOptions = {}
): Promise<CardSearchResult> {
  const { page = 1, pageSize = 16 } = options

  // Scryfall APIの検索クエリを構築
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

  const query = queryParts.join(' ')
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

    const data = await response.json()

    // Scryfall APIのレスポンスを変換
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const responseData = data.data ?? []
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const cards: Card[] = responseData
      .slice(0, pageSize)
      .map((cardData: any) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        id: cardData.id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        name: cardData.name,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        mana_cost: cardData.mana_cost ?? '',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        type_line: cardData.type_line,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        oracle_text: cardData.oracle_text ?? '',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        power: cardData.power,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        toughness: cardData.toughness,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        colors: cardData.colors ?? [],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        color_identity: cardData.color_identity ?? [],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        cmc: cardData.cmc,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        set: cardData.set,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        rarity: cardData.rarity,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        image_uris: cardData.image_uris ?? {
          small: '',
          normal: '',
          large: ''
        }
      }))

    return {
      cards,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      total_cards: data.total_cards ?? 0,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      has_more: data.has_more ?? false
    }
  } catch (error) {
    console.error('Failed to search cards:', error)
    throw error
  }
}
