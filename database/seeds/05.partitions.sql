CREATE TABLE
  access_control.application_user_roles_iam_core_ui_2 PARTITION OF access_control.application_user_roles FOR
VALUES
  IN (2);

CREATE TABLE
  security.sessions_iam_core_ui_2 PARTITION OF security.sessions FOR
VALUES
  IN (2);

CREATE TABLE
  access_control.role_authority_restrictions_iam_core_ui_2 PARTITION OF access_control.role_authority_restrictions FOR
VALUES
  IN (2);

CREATE TABLE
  security.authorization_codes_iam_core_ui_2 PARTITION OF security.authorization_codes FOR
VALUES
  IN (2);

CREATE TABLE
  security.authorization_code_scopes_iam_core_ui_2 PARTITION OF security.authorization_code_scopes FOR
VALUES
  IN (2);