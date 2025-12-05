------------------------------------------------------------
-- Permissions for Auth
------------------------------------------------------------
-- iam-api:auth:ban_user
-- iam-api:auth:login_local
-- iam-api:auth:signup_local
-- iam-api:auth:reset_credentials
-- iam-api:auth:generate_mfa_secret
INSERT INTO
    access_control.permissions (
        name,
        description,
        is_editable,
        is_delegable,
        is_api_scope,
        application_id
    )
VALUES
    (
        'iam-api:auth:ban_user',
        'Allows to ban a user of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:auth:login_local',
        'Allows a user to log in locally to the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:auth:signup_local',
        'Allows a user to sign up locally on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:auth:reset_credentials',
        'Allows to reset a user''s credentials on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:auth:generate_mfa_secret',
        'Allows to generate the MFA secret for a user on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    );