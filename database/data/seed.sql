-- SUPERUSER 
-- Note: Always execute the following 2 commands
------------------------------------------------
TRUNCATE TABLE security.users RESTART IDENTITY CASCADE;

TRUNCATE TABLE management.applications RESTART IDENTITY CASCADE;

DROP TABLE IF EXISTS security.sessions_iam_core_ui_2 CASCADE;

DROP TABLE IF EXISTS security.application_users_iam_core_ui_2 CASCADE;

DROP TABLE IF EXISTS access_control.application_user_roles_iam_core_ui_2 CASCADE;

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
    'IAM_CORE_PLACEHOLDER', -- Fill the client id with the client id from .env
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
    'IAM_CORE_UI_PLACEHOLDER', -- Fill the client id with the client id from .env
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
        client_id = 'IAM_CORE_UI_PLACEHOLDER' -- Fill the client id with the client id from .env
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
  access_control.application_user_roles_iam_core_ui_2 PARTITION OF access_control.application_user_roles FOR
VALUES
  IN (2);

CREATE TABLE
  security.sessions_iam_core_ui_2 PARTITION OF security.sessions FOR
VALUES
  IN (2);

INSERT INTO
  access_control.roles (name, description, is_default, application_id)
VALUES
  (
    'SUPERUSER',
    'Super User Admin Role that can do everything within the IAM.',
    FALSE,
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_UI_PLACEHOLDER'
    )
  );

INSERT INTO
  access_control.roles (
    name,
    description,
    is_default,
    parent_role_id,
    application_id
  )
VALUES
  (
    'SUPERADMIN',
    'Super Admin Role that can do everything but not assign or modify GLOBAL platform permissions or modify permissions that are not on their scope.',
    FALSE,
    (
      SELECT
        id
      FROM
        access_control.roles
      WHERE
        name = 'SUPERUSER'
        AND application_id = (
          SELECT
            id
          FROM
            management.applications
          WHERE
            client_id = 'IAM_CORE_UI_PLACEHOLDER'
        )
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_UI_PLACEHOLDER'
    )
  );

INSERT INTO
  access_control.roles (
    name,
    description,
    is_default,
    parent_role_id,
    application_id
  )
VALUES
  (
    'ADMINISTRATOR',
    'Administrator Role. Is a default role for every IAM new User (only on the scope of the IAM not on client systems). This role has fewer permissions than the upper ones, but can do almost the required things like change user from client systems password, view sessions, disable sessions, etc.',
    TRUE,
    (
      SELECT
        id
      FROM
        access_control.roles
      WHERE
        name = 'SUPERADMIN'
        AND application_id = (
          SELECT
            id
          FROM
            management.applications
          WHERE
            client_id = 'IAM_CORE_UI_PLACEHOLDER'
        )
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_UI_PLACEHOLDER'
    )
  ),
  (
    'AUDITOR',
    'Auditor role. This role can view Logs from the system, check logs like System Errors, Attempts to login from any system and report them if neccesary, give IAM Core related information.',
    FALSE,
    (
      SELECT
        id
      FROM
        access_control.roles
      WHERE
        name = 'SUPERADMIN'
        AND application_id = (
          SELECT
            id
          FROM
            management.applications
          WHERE
            client_id = 'IAM_CORE_UI_PLACEHOLDER'
        )
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_UI_PLACEHOLDER'
    )
  ),
  (
    'TESTER',
    'Tester Role. This role will handle all validations like tests some routes before allowing them to all users etc.',
    FALSE,
    (
      SELECT
        id
      FROM
        access_control.roles
      WHERE
        name = 'SUPERADMIN'
        AND application_id = (
          SELECT
            id
          FROM
            management.applications
          WHERE
            client_id = 'IAM_CORE_UI_PLACEHOLDER'
        )
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_UI_PLACEHOLDER'
    )
  );

INSERT INTO
  access_control.roles (name, description, is_default, application_id)
VALUES
  (
    'CORE',
    'Core Role for systems that can do everything within the IAM',
    FALSE,
    NULL
  ),
  (
    'SUPERSYSTEM',
    'Super System Role that can do everything within the IAM but a fewer permissions',
    FALSE,
    NULL
  );

INSERT INTO
  access_control.application_user_roles (user_id, application_id, role_id)
VALUES
  (
    '019a79f0-791f-7406-a222-997173f8e9d4',
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_UI_PLACEHOLDER'
    ),
    (
      SELECT
        id
      FROM
        access_control.roles
      WHERE
        name = 'SUPERUSER'
        AND application_id = (
          SELECT
            id
          FROM
            management.applications
          WHERE
            client_id = 'IAM_CORE_UI_PLACEHOLDER'
        )
    )
  );

INSERT INTO
  access_control.application_role_assignments (role_id, application_id)
VALUES
  (
    (
      SELECT
        id
      FROM
        access_control.roles
      WHERE
        name = 'CORE'
        AND application_id IS NULL
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_PLACEHOLDER'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        access_control.roles
      WHERE
        name = 'SUPERSYSTEM'
        AND application_id IS NULL
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_UI_PLACEHOLDER'
    )
  );