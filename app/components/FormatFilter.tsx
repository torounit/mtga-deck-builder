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
      <div class="space-y-2">
        {formats.map((format) => (
          <label key={format.value} class="flex items-center">
            <input
              type="radio"
              name="format"
              value={format.value}
              checked={selectedFormat === format.value}
              onChange={(e) => {
                const newFormat = (e.target as HTMLInputElement).value
                onFormatChange(newFormat)
              }}
              class="mr-2"
            />
            <span>{format.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}