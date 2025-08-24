import { getColorStyle } from '../utils/colorUtils'

interface ColorCircleProps {
  color: string
}

export default function ColorCircle({ color }: ColorCircleProps) {
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