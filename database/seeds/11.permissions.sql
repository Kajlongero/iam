INSERT INTO
  access_control.permissions (name, description, is_api_scope, application_id)
VALUES
  ('openid', 'OIDC Core Identity', FALSE, NULL),
  ('profile', 'User Profile Info', FALSE, NULL),
  ('email', 'User Email', FALSE, NULL),
  ('iam:users:read', 'Read users list', TRUE, NULL),
  ('iam:users:create', 'Create users', TRUE, NULL),
  ('iam:users:edit', 'Edit users', TRUE, NULL);

INSERT INTO
  access_control.permissions (name, description, is_api_scope, application_id)
VALUES
  (
    'client:billing:read',
    'Read billings',
    TRUE,
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'FOOD_APP_PLACEHOLDER'
    )
  ),
  (
    'client:billing:pay',
    'Pay',
    TRUE,
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'FOOD_APP_PLACEHOLDER'
    )
  ),
  (
    'client:billing:refund',
    'Refund money',
    TRUE,
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'FOOD_APP_PLACEHOLDER'
    )
  );