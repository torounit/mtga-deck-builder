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
    // カード名またはカードテキストで検索
    queryParts.push(`(name:"${filters.name}" OR oracle:"${filters.name}")`)
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

  if (filters.format) {
    queryParts.push(`format:${filters.format}`)
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

// Scryfall APIのページサイズは175件固定
const SCRYFALL_PAGE_SIZE = 175

export async function searchCards(
  filters: CardSearchFilters,
  options: SearchOptions = {}
): Promise<CardSearchResult> {
  const { page = 1, pageSize = 16 } = options

  // どのScryfall APIページから取得するかを計算
  const scryfallPageStart =
    Math.floor(((page - 1) * pageSize) / SCRYFALL_PAGE_SIZE) + 1
  const offsetInScryfallPage = ((page - 1) * pageSize) % SCRYFALL_PAGE_SIZE

  const query = buildSearchQuery(filters)
  const url = new URL(`${SCRYFALL_API_BASE}/cards/search`)
  url.searchParams.set('q', query)
  url.searchParams.set('page', scryfallPageStart.toString())
  url.searchParams.set('format', 'json')
  url.searchParams.set('order', 'name')
  url.searchParams.set('dir', 'asc')

  try {
    const response = await fetch(url.toString())

    if (!response.ok) {
      if (response.status === 404) {
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
    const totalCards = data.total_cards ?? 0

    // 複数のScryfall APIページが必要な場合の処理
    let allCards = responseData

    // 必要に応じて次のScryfall APIページも取得
    const neededCards = pageSize
    const availableInCurrentPage = SCRYFALL_PAGE_SIZE - offsetInScryfallPage

    if (neededCards > availableInCurrentPage && data.has_more) {
      // 次のScryfall APIページも取得
      const nextUrl = new URL(`${SCRYFALL_API_BASE}/cards/search`)
      nextUrl.searchParams.set('q', query)
      nextUrl.searchParams.set('page', (scryfallPageStart + 1).toString())
      nextUrl.searchParams.set('format', 'json')
      nextUrl.searchParams.set('order', 'name')
      nextUrl.searchParams.set('dir', 'asc')

      const nextResponse = await fetch(nextUrl.toString())
      if (nextResponse.ok) {
        const nextData: ScryfallResponse = await nextResponse.json()
        allCards = [...responseData, ...(nextData.data ?? [])]
      }
    }

    // 指定されたページサイズで切り出し
    const startIndex = offsetInScryfallPage
    const endIndex = startIndex + pageSize
    const paginatedCards = allCards.slice(startIndex, endIndex)
    const cards = paginatedCards.map(transformScryfallCard)

    // 総ページ数を計算してhas_moreを判定
    const totalPages = Math.ceil(totalCards / pageSize)
    const hasMore = page < totalPages

    return {
      cards,
      total_cards: totalCards,
      has_more: hasMore
    }
  } catch (error) {
    console.error('Failed to search cards:', error)
    throw error
  }
}
