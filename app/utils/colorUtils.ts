/**
 * MTGカードの色関連のユーティリティ関数とコンポーネント
 */

/**
 * MTGカードの色に対応するTailwind CSSクラス
 */
const COLOR_STYLES = {
  W: 'bg-yellow-100 border-yellow-400 text-yellow-800', // 白
  U: 'bg-blue-100 border-blue-400 text-blue-800', // 青
  B: 'bg-gray-800 border-gray-900 text-white', // 黒
  R: 'bg-red-100 border-red-400 text-red-800', // 赤
  G: 'bg-green-100 border-green-400 text-green-800' // 緑
} as const

/**
 * 色フィルター用の色スタイル（border なし）
 */
const FILTER_COLOR_STYLES = {
  W: 'bg-yellow-100 text-yellow-800', // 白
  U: 'bg-blue-100 text-blue-800', // 青
  B: 'bg-gray-100 text-gray-800', // 黒
  R: 'bg-red-100 text-red-800', // 赤
  G: 'bg-green-100 text-green-800', // 緑
  C: 'bg-gray-200 text-gray-800' // 無色
} as const

/**
 * カード枠線の色スタイル
 */
const CARD_BORDER_STYLES = {
  W: 'border-yellow-400', // 白
  U: 'border-blue-400', // 青
  B: 'border-gray-600', // 黒
  R: 'border-red-400', // 赤
  G: 'border-green-400', // 緑
  C: 'border-gray-300' // 無色
} as const

/**
 * カード色関連の定数
 */
export const CARD_COLOR_CLASSES = {
  // 多色カード・無色カードの枠線
  multicolor: 'border-yellow-600', // 多色カードの金色枠
  colorless: 'border-gray-300' // 無色カードのデフォルト枠
} as const

/**
 * カードの色に対応するCSS クラス名を取得する
 */
export const getColorStyle = (color: string): string => {
  const colorKey = color as keyof typeof COLOR_STYLES
  return colorKey in COLOR_STYLES
    ? COLOR_STYLES[colorKey]
    : 'bg-gray-100 border-gray-400 text-gray-800'
}

/**
 * 色フィルター用のCSS クラス名を取得する
 */
export const getFilterColorStyle = (color: string): string => {
  const colorKey = color as keyof typeof FILTER_COLOR_STYLES
  return colorKey in FILTER_COLOR_STYLES
    ? FILTER_COLOR_STYLES[colorKey]
    : 'bg-gray-100 text-gray-800'
}

/**
 * カード枠線の色を取得する
 */
export const getCardBorderColor = (colors: string[]): string => {
  if (colors.length === 0) {
    return CARD_COLOR_CLASSES.colorless
  }

  if (colors.length === 1) {
    const colorKey = colors[0] as keyof typeof CARD_BORDER_STYLES
    return colorKey in CARD_BORDER_STYLES
      ? CARD_BORDER_STYLES[colorKey]
      : CARD_COLOR_CLASSES.colorless
  }

  // 多色カードは金色の枠
  return CARD_COLOR_CLASSES.multicolor
}
