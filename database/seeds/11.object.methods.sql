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
        client_id = 'IAM_CORE_PLACEHOLDER'
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
        client_id = 'IAM_CORE_PLACEHOLDER'
    )
  ),
  (
    'TokenController',
    'Controller focused on token flows between services',
    TRUE,
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_PLACEHOLDER'
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
            client_id = 'IAM_CORE_PLACEHOLDER'
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
            client_id = 'IAM_CORE_PLACEHOLDER'
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
            client_id = 'IAM_CORE_PLACEHOLDER'
        )
    )
  ),
  (
    'exchange',
    'Token Exchange OAuth2.0 flow procedure',
    TRUE,
    (
      SELECT
        id
      FROM
        access_control.objects
      WHERE
        name = 'TokenController'
        AND application_id = (
          SELECT
            id
          FROM
            management.applications
          WHERE
            client_id = 'IAM_CORE_PLACEHOLDER'
        )
    )
  ),
  (
    'refresh',
    'Refresh Token to continue the session',
    TRUE,
    (
      SELECT
        id
      FROM
        access_control.objects
      WHERE
        name = 'TokenController'
        AND application_id = (
          SELECT
            id
          FROM
            management.applications
          WHERE
            client_id = 'IAM_CORE_PLACEHOLDER'
        )
    )
  );