------------------------------------------------------------
-- Permissions for Users
------------------------------------------------------------
-- iam-api:users:read
-- iam-api:users:create
-- iam-api:users:update
-- iam-api:users:delete
-- iam-api:users:manage_security
-- iam-api:users:toggle_active_status
------------------------------------------------------------
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
        'iam-api:users:read',
        'Allows to read the users of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:users:create',
        'Allows to create users on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:users:update',
        'Allows to update the users of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:users:delete',
        'Allows to delete users from the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:users:manage_security',
        'Allows to manage the security of the users of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:users:toggle_active_status',
        'Allows to toggle the active status of the users of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    );