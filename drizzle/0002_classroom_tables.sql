DO $$
BEGIN
  CREATE TYPE public.class_status AS ENUM ('active', 'inactive', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS public.classes (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject_id integer NOT NULL
    REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_id text NOT NULL
    REFERENCES public."user"(id) ON DELETE RESTRICT,
  invite_code varchar(50) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  banner_cld_pub_id text,
  banner_url text,
  capacity integer DEFAULT 50 NOT NULL,
  description text,
  status public.class_status DEFAULT 'active' NOT NULL,
  schedules jsonb NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS classes_subject_id_idx
  ON public.classes (subject_id);
CREATE INDEX IF NOT EXISTS classes_teacher_id_idx
  ON public.classes (teacher_id);

CREATE TABLE IF NOT EXISTS public.enrollments (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id text NOT NULL
    REFERENCES public."user"(id) ON DELETE CASCADE,
  class_id integer NOT NULL
    REFERENCES public.classes(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS enrollments_student_id_idx
  ON public.enrollments (student_id);
CREATE INDEX IF NOT EXISTS enrollments_class_id_idx
  ON public.enrollments (class_id);
CREATE UNIQUE INDEX IF NOT EXISTS enrollments_student_class_unique
  ON public.enrollments (student_id, class_id);
