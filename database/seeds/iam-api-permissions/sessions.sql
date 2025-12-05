------------------------------------------------------------
-- Permissions for Sessions
------------------------------------------------------------
-- iam-api:sessions:read	
-- iam-api:sessions:read_data	
-- iam-api:sessions:revoke
-- iam-api:sessions:revoke_all
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
        'iam-api:sessions:read',
        'Allows to read the sessions of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:sessions:read_data',
        'Allows to read the data of the sessions of the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:sessions:revoke',
        'Allows to revoke a session on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:sessions:revoke_all',
        'Allows to revoke all sessions on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    );