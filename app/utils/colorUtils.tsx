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
 * カードの色を表す円形マーカーコンポーネントを生成する
 */
export const getColorCircle = (color: string) => {
  const colorStyle = getColorStyle(color)
  
  return (
    <span
      class={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full border-2 ${colorStyle}`}
      title={`色: ${color}`}
    >
      {color}
    </span>
  )
}

/**
 * カードの色に対応するCSS クラス名を取得する
 */
export const getColorStyle = (color: string): string => {
  const colorKey = color as keyof typeof COLOR_STYLES
  return colorKey in COLOR_STYLES 
    ? COLOR_STYLES[colorKey] 
    : 'bg-gray-100 border-gray-400 text-gray-800'
}