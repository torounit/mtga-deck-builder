import { createRoute } from 'honox/factory'
import DeckBuilderApp from '../../islands/deckBuilderApp'

export default createRoute((c) => {
  const deckId = c.req.param('id')
  
  return c.render(
    <div class="h-full flex flex-col bg-gray-50">
      <title>デッキ編集 - MTG Arena Deck Builder</title>
      <header class="flex-shrink-0 bg-white shadow-sm border-b">
        <div class="px-4 py-2">
          <div class="flex items-center gap-3">
            <a
              href="/"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← デッキ一覧
            </a>
            <h1 class="text-lg font-bold text-gray-900">デッキ編集</h1>
          </div>
        </div>
      </header>
      <main class="flex-1 overflow-hidden p-4">
        <DeckBuilderApp deckId={deckId} />
      </main>
    </div>
  )
})