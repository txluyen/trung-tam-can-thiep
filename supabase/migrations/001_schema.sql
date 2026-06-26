-- center_settings (1 bản ghi duy nhất)
create table center_settings (
  id uuid primary key default gen_random_uuid(),
  "banTru_default_monthly_fee" numeric not null default 0,
  "canThiep_default_fee_per_session" numeric not null default 0
);

-- user_roles (phải tạo trước helper functions)
create table user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'teacher', 'parent')),
  teacher_id uuid,
  student_id uuid
);

-- Helper functions (đặt SAU khi user_roles đã tồn tại)
create or replace function get_user_role()
returns text language sql security definer stable as $$
  select role from user_roles where user_id = auth.uid()
$$;

create or replace function get_teacher_id()
returns uuid language sql security definer stable as $$
  select teacher_id from user_roles where user_id = auth.uid()
$$;

create or replace function get_student_id()
returns uuid language sql security definer stable as $$
  select student_id from user_roles where user_id = auth.uid()
$$;

-- students
create table students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  date_of_birth date,
  enrollment_type text not null check (enrollment_type in ('banTru', 'canThiep', 'both')),
  parent_name text,
  parent_phone text,
  parent_user_id uuid references auth.users(id),
  "banTru_monthly_fee" numeric,
  "canThiep_fee_per_session" numeric,
  notes text,
  active boolean not null default true,
  created_at timestamptz default now()
);

-- teachers
create table teachers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  user_id uuid references auth.users(id),
  base_salary numeric not null default 0,
  "canThiep_bonus_per_session" numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

-- FK từ user_roles → students/teachers (thêm sau khi bảng đã tồn tại)
alter table user_roles
  add constraint fk_teacher foreign key (teacher_id) references teachers(id),
  add constraint fk_student foreign key (student_id) references students(id);

-- schedules
create table schedules (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  student_id uuid not null references students(id),
  teacher_id uuid not null references teachers(id),
  session_type text not null check (session_type in ('banTru', 'canThiep')),
  start_time time,
  end_time time,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'done', 'cancelled')),
  created_at timestamptz default now()
);

-- attendance (1:1 với schedule)
create table attendance (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null unique references schedules(id) on delete cascade,
  student_present boolean not null default false,
  teacher_present boolean not null default false,
  recorded_by uuid references auth.users(id),
  recorded_at timestamptz default now()
);

-- goals
create table goals (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  title text not null,
  description text,
  archived boolean not null default false,
  created_at timestamptz default now()
);

-- progress_reports
create table progress_reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  teacher_id uuid not null references teachers(id),
  date date not null,
  goal_results jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz default now(),
  unique(student_id, date, teacher_id)
);

-- fees (generated columns tự tính)
create table fees (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  month text not null,
  "banTru_amount" numeric not null default 0,
  "canThiep_sessions" integer not null default 0,
  "canThiep_fee_per_session" numeric not null default 0,
  "canThiep_amount" numeric generated always as
    ("canThiep_sessions" * "canThiep_fee_per_session") stored,
  total_amount numeric generated always as
    ("banTru_amount" + "canThiep_sessions" * "canThiep_fee_per_session") stored,
  paid boolean not null default false,
  paid_at timestamptz,
  created_at timestamptz default now(),
  unique(student_id, month)
);

-- salaries (generated columns tự tính)
create table salaries (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references teachers(id),
  month text not null,
  base_salary numeric not null default 0,
  "canThiep_sessions" integer not null default 0,
  "canThiep_bonus_per_session" numeric not null default 0,
  "canThiep_bonus" numeric generated always as
    ("canThiep_sessions" * "canThiep_bonus_per_session") stored,
  total_salary numeric generated always as
    (base_salary + "canThiep_sessions" * "canThiep_bonus_per_session") stored,
  confirmed boolean not null default false,
  created_at timestamptz default now(),
  unique(teacher_id, month)
);

-- menus
create table menus (
  id uuid primary key default gen_random_uuid(),
  week_start date not null unique,
  mon_breakfast text, mon_lunch text,
  tue_breakfast text, tue_lunch text,
  wed_breakfast text, wed_lunch text,
  thu_breakfast text, thu_lunch text,
  fri_breakfast text, fri_lunch text,
  sat_breakfast text, sat_lunch text,
  created_at timestamptz default now()
);
