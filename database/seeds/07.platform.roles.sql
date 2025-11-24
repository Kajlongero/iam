INSERT INTO
  access_control.roles (name, description, is_default, application_id)
VALUES
  (
    'CORE',
    'Core Role for systems that can do everything within the IAM',
    FALSE,
    NULL
  );

INSERT INTO
  access_control.roles (
    name,
    description,
    is_default,
    application_id,
    parent_role_id
  )
VALUES
  (
    'SUPER SYSTEM',
    'Super System Role that can do everything within the IAM but a fewer permissions',
    FALSE,
    NULL,
    (
      SELECT
        id
      FROM
        access_control.roles
      WHERE
        name = 'CORE'
        AND application_id IS NULL
    )
  );

INSERT INTO
  access_control.roles (
    name,
    description,
    is_default,
    application_id,
    parent_role_id
  )
VALUES
  (
    'BASIC SYSTEM',
    'Basic System role that has limited actions within the IAM',
    TRUE,
    NULL,
    (
      SELECT
        id
      FROM
        access_control.roles
      WHERE
        name = 'SUPER SYSTEM'
        AND application_id IS NULL
    )
  );