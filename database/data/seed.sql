-- SUPERUSER 
-- Note: Always execute the following 2 commands
TRUNCATE TABLE security.users RESTART IDENTITY CASCADE;

TRUNCATE TABLE management.applications RESTART IDENTITY CASCADE;

INSERT INTO
  security.users (id, is_local_password, is_email_confirmed)
VALUES
  (
    '019a79f0-791f-7406-a222-997173f8e9d4',
    TRUE,
    TRUE
  );

INSERT INTO
  security.auth (email, password, user_id)
VALUES
  (
    'dev.kajlongero@gmail.com',
    '$2b$10$Mw3mQc96Qd6vxWUfx6GSAe6t5wCqy2MRtgk89dXQDZ79zW4IzyeCm',
    '019a79f0-791f-7406-a222-997173f8e9d4'
  );

INSERT INTO
  management.applications (
    url,
    name,
    client_id,
    client_secret,
    redirect_url,
    creator_user_id,
    status_id
  )
VALUES
  (
    'http://localhost:3000',
    'IAM_CORE',
    '', -- Fill the client id with the client id from .env
    '$2b$10$bRLFlNuKaoOm2omKrjo2Aee9NLTb06TeIBq/8NNhIvShKxrPwa1rC',
    'http://localhost:3000',
    '019a79f0-791f-7406-a222-997173f8e9d4',
    (
      SELECT
        id
      FROM
        management.status
      WHERE
        name = 'ACTIVE'
    )
  ),
  (
    'http://localhost:5173',
    'IAM_CORE_UI',
    '', -- Fill the client id with the client id from .env
    '$2b$10$wfeTH7W2aWOwtJtBUVxvZetBSr7fRl9haxAAD.xbKIDLuniS0gAzm',
    'http://localhost:5173',
    '019a79f0-791f-7406-a222-997173f8e9d4',
    (
      SELECT
        id
      FROM
        management.status
      WHERE
        name = 'ACTIVE'
    )
  );

CREATE TABLE
  security.application_users_iam_core_ui_2 PARTITION OF security.application_users FOR
VALUES
  IN (2);

INSERT INTO
  security.application_users (user_id, application_id, status_id, username)
VALUES
  (
    '019a79f0-791f-7406-a222-997173f8e9d4',
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = '' -- Fill the client id with the client id from .env
    ),
    (
      SELECT
        id
      FROM
        management.status
      WHERE
        name = 'ACTIVE'
    ),
    'dev.kajlongero'
  );

CREATE TABLE
  management.resource_servers_ui_2 PARTITION OF management.resource_servers FOR
VALUES
  IN (2);

CREATE TABLE
  access_control.objects_ui_2 PARTITION OF access_control.objects FOR
VALUES
  IN (2);

CREATE TABLE
  security.application_users_ui_2 PARTITION OF security.application_users FOR
VALUES
  IN (2);

CREATE TABLE
  security.sessions_ui_2 PARTITION OF security.sessions FOR
VALUES
  IN (2);

CREATE TABLE
  access_control.permissions_ui_2 PARTITION OF access_control.permissions FOR
VALUES
  IN (2);

CREATE TABLE
  access_control.roles_ui_2 PARTITION OF access_control.roles FOR
VALUES
  IN (2);

CREATE TABLE
  access_control.pa_rules_ui_2 PARTITION OF access_control.permission_assignment_rules FOR
VALUES
  IN (2);

CREATE TABLE
  access_control.rs_max_scopes_ui_2 PARTITION OF access_control.rs_max_allowed_scopes FOR
VALUES
  IN (2);

CREATE TABLE
  access_control.rs_exposed_perms_ui_2 PARTITION OF access_control.rs_exposed_permissions FOR
VALUES
  IN (2);

CREATE TABLE
  access_control.rs_consumption_perms_ui_2 PARTITION OF access_control.rs_consumption_permissions FOR
VALUES
  IN (2);