import type { Student, CenterSettings } from '@/types/database'

export interface FeeCalculation {
  banTru_amount: number
  canThiep_sessions: number
  canThiep_fee_per_session: number
  canThiep_amount: number
  total_amount: number
}

export function calculateStudentFee(
  student: Student,
  settings: CenterSettings,
  canThiepSessionsAttended: number
): FeeCalculation {
  const banTruFee = student.banTru_monthly_fee ?? settings.banTru_default_monthly_fee
  const canThiepFee = student.canThiep_fee_per_session ?? settings.canThiep_default_fee_per_session

  const banTru_amount = student.enrollment_type === 'canThiep' ? 0 : banTruFee
  const canThiep_sessions = student.enrollment_type === 'banTru' ? 0 : canThiepSessionsAttended
  const canThiep_amount = canThiep_sessions * canThiepFee

  return {
    banTru_amount,
    canThiep_sessions,
    canThiep_fee_per_session: canThiepFee,
    canThiep_amount,
    total_amount: banTru_amount + canThiep_amount,
  }
}
