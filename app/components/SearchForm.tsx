interface SearchFormProps {
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onSubmit: (e: Event) => void
  loading: boolean
}

export default function SearchForm({
  searchQuery,
  onSearchQueryChange,
  onSubmit,
  loading
}: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} class="mb-6">
      <div class="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onInput={(e) => {
            onSearchQueryChange((e.target as HTMLInputElement).value)
          }}
          placeholder="カード名またはテキストを入力..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '検索中...' : '検索'}
        </button>
      </div>
    </form>
  )
}