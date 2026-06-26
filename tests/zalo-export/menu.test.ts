import { describe, it, expect } from 'vitest'
import { formatMenuText } from '@/lib/zalo-export/menu'
import type { Menu } from '@/types/database'

const menu: Menu = {
  id: '1', week_start: '2026-06-22', created_at: '',
  mon_breakfast: 'Bánh mì', mon_lunch: 'Cơm gà',
  tue_breakfast: 'Cháo', tue_lunch: 'Bún bò',
  wed_breakfast: null, wed_lunch: 'Cơm sườn',
  thu_breakfast: 'Xôi', thu_lunch: 'Mì xào',
  fri_breakfast: 'Bánh cuốn', fri_lunch: 'Cơm tấm',
  sat_breakfast: null, sat_lunch: null,
}

describe('formatMenuText', () => {
  it('format đúng cấu trúc Zalo', () => {
    const text = formatMenuText(menu)
    expect(text).toContain('THỰC ĐƠN TUẦN')
    expect(text).toContain('22/06')
    expect(text).toContain('T2')
    expect(text).toContain('Bánh mì')
    expect(text).toContain('Cơm gà')
  })

  it('bỏ qua ngày không có thực đơn', () => {
    const text = formatMenuText(menu)
    expect(text).not.toContain('T7:')
  })
})
