------------------------------------------------------------
-- Permissions for oidc
------------------------------------------------------------
-- email
-- openid
-- profile
-- address
-- phone
-- offline_access
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
        'email',
        'Allows to access the user''s email address.',
        FALSE,
        FALSE,
        TRUE,
        NULL
    ),
    (
        'openid',
        'OIDC scope for authentication.',
        FALSE,
        FALSE,
        TRUE,
        NULL
    ),
    (
        'profile',
        'Allows access to the user''s profile information.',
        FALSE,
        FALSE,
        TRUE,
        NULL
    ),
    (
        'address',
        'Allows to access the user''s address.',
        FALSE,
        FALSE,
        TRUE,
        NULL
    ),
    (
        'phone',
        'Allows to access the user''s phone number.',
        FALSE,
        FALSE,
        TRUE,
        NULL
    ),
    (
        'offline_access',
        'Allows to obtain a refresh token for offline access.',
        FALSE,
        FALSE,
        TRUE,
        NULL
    );