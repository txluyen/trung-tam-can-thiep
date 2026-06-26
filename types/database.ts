export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      center_settings: { Row: CenterSettings; Insert: CenterSettings; Update: Partial<CenterSettings> }
      students: { Row: Student; Insert: StudentInsert; Update: Partial<StudentInsert> }
      teachers: { Row: Teacher; Insert: TeacherInsert; Update: Partial<TeacherInsert> }
      schedules: { Row: Schedule; Insert: ScheduleInsert; Update: Partial<ScheduleInsert> }
      attendance: { Row: Attendance; Insert: AttendanceInsert; Update: Partial<AttendanceInsert> }
      goals: { Row: Goal; Insert: GoalInsert; Update: Partial<GoalInsert> }
      progress_reports: { Row: ProgressReport; Insert: ProgressReportInsert; Update: Partial<ProgressReportInsert> }
      fees: { Row: Fee; Insert: FeeInsert; Update: Partial<FeeInsert> }
      salaries: { Row: Salary; Insert: SalaryInsert; Update: Partial<SalaryInsert> }
      menus: { Row: Menu; Insert: MenuInsert; Update: Partial<MenuInsert> }
      user_roles: { Row: UserRole; Insert: UserRole; Update: Partial<UserRole> }
    }
  }
}

export interface CenterSettings {
  id: string
  banTru_default_monthly_fee: number
  canThiep_default_fee_per_session: number
}

export interface Student {
  id: string
  full_name: string
  date_of_birth: string | null
  enrollment_type: 'banTru' | 'canThiep' | 'both'
  parent_name: string | null
  parent_phone: string | null
  parent_user_id: string | null
  banTru_monthly_fee: number | null
  canThiep_fee_per_session: number | null
  notes: string | null
  active: boolean
  created_at: string
}
export type StudentInsert = Omit<Student, 'id' | 'created_at'>

export interface Teacher {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  user_id: string | null
  base_salary: number
  canThiep_bonus_per_session: number
  active: boolean
  created_at: string
}
export type TeacherInsert = Omit<Teacher, 'id' | 'created_at'>

export interface Schedule {
  id: string
  date: string
  student_id: string
  teacher_id: string
  session_type: 'banTru' | 'canThiep'
  start_time: string | null
  end_time: string | null
  status: 'scheduled' | 'done' | 'cancelled'
  created_at: string
}
export type ScheduleInsert = Omit<Schedule, 'id' | 'created_at'>

export interface Attendance {
  id: string
  schedule_id: string
  student_present: boolean
  teacher_present: boolean
  recorded_by: string | null
  recorded_at: string
}
export type AttendanceInsert = Omit<Attendance, 'id' | 'recorded_at'>

export interface Goal {
  id: string
  student_id: string
  title: string
  description: string | null
  archived: boolean
  created_at: string
}
export type GoalInsert = Omit<Goal, 'id' | 'created_at'>

export interface GoalResult { goal_id: string; achieved: boolean }

export interface ProgressReport {
  id: string
  student_id: string
  teacher_id: string
  date: string
  goal_results: GoalResult[]
  notes: string | null
  created_at: string
}
export type ProgressReportInsert = Omit<ProgressReport, 'id' | 'created_at'>

export interface Fee {
  id: string
  student_id: string
  month: string
  banTru_amount: number
  canThiep_sessions: number
  canThiep_fee_per_session: number
  canThiep_amount: number
  total_amount: number
  paid: boolean
  paid_at: string | null
  created_at: string
}
export type FeeInsert = Omit<Fee, 'id' | 'created_at' | 'canThiep_amount' | 'total_amount'>

export interface Salary {
  id: string
  teacher_id: string
  month: string
  base_salary: number
  canThiep_sessions: number
  canThiep_bonus_per_session: number
  canThiep_bonus: number
  total_salary: number
  confirmed: boolean
  created_at: string
}
export type SalaryInsert = Omit<Salary, 'id' | 'created_at' | 'canThiep_bonus' | 'total_salary'>

export interface Menu {
  id: string
  week_start: string
  mon_breakfast: string | null; mon_lunch: string | null
  tue_breakfast: string | null; tue_lunch: string | null
  wed_breakfast: string | null; wed_lunch: string | null
  thu_breakfast: string | null; thu_lunch: string | null
  fri_breakfast: string | null; fri_lunch: string | null
  sat_breakfast: string | null; sat_lunch: string | null
  created_at: string
}
export type MenuInsert = Omit<Menu, 'id' | 'created_at'>

export interface UserRole {
  user_id: string
  role: 'admin' | 'teacher' | 'parent'
  teacher_id: string | null
  student_id: string | null
}
