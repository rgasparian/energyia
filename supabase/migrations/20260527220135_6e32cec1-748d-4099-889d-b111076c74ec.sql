-- Ensure authenticated users can create, read, and update their own usuarios profile
-- without granting access to other users' private rows.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'usuarios'
      AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
    ON public.usuarios
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'usuarios'
      AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
    ON public.usuarios
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'usuarios'
      AND policyname = 'Users can update own profile'
  ) THEN
    DROP POLICY "Users can update own profile" ON public.usuarios;
  END IF;
END $$;

CREATE POLICY "Users can update own profile"
ON public.usuarios
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);