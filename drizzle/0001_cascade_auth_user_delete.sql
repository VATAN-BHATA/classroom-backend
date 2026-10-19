DO $migration$
DECLARE
  foreign_key RECORD;
  updated_definition TEXT;
BEGIN
  FOR foreign_key IN
    SELECT
      constraint_row.conrelid::regclass AS table_name,
      constraint_row.conname,
      pg_get_constraintdef(constraint_row.oid) AS definition
    FROM pg_constraint AS constraint_row
    WHERE constraint_row.contype = 'f'
      AND constraint_row.confrelid = to_regclass('"user"')
      AND constraint_row.conrelid IN (
        to_regclass('"account"'),
        to_regclass('"session"')
      )
  LOOP
    updated_definition := regexp_replace(
      foreign_key.definition,
      '\s+ON DELETE\s+(NO ACTION|RESTRICT|SET NULL|SET DEFAULT|CASCADE)',
      ' ON DELETE CASCADE',
      'i'
    );

    IF updated_definition = foreign_key.definition THEN
      IF updated_definition ~* '\s+ON UPDATE\s+' THEN
        updated_definition := regexp_replace(
          updated_definition,
          '\s+ON UPDATE\s+',
          ' ON DELETE CASCADE ON UPDATE ',
          'i'
        );
      ELSE
        updated_definition := updated_definition || ' ON DELETE CASCADE';
      END IF;
    END IF;

    EXECUTE format(
      'ALTER TABLE %s DROP CONSTRAINT %I',
      foreign_key.table_name,
      foreign_key.conname
    );
    EXECUTE format(
      'ALTER TABLE %s ADD CONSTRAINT %I %s',
      foreign_key.table_name,
      foreign_key.conname,
      updated_definition
    );
  END LOOP;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint AS constraint_row
    JOIN pg_attribute AS user_id_column
      ON user_id_column.attrelid = constraint_row.conrelid
     AND user_id_column.attname = 'user_id'
     AND NOT user_id_column.attisdropped
    WHERE constraint_row.contype = 'f'
      AND constraint_row.conrelid = to_regclass('"account"')
      AND constraint_row.confrelid = to_regclass('"user"')
      AND constraint_row.conkey = ARRAY[user_id_column.attnum]::smallint[]
  ) THEN
    ALTER TABLE "account"
      ADD CONSTRAINT "account_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint AS constraint_row
    JOIN pg_attribute AS user_id_column
      ON user_id_column.attrelid = constraint_row.conrelid
     AND user_id_column.attname = 'user_id'
     AND NOT user_id_column.attisdropped
    WHERE constraint_row.contype = 'f'
      AND constraint_row.conrelid = to_regclass('"session"')
      AND constraint_row.confrelid = to_regclass('"user"')
      AND constraint_row.conkey = ARRAY[user_id_column.attnum]::smallint[]
  ) THEN
    ALTER TABLE "session"
      ADD CONSTRAINT "session_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
  END IF;
END;
$migration$;
