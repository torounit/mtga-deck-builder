/**
 * 日付フォーマット関連のユーティリティ関数
 */

/**
 * 日付を日本語ローカル形式でフォーマットする
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
