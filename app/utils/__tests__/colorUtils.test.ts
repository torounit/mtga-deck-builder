import { describe, test, expect } from 'vitest'
import {
  getColorStyle,
  getFilterColorStyle,
  getCardBorderColor
} from '../colorUtils'

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

  describe('getFilterColorStyle', () => {
    test('白(W)のフィルター用スタイルを返す', () => {
      const style = getFilterColorStyle('W')
      expect(style).toBe('bg-yellow-100 text-yellow-800')
    })

    test('青(U)のフィルター用スタイルを返す', () => {
      const style = getFilterColorStyle('U')
      expect(style).toBe('bg-blue-100 text-blue-800')
    })

    test('無色(C)のフィルター用スタイルを返す', () => {
      const style = getFilterColorStyle('C')
      expect(style).toBe('bg-gray-200 text-gray-800')
    })

    test('未知の色にはデフォルトスタイルを返す', () => {
      const style = getFilterColorStyle('X')
      expect(style).toBe('bg-gray-100 text-gray-800')
    })
  })

  describe('getCardBorderColor', () => {
    test('無色カード（空の配列）のデフォルト枠線を返す', () => {
      const borderColor = getCardBorderColor([])
      expect(borderColor).toBe('border-gray-300')
    })

    test('単色カード（白）の正しい枠線を返す', () => {
      const borderColor = getCardBorderColor(['W'])
      expect(borderColor).toBe('border-yellow-400')
    })

    test('単色カード（青）の正しい枠線を返す', () => {
      const borderColor = getCardBorderColor(['U'])
      expect(borderColor).toBe('border-blue-400')
    })

    test('多色カードの金色枠線を返す', () => {
      const borderColor = getCardBorderColor(['R', 'G'])
      expect(borderColor).toBe('border-yellow-600')
    })

    test('未知の色にはデフォルト枠線を返す', () => {
      const borderColor = getCardBorderColor(['X'])
      expect(borderColor).toBe('border-gray-300')
    })
  })

  // getColorCircleは別のColorCircleコンポーネントに移動しました
})
