------------------------------------------------------------
-- Permissions for Permissions
------------------------------------------------------------
-- iam-api:policies:role_authority_manage
-- iam-api:policies:role_assignment_manage
-- iam-api:policies:permission_assignment_manage
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
        'iam-api:policies:role_authority_manage',
        'Allows to manage the authority of a role on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:policies:role_assignment_manage',
        'Allows to manage the assignation of roles on the platform.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    ),
    (
        'iam-api:policies:permission_assignment_manage',
        'Allows to manage the assignment of permissions in the platform policies.',
        FALSE,
        TRUE,
        TRUE,
        NULL
    );