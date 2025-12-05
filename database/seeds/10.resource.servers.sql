INSERT INTO
  management.resource_servers (
    name,
    slug,
    client_id,
    client_secret,
    application_id,
    is_active,
    is_gateway
  )
VALUES
  (
    'iam-system-api',
    'iam-system-api_f5981a16c78b035d',
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
    TRUE,
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
    TRUE,
    TRUE
  );