DO $$
BEGIN
  CREATE TYPE public.role AS ENUM ('student', 'teacher', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS public."user" (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  email_verified boolean NOT NULL,
  image text,
  role public.role DEFAULT 'student' NOT NULL,
  image_cld_pub_id text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS user_email_unique ON public."user" (email);

CREATE TABLE IF NOT EXISTS public.account (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES public."user"(id),
  account_id text NOT NULL,
  provider_id text NOT NULL,
  access_token text,
  refresh_token text,
  access_token_expires_at timestamp,
  refresh_token_expires_at timestamp,
  scope text,
  id_token text,
  password text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS account_user_id_idx ON public.account (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS account_provider_account_unique
  ON public.account (provider_id, account_id);

CREATE TABLE IF NOT EXISTS public.session (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES public."user"(id),
  token text NOT NULL,
  expires_at timestamp NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS session_user_id_idx ON public.session (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS session_token_unique ON public.session (token);

CREATE TABLE IF NOT EXISTS public.verification (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  expires_at timestamp NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS verification_identifier_idx
  ON public.verification (identifier);
