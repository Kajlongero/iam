INSERT INTO
  management.resource_servers (
    name,
    slug,
    client_id,
    client_secret,
    application_id,
    is_active
  )
VALUES
  (
    'iam-system-api',
    'iam-syste-api_f5981a16c78b035d',
    'IAM_SYSTEM_API_CLIENT_ID',
    '$argon2id$v=19$m=256,t=1,p=1$MPgnCKnte28wZpQOLS4WTQ$92TLWxBmm0euOZmaoJIUDTckDrrnkc2Q3UDebbYhqaU',
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_PLACEHOLDER'
    ),
    TRUE
  ),
  (
    'iam-ui-backend',
    'iam-ui-backend_c2bcab70391b1eb3',
    'IAM_UI_BACKEND_CLIENT_ID',
    '$argon2id$v=19$m=256,t=1,p=1$bvhRFEeB2Cqz1d9vhxPYCg$WJibbch/3BStozC2xXCcpdZ2axJ9j1ICvZkxX4eYr4Y',
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_UI_PLACEHOLDER'
    ),
    TRUE
  ),
  (
    'orders-service',
    'orders-service_260dd00062ad0354',
    'FOOD_APP_ORDER_SERVICE_CLIENT_ID',
    '$argon2id$v=19$m=256,t=1,p=1$QYaK+QTJHBdu+xS6Bq6IvQ$nbOYt9n+sbUtqat7qKSHOXc2dE42Bhtq3K3EHidefUM', -- Hash
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'FOOD_APP_PLACEHOLDER'
    ),
    TRUE
  ),
  (
    'billing-service',
    'billing-service_ecae3303e9ad8938',
    'FOOD_APP_BILLING_SERVICE_CLIENT_ID',
    '$argon2id$v=19$m=256,t=1,p=1$ZPcDajZJp9Q0D2dVNjtofw$+tG6xY1cq58bCrCWPSh0WeOO3f4Hz3me36a8CQDqm1A', -- Hash
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'FOOD_APP_PLACEHOLDER'
    ),
    TRUE
  );