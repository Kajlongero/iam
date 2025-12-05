--
-- Note: Change the client_ids with a secure Client ID of 96 characters randomly generated
--
INSERT INTO
  management.applications (
    url,
    name,
    slug,
    client_id,
    client_secret,
    redirect_url,
    creator_user_id,
    status_id
  )
VALUES
  (
    'http://localhost:3000',
    'IAM_CORE',
    'IAM_CORE_0cab234cddfa7162',
    'IAM_CORE_PLACEHOLDER', -- Fill the client id with the client id from .env
    '$argon2id$v=19$m=256,t=1,p=1$rhbP9+lC8bDgBWA18qYq2g$9jgAYiKIWHcya9LeiHqPB2i0TV6iVVa9fCZn9+t7gNk',
    'http://localhost:3000',
    '019a79f0-791f-7406-a222-997173f8e9d4',
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
    'IAM_CORE_UI_039b32d58e3b6a76',
    'IAM_CORE_UI_PLACEHOLDER',
    '$argon2id$v=19$m=256,t=1,p=1$CmfWdMaMesKpDlqIqxAd5A$vbvf2IpsudJZZNiHN9Eg3Lzl76MbxQZjqlWuqB8i2nc',
    'http://localhost:5173',
    '019a79f0-791f-7406-a222-997173f8e9d4',
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
    'http://localhost:4000',
    'FOOD_APP',
    'FOOD_APP_6e135a977bc3cdba',
    'FOOD_APP_PLACEHOLDER',
    '$argon2id$v=19$m=256,t=1,p=1$kaIFSC67tdNpWW9nEQ2WUw$MzV0pH+P8Zmofrpetb50H0fSFk/erNNOBf6SkHqmuAI', -- Hash
    'http://localhost:4000/callback',
    '019a79f0-791f-7406-a222-997173f8e9d4',
    (
      SELECT
        id
      FROM
        management.status
      WHERE
        name = 'ACTIVE'
    )
  );

CREATE TABLE
  security.application_users_iam_core_ui_2 PARTITION OF security.application_users FOR
VALUES
  IN (2);

INSERT INTO
  security.application_users (user_id, application_id, status_id, username)
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
        management.status
      WHERE
        name = 'ACTIVE'
    ),
    'dev.kajlongero'
  );