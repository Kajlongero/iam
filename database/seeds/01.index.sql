DROP SCHEMA IF EXISTS utils CASCADE;

DROP SCHEMA IF EXISTS security CASCADE;

DROP SCHEMA IF EXISTS management CASCADE;

DROP SCHEMA IF EXISTS access_control CASCADE;

CREATE SCHEMA utils;

CREATE SCHEMA security;

CREATE SCHEMA management;

CREATE SCHEMA access_control;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--
-- Execute DDL
--
TRUNCATE TABLE security.users RESTART IDENTITY CASCADE;

TRUNCATE TABLE management.applications RESTART IDENTITY CASCADE;

DROP TABLE IF EXISTS security.sessions_iam_core_ui_2 CASCADE;

DROP TABLE IF EXISTS security.application_users_iam_core_ui_2 CASCADE;

DROP TABLE IF EXISTS access_control.application_user_roles_iam_core_ui_2 CASCADE;

DROP TABLE IF EXISTS access_control.role_authority_restrictions_iam_core_ui_2 CASCADE;

DROP TABLE IF EXISTS security.authorization_codes_iam_core_ui_2 CASCADE;

DROP TABLE IF EXISTS security.authorization_code_scopes_iam_core_ui_2 CASCADE;

DROP TABLE IF EXISTS security.sessions_food_app_3 CASCADE;

DROP TABLE IF EXISTS security.application_users_foodsessions_food_app_3 CASCADE;

DROP TABLE IF EXISTS access_control.application_user_roles_foodsessions_food_app_3 CASCADE;

DROP TABLE IF EXISTS access_control.role_authority_restrictions_foodsessions_food_app_3 CASCADE;

DROP TABLE IF EXISTS security.authorization_codes_foodsessions_food_app_3 CASCADE;

DROP TABLE IF EXISTS security.authorization_code_scopes_foodsessions_food_app_3 CASCADE;