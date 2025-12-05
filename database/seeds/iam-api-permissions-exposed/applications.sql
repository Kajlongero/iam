WITH
    context AS (
        SELECT
            rs.id as rs_id,
            app.id as app_id
        FROM
            access_control.resource_servers rs,
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
        'iam-api:applications:read',
        'iam-api:applications:create',
        'iam-api:applications:update',
        'iam-api:applications:delete',
        'iam-api:applications:activate',
        'iam-api:applications:deactivate',
        'iam-api:applications:rotate_secret',
        'iam-api:applications:manage_credentials'
    ) ON CONFLICT
DO NOTHING;