------------------------------------------------------------
-- Permissions for Applications
------------------------------------------------------------
-- iam-api:applications:read
-- iam-api:applications:create
-- iam-api:applications:update
-- iam-api:applications:delete
-- iam-api:applications:activate
-- iam-api:applications:deactivate
-- iam-api:applications:rotate_secret
-- iam-api:applications:manage_credentials
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
        'iam-api:applications:read',
        'Allows to read the applications of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:applications:create',
        'Allows to create applications on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:applications:update',
        'Allows to update the applications of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:applications:delete',
        'Allows to delete applications from the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:applications:activate',
        'Allows to activate platform applications.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:applications:deactivate',
        'Allows to deactivate platform applications.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:applications:rotate_secret',
        'Allows to rotate the secrets of the platform applications.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:applications:manage_credentials',
        'Allows to manage the credentials of an application on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    );