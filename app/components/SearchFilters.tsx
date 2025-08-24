import ColorFilter from './ColorFilter'
import FormatFilter from './FormatFilter'

interface SearchFiltersProps {
  selectedColors: string[]
  selectedType: string
  selectedCmc: number | undefined
  selectedFormat: string
  onToggleColor: (colorCode: string) => void
  onTypeChange: (type: string) => void
  onCmcChange: (cmc: number | undefined) => void
  onFormatChange: (format: string) => void
}

export default function SearchFilters({
  selectedColors,
  selectedType,
  selectedCmc,
  selectedFormat,
  onToggleColor,
  onTypeChange,
  onCmcChange,
  onFormatChange
}: SearchFiltersProps) {
  return (
    <div class="bg-gray-50 p-3 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <div class="md:col-span-3">
          <ColorFilter
            selectedColors={selectedColors}
            onToggleColor={onToggleColor}
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">タイプ</label>
          <select
            value={selectedType}
            onChange={(e) => {
              onTypeChange((e.target as HTMLSelectElement).value)
            }}
            class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">すべてのタイプ</option>
            <option value="Creature">クリーチャー</option>
            <option value="Instant">インスタント</option>
            <option value="Sorcery">ソーサリー</option>
            <option value="Enchantment">エンチャント</option>
            <option value="Artifact">アーティファクト</option>
            <option value="Planeswalker">プレインズウォーカー</option>
            <option value="Land">土地</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">マナコスト</label>
          <select
            value={selectedCmc ?? ''}
            onChange={(e) => {
              const value = (e.target as HTMLSelectElement).value
              onCmcChange(value === '' ? undefined : parseInt(value))
            }}
            class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">すべてのコスト</option>
            {Array.from({ length: 16 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <FormatFilter
          selectedFormat={selectedFormat}
          onFormatChange={onFormatChange}
        />
      </div>
    </div>
  )
}