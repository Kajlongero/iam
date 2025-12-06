WITH
    context AS (
        SELECT
            rs.id as rs_id,
            app.id as app_id
        FROM
            management.resource_servers rs,
            management.applications app
        WHERE
            rs.name = 'iam-system-api'
            AND app.slug = 'IAM_CORE_0cab234cddfa7162'
    )
INSERT INTO
    access_control.resource_server_exposed_permissions (
        receptor_resource_server_id,
        permission_id,
        application_id,
        is_active
    )
SELECT
    ctx.rs_id,
    p.id,
    ctx.app_id,
    TRUE
FROM
    access_control.permissions p,
    context ctx
WHERE
    p.name IN (
        'iam-api:resource_servers:read',
        'iam-api:resource_servers:create',
        'iam-api:resource_servers:update',
        'iam-api:resource_servers:delete',
        'iam-api:resource_servers:deactivate',
        'iam-api:resource_servers:rotate_secret',
        'iam-api:resource_servers:expose_permissions',
        'iam-api:resource_servers:consume_permissions'
    ) ON CONFLICT
DO NOTHING;