import { describe, test, expect } from 'vitest'
import { formatDate } from '../dateUtils'

describe('dateUtils', () => {
  describe('formatDate', () => {
    test('日付を日本語形式でフォーマットできる', () => {
      const date = new Date('2025-08-24T15:30:00')
      const formatted = formatDate(date)

      // 日本語フォーマットの基本形式を確認（ブラウザ環境により表示が異なる可能性あり）
      expect(formatted).toContain('2025')
      expect(formatted).toContain('15:30')
    })

    test('異なる日付でも正しくフォーマットできる', () => {
      const date = new Date('2024-12-01T09:15:30')
      const formatted = formatDate(date)

      expect(formatted).toContain('2024')
      expect(formatted).toContain('09:15')
    })
  })
})
