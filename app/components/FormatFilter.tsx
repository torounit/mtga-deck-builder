interface FormatFilterProps {
  selectedFormat: string
  onFormatChange: (format: string) => void
}

export default function FormatFilter({
  selectedFormat,
  onFormatChange
}: FormatFilterProps) {
  const formats = [
    { value: 'standard', label: 'スタンダード' },
    { value: 'pioneer', label: 'パイオニア' },
    { value: 'historic', label: 'ヒストリック' },
    { value: 'alchemy', label: 'アルケミー' }
  ]

  return (
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">フォーマット</label>
      <select
        value={selectedFormat}
        onChange={(e) => {
          const newFormat = (e.target as HTMLSelectElement).value
          onFormatChange(newFormat)
        }}
        class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {formats.map((format) => (
          <option key={format.value} value={format.value}>
            {format.label}
          </option>
        ))}
      </select>
    </div>
  )
}