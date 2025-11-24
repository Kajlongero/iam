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
        name = 'SUPER SYSTEM'
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
  ),
  (
    (
      SELECT
        id
      FROM
        access_control.roles
      WHERE
        name = 'BASIC SYSTEM'
        AND application_id IS NULL
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'FOOD_APP_PLACEHOLDER'
    )
  );