import { describe, test, expect } from 'vitest'
import { getColorStyle } from '../colorUtils'

describe('colorUtils', () => {
  describe('getColorStyle', () => {
    test('白(W)の正しいスタイルを返す', () => {
      const style = getColorStyle('W')
      expect(style).toBe('bg-yellow-100 border-yellow-400 text-yellow-800')
    })

    test('青(U)の正しいスタイルを返す', () => {
      const style = getColorStyle('U')
      expect(style).toBe('bg-blue-100 border-blue-400 text-blue-800')
    })

    test('黒(B)の正しいスタイルを返す', () => {
      const style = getColorStyle('B')
      expect(style).toBe('bg-gray-800 border-gray-900 text-white')
    })

    test('赤(R)の正しいスタイルを返す', () => {
      const style = getColorStyle('R')
      expect(style).toBe('bg-red-100 border-red-400 text-red-800')
    })

    test('緑(G)の正しいスタイルを返す', () => {
      const style = getColorStyle('G')
      expect(style).toBe('bg-green-100 border-green-400 text-green-800')
    })

    test('未知の色にはデフォルトスタイルを返す', () => {
      const style = getColorStyle('X')
      expect(style).toBe('bg-gray-100 border-gray-400 text-gray-800')
    })

    test('空文字列にはデフォルトスタイルを返す', () => {
      const style = getColorStyle('')
      expect(style).toBe('bg-gray-100 border-gray-400 text-gray-800')
    })
  })

  // getColorCircleはJSXを返すため、単体テストは複雑になるので省略
  // 実際のコンポーネント統合テストで確認する
})