import type { Deck, DeckCard } from '../types/deck'
import type { Card } from '../types/card'
import { DeckService } from '../services/deckService'

interface DeckBuilderProps {
  deck: Deck
  onCardAdd?: (card: Card, location?: 'main' | 'sideboard') => void
  onCardRemove?: (cardId: string, location: 'main' | 'sideboard') => void
  onDeckNameChange?: (name: string) => void
}

export default function DeckBuilder({ 
  deck, 
  onCardAdd, 
  onCardRemove, 
  onDeckNameChange 
}: DeckBuilderProps) {
  const handleAddCard = (card: Card, location: 'main' | 'sideboard' = 'main') => {
    onCardAdd?.(card, location)
  }

  const handleRemoveCard = (cardId: string, location: 'main' | 'sideboard') => {
    onCardRemove?.(cardId, location)
  }

  const handleDeckNameChange = (name: string) => {
    onDeckNameChange?.(name)
  }

  const handleExport = () => {
    const exportText = DeckService.exportDeckToMTGA(deck)
    navigator.clipboard.writeText(exportText)
    alert('デッキリストをクリップボードにコピーしました')
  }

  const stats = DeckService.getDeckStats(deck)

  const renderDeckSection = (
    title: string,
    cards: DeckCard[],
    location: 'main' | 'sideboard',
    maxSize: number
  ) => (
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold mb-3">
        {title} ({cards.reduce((sum, dc) => sum + dc.quantity, 0)}/{maxSize})
      </h3>
      <div class="space-y-2 max-h-96 overflow-y-auto">
        {cards.map((deckCard) => (
          <div key={deckCard.card.id} class="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
            <div class="flex-1">
              <span class="font-medium">{deckCard.quantity}x </span>
              <span>{deckCard.card.name}</span>
              <span class="text-gray-500 text-sm ml-2">{deckCard.card.mana_cost}</span>
            </div>
            <div class="flex gap-1">
              <button
                onClick={() => handleAddCard(deckCard.card, location)}
                class="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                +
              </button>
              <button
                onClick={() => handleRemoveCard(deckCard.card.id, location)}
                class="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                -
              </button>
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <p class="text-gray-500 text-center py-4">カードがありません</p>
        )}
      </div>
    </div>
  )

  return (
    <div class="w-full">
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex items-center justify-between mb-4">
          <input
            type="text"
            value={deck.name}
            onInput={(e) => handleDeckNameChange((e.target as HTMLInputElement).value)}
            class="text-xl font-bold bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded"
          />
          <button
            onClick={handleExport}
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            MTGAにエクスポート
          </button>
        </div>
        
        <div class="flex gap-4 text-sm">
          <span class={`${stats.isValidMainDeck ? 'text-green-600' : 'text-red-600'}`}>
            メインデッキ: {stats.mainDeckSize}/60
          </span>
          <span class={`${stats.isValidSideboard ? 'text-green-600' : 'text-red-600'}`}>
            サイドボード: {stats.sideboardSize}/15
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderDeckSection('メインデッキ', deck.mainDeck, 'main', 60)}
        {renderDeckSection('サイドボード', deck.sideboard, 'sideboard', 15)}
      </div>
    </div>
  )
}