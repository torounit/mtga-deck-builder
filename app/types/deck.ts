import type { Card } from './card'

export interface DeckCard {
  card: Card
  quantity: number
}

export interface Deck {
  id: string
  name: string
  mainDeck: DeckCard[]
  sideboard: DeckCard[]
  createdAt: Date
  updatedAt: Date
}

export const MAX_MAIN_DECK_SIZE = 60
export const MAX_SIDEBOARD_SIZE = 15
export const MAX_CARD_COPIES = 4
