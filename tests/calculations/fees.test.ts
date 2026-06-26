import { describe, it, expect } from 'vitest'
import { calculateStudentFee } from '@/lib/calculations/fees'
import type { Student, CenterSettings } from '@/types/database'

const settings: CenterSettings = {
  id: '1',
  banTru_default_monthly_fee: 1500000,
  canThiep_default_fee_per_session: 150000,
}

const baseStudent = (overrides: Partial<Student> = {}): Student => ({
  id: '1', full_name: 'Test', date_of_birth: null,
  parent_name: null, parent_phone: null, parent_user_id: null,
  banTru_monthly_fee: null, canThiep_fee_per_session: null,
  notes: null, active: true, created_at: '',
  enrollment_type: 'both',
  ...overrides,
})

describe('calculateStudentFee', () => {
  it('bán trú only: chỉ tính phí tháng cố định', () => {
    const result = calculateStudentFee(baseStudent({ enrollment_type: 'banTru' }), settings, 10)
    expect(result.banTru_amount).toBe(1500000)
    expect(result.canThiep_sessions).toBe(0)
    expect(result.total_amount).toBe(1500000)
  })

  it('can thiệp only: tính theo số buổi', () => {
    const result = calculateStudentFee(baseStudent({ enrollment_type: 'canThiep' }), settings, 8)
    expect(result.banTru_amount).toBe(0)
    expect(result.canThiep_sessions).toBe(8)
    expect(result.canThiep_amount).toBe(1200000)
    expect(result.total_amount).toBe(1200000)
  })

  it('cả hai: cộng bán trú + can thiệp', () => {
    const result = calculateStudentFee(baseStudent({ enrollment_type: 'both' }), settings, 5)
    expect(result.total_amount).toBe(1500000 + 5 * 150000)
  })

  it('dùng override rate của học sinh khi có', () => {
    const student = baseStudent({ enrollment_type: 'canThiep', canThiep_fee_per_session: 200000 })
    const result = calculateStudentFee(student, settings, 4)
    expect(result.canThiep_fee_per_session).toBe(200000)
    expect(result.total_amount).toBe(800000)
  })

  it('dùng override banTru của học sinh khi có', () => {
    const student = baseStudent({ enrollment_type: 'banTru', banTru_monthly_fee: 2000000 })
    const result = calculateStudentFee(student, settings, 0)
    expect(result.banTru_amount).toBe(2000000)
  })
})
