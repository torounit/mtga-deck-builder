import { createRoute } from 'honox/factory'
import DeckBuilderApp from '../islands/deckBuilderApp'

export default createRoute((c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50">
      <title>MTG Arena Deck Builder</title>
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <h1 class="text-3xl font-bold text-gray-900">MTG Arena Deck Builder</h1>
        </div>
      </header>
      <main class="max-w-7xl mx-auto px-4 py-8">
        <DeckBuilderApp />
      </main>
    </div>
  )
})
