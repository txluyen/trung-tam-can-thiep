-- Bật RLS trên tất cả tables
alter table center_settings enable row level security;
alter table user_roles enable row level security;
alter table students enable row level security;
alter table teachers enable row level security;
alter table schedules enable row level security;
alter table attendance enable row level security;
alter table goals enable row level security;
alter table progress_reports enable row level security;
alter table fees enable row level security;
alter table salaries enable row level security;
alter table menus enable row level security;

-- user_roles
create policy "user reads own role" on user_roles for select using (user_id = auth.uid());
create policy "admin manages roles" on user_roles for all using (get_user_role() = 'admin');

-- center_settings
create policy "admin manages settings" on center_settings for all using (get_user_role() = 'admin');
create policy "all read settings" on center_settings for select using (auth.uid() is not null);

-- students
create policy "admin manages students" on students for all using (get_user_role() = 'admin');
create policy "teacher reads assigned students" on students for select using (
  get_user_role() = 'teacher' and exists (
    select 1 from schedules s where s.student_id = students.id
      and s.teacher_id = get_teacher_id()
  )
);
create policy "parent reads own child" on students for select
  using (id = get_student_id());

-- teachers
create policy "admin manages teachers" on teachers for all using (get_user_role() = 'admin');
create policy "teacher reads own profile" on teachers for select using (id = get_teacher_id());

-- schedules
create policy "admin manages schedules" on schedules for all using (get_user_role() = 'admin');
create policy "teacher reads own schedules" on schedules for select
  using (teacher_id = get_teacher_id());
create policy "parent reads child schedules" on schedules for select
  using (student_id = get_student_id());

-- attendance
create policy "admin manages attendance" on attendance for all using (get_user_role() = 'admin');
create policy "teacher manages own session attendance" on attendance for all using (
  exists (select 1 from schedules s where s.id = attendance.schedule_id
    and s.teacher_id = get_teacher_id())
);

-- goals
create policy "admin manages goals" on goals for all using (get_user_role() = 'admin');
create policy "teacher reads goals of assigned students" on goals for select using (
  exists (select 1 from schedules s where s.student_id = goals.student_id
    and s.teacher_id = get_teacher_id())
);
create policy "parent reads child goals" on goals for select
  using (student_id = get_student_id());

-- progress_reports
create policy "admin manages progress" on progress_reports for all using (get_user_role() = 'admin');
create policy "teacher manages own reports" on progress_reports for all
  using (teacher_id = get_teacher_id());
create policy "parent reads child reports" on progress_reports for select
  using (student_id = get_student_id());

-- fees
create policy "admin manages fees" on fees for all using (get_user_role() = 'admin');
create policy "parent reads own child fees" on fees for select
  using (student_id = get_student_id());

-- salaries
create policy "admin manages salaries" on salaries for all using (get_user_role() = 'admin');
create policy "teacher reads own salary" on salaries for select
  using (teacher_id = get_teacher_id());

-- menus
create policy "admin manages menus" on menus for all using (get_user_role() = 'admin');
create policy "all read menus" on menus for select using (auth.uid() is not null);
