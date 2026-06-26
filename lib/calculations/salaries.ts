import type { Teacher } from '@/types/database'

export interface SalaryCalculation {
  base_salary: number
  canThiep_sessions: number
  canThiep_bonus_per_session: number
  canThiep_bonus: number
  total_salary: number
}

export function calculateTeacherSalary(
  teacher: Teacher,
  canThiepSessionsTaught: number
): SalaryCalculation {
  const canThiep_bonus = canThiepSessionsTaught * teacher.canThiep_bonus_per_session
  return {
    base_salary: teacher.base_salary,
    canThiep_sessions: canThiepSessionsTaught,
    canThiep_bonus_per_session: teacher.canThiep_bonus_per_session,
    canThiep_bonus,
    total_salary: teacher.base_salary + canThiep_bonus,
  }
}
