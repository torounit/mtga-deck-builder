import { createRoute } from 'honox/factory'
import DeckBuilderApp from '../../islands/deckBuilderApp'

export default createRoute((c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50">
      <title>新規デッキ作成 - MTG Arena Deck Builder</title>
      <header class="bg-white shadow-sm border-b">
        <div class="px-4 py-2">
          <div class="flex items-center gap-3">
            <a
              href="/"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← デッキ一覧
            </a>
            <h1 class="text-xl font-bold text-gray-900">新規デッキ作成</h1>
          </div>
        </div>
      </header>
      <main class="px-4 py-2">
        <DeckBuilderApp />
      </main>
    </div>
  )
})