DROP SCHEMA IF EXISTS utils CASCADE;

DROP SCHEMA IF EXISTS security CASCADE;

DROP SCHEMA IF EXISTS management CASCADE;

DROP SCHEMA IF EXISTS access_control CASCADE;

CREATE SCHEMA utils;

CREATE SCHEMA security;

CREATE SCHEMA management;

CREATE SCHEMA access_control;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Execute `database/data/status.sql`
-- Execute `database/data/seed.sql`
-- Execute `database/data/object.methods.sql`