interface PaginationProps {
  currentPage: number
  totalCards: number
  pageSize: number
  hasMore: boolean
  loading: boolean
  onPreviousPage: () => void
  onNextPage: () => void
}

export default function Pagination({
  currentPage,
  totalCards,
  pageSize,
  hasMore,
  loading,
  onPreviousPage,
  onNextPage
}: PaginationProps) {
  if (totalCards === 0) {
    return null
  }

  return (
    <div class="flex justify-center items-center mt-6 gap-4">
      <button
        onClick={onPreviousPage}
        disabled={currentPage === 1 || loading}
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        前のページ
      </button>

      <span class="text-gray-700">
        {currentPage} / {Math.ceil(totalCards / pageSize)} ページ ({totalCards}件中{' '}
        {Math.min((currentPage - 1) * pageSize + 1, totalCards)}-
        {Math.min(currentPage * pageSize, totalCards)}件目)
      </span>

      <button
        onClick={onNextPage}
        disabled={!hasMore || loading}
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        次のページ
      </button>
    </div>
  )
}