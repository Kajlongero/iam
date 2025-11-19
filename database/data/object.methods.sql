INSERT INTO
  access_control.objects (name, description, is_active, application_id)
VALUES
  (
    'AuthController',
    'Controller that can allow actions such as login, register, etc.',
    TRUE,
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        id = 2
    )
  ),
  (
    'SecurityController',
    'Controller which has security related endpoints such as jwks or more',
    TRUE,
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        id = 2
    )
  );

INSERT INTO
  access_control.methods (name, description, is_active, object_id)
VALUES
  (
    'login',
    'Login basic method',
    TRUE,
    (
      SELECT
        id
      FROM
        access_control.objects
      WHERE
        name = 'AuthController'
        AND application_id = (
          SELECT
            id
          FROM
            management.applications
          WHERE
            id = 2
        )
    )
  ),
  (
    'register',
    'Register basic method',
    TRUE,
    (
      SELECT
        id
      FROM
        access_control.objects
      WHERE
        name = 'AuthController'
        AND application_id = (
          SELECT
            id
          FROM
            management.applications
          WHERE
            id = 2
        )
    )
  ),
  (
    'jwks',
    'JWKS Security encription and verification keys exchange route',
    TRUE,
    (
      SELECT
        id
      FROM
        access_control.objects
      WHERE
        name = 'SecurityController'
        AND application_id = (
          SELECT
            id
          FROM
            management.applications
          WHERE
            id = 2
        )
    )
  );