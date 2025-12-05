------------------------------------------------------------
-- Permissions for Resource Servers
------------------------------------------------------------
-- iam-api:resource_servers:read
-- iam-api:resource_servers:create
-- iam-api:resource_servers:update
-- iam-api:resource_servers:delete
-- iam-api:resource_servers:deactivate
-- iam-api:resource_servers:rotate_secret
-- iam-api:resource_servers:expose_permissions
-- iam-api:resource_servers:consume_permissions
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
        'iam-api:resource_servers:read',
        'Allows to read the resource servers of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:resource_servers:create',
        'Allows to create resource servers on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:resource_servers:update',
        'Allows to update the resource servers of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:resource_servers:delete',
        'Allows to delete resource servers from the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:resource_servers:deactivate',
        'Allows to deactivate resource servers of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:resource_servers:rotate_secret',
        'Allows to rotate the secrets of the resource servers of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:resource_servers:expose_permissions',
        'Allows to expose the permissions of a resource server on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:resource_servers:consume_permissions',
        'Allows to consume the permissions of a resource server on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    );