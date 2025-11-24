INSERT INTO
  security.users (id, is_local_password, is_email_confirmed)
VALUES
  (
    '019a79f0-791f-7406-a222-997173f8e9d4',
    TRUE,
    TRUE
  );

INSERT INTO
  security.auth (email, password, user_id)
VALUES
  (
    'dev.kajlongero@gmail.com',
    '$argon2id$v=19$m=32768,t=3,p=1$TCFTpZJCEUQ251tbQyGmUQ$TQunjpO8Hys81OitFkLveFjk2R9w025swlf/PdgqFSw',
    '019a79f0-791f-7406-a222-997173f8e9d4'
  );