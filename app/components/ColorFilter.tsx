import { getFilterColorStyle } from '../utils/colorUtils'

interface ColorFilterProps {
  selectedColors: string[]
  onToggleColor: (colorCode: string) => void
}

export default function ColorFilter({
  selectedColors,
  onToggleColor
}: ColorFilterProps) {
  const colors = [
    { code: 'W', name: '白' },
    { code: 'U', name: '青' },
    { code: 'B', name: '黒' },
    { code: 'R', name: '赤' },
    { code: 'G', name: '緑' },
    { code: 'C', name: '無色' }
  ]

  return (
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">色</label>
      <div class="flex gap-1">
        {colors.map((color) => (
          <button
            key={color.code}
            type="button"
            onClick={() => {
              onToggleColor(color.code)
            }}
            class={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              selectedColors.includes(color.code)
                ? `${getFilterColorStyle(color.code)} ring-1 ring-blue-500`
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  )
}