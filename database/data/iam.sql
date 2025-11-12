INSERT INTO
  management.applications (
    url,
    name,
    client_id,
    client_secret,
    redirect_url,
    status_id
  )
VALUES
  (
    'http://localhost:3000',
    'IAM_CORE',
    '', -- This must be added executing the query on any sql tool or terminal, and retrieve them from .env
    '$2b$10$bRLFlNuKaoOm2omKrjo2Aee9NLTb06TeIBq/8NNhIvShKxrPwa1rC',
    'http://localhost:3000',
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
    '', -- This must be added executing the query on any sql tool or terminal, and retrieve them from .env
    '$2b$10$wfeTH7W2aWOwtJtBUVxvZetBSr7fRl9haxAAD.xbKIDLuniS0gAzm',
    'http://localhost:5173',
    (
      SELECT
        id
      FROM
        management.status
      WHERE
        name = 'ACTIVE'
    )
  );