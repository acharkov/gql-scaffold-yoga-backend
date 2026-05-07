CREATE DATABASE {{PROJECT_NAME}};

\c {{PROJECT_NAME}};

BEGIN TRANSACTION;

-- Add your enums here:
-- CREATE TYPE example_state AS ENUM ('CREATED', 'ONGOING', 'FINISHED');

-- Add your tables here:
-- CREATE TABLE IF NOT EXISTS example (
--   id SERIAL PRIMARY KEY,
--   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

COMMIT;
