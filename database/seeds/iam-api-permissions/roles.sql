------------------------------------------------------------
-- Permissions for Roles
------------------------------------------------------------
-- iam-api:roles:read
-- iam-api:roles:create
-- iam-api:roles:update
-- iam-api:roles:delete
-- iam-api:roles:manage_membership
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
        'iam-api:roles:read',
        'Allows to read the roles of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:roles:create',
        'Allows to create roles on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:roles:update',
        'Allows to update the roles of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:roles:delete',
        'Allows to delete roles from the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:roles:manage_membership',
        'Allows to manage the membership of the roles of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    );