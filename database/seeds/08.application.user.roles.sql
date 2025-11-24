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