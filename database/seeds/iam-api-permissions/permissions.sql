------------------------------------------------------------
-- Permissions for Permissions
------------------------------------------------------------
-- iam-api:permissions:read
-- iam-api:permissions:create
-- iam-api:permissions:update
-- iam-api:permissions:delete
-- iam-api:permissions:manage_assignment
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
        'iam-api:permissions:read',
        'Allows to read the permissions of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:permissions:create',
        'Allows to create permissions on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:permissions:update',
        'Allows to update the permissions of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:permissions:delete',
        'Allows to delete permissions from the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:permissions:manage_assignment',
        'Allows to manage the assignment of permissions on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    );