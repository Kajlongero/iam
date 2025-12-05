INSERT INTO
  access_control.roles (name, description, is_default, application_id)
VALUES
  (
    'SYSTEM SENTINEL',
    'System Sentinel role which does not do anything, but stays over all roles due to a hierarchy position and will be used as a reference to block some actions',
    FALSE,
    NULL
  );

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
    'TRUSTED SYSTEM',
    'Trusted System in our ecosystem where we can allow certain actions such as use generic login, register, etc...',
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
    'PREMIUM SYSTEM',
    'Premium System role where that application can do more security related things',
    TRUE,
    NULL,
    (
      SELECT
        id
      FROM
        access_control.roles
      WHERE
        name = 'TRUSTED SYSTEM'
        AND application_id IS NULL
    )
  ),
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
        name = 'TRUSTED SYSTEM'
        AND application_id IS NULL
    )
  );