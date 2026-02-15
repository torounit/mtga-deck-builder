import { createRoute } from 'honox/factory'
import DeckListPage from '../islands/deckListPage'

export default createRoute((c) => {
  return c.render(
    <div class="h-full flex flex-col bg-gray-50">
      <title>MTG Arena Deck Builder</title>
      <header class="flex-shrink-0 bg-white shadow-sm border-b">
        <div class="px-4 py-2">
          <h1 class="text-lg font-bold text-gray-900">MTG Arena Deck Builder</h1>
        </div>
      </header>
      <main class="flex-1 overflow-auto p-4">
        <DeckListPage />
      </main>
    </div>
  )
})
