import { describe, it, expect } from 'vitest'
import { calculateTeacherSalary } from '@/lib/calculations/salaries'
import type { Teacher } from '@/types/database'

const baseTeacher = (overrides: Partial<Teacher> = {}): Teacher => ({
  id: '1', full_name: 'GV Test', email: null, phone: null, user_id: null,
  base_salary: 10000000, canThiep_bonus_per_session: 100000,
  active: true, created_at: '',
  ...overrides,
})

describe('calculateTeacherSalary', () => {
  it('0 ca can thiệp: chỉ lương cứng', () => {
    const result = calculateTeacherSalary(baseTeacher(), 0)
    expect(result.total_salary).toBe(10000000)
    expect(result.canThiep_bonus).toBe(0)
  })

  it('có ca can thiệp: cộng phụ cấp', () => {
    const result = calculateTeacherSalary(baseTeacher(), 15)
    expect(result.canThiep_sessions).toBe(15)
    expect(result.canThiep_bonus).toBe(1500000)
    expect(result.total_salary).toBe(11500000)
  })

  it('dùng đúng bonus_per_session của giáo viên', () => {
    const result = calculateTeacherSalary(baseTeacher({ canThiep_bonus_per_session: 150000 }), 10)
    expect(result.total_salary).toBe(10000000 + 1500000)
  })
})
