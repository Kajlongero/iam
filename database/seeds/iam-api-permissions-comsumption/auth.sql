WITH
    consumer_context AS (
        SELECT
            rs.id as rs_consumer_id,
            rs.application_id as rs_consumer_app_id
        FROM
            management.resource_servers rs
        WHERE
            rs.slug = 'iam-ui-backend_c2bcab70391b1eb3'
    ),
    exposer_context AS (
        SELECT
            rs.id as rs_exposer_id
        FROM
            management.resource_servers rs
        WHERE
            rs.slug = 'iam-system-api_f5981a16c78b035d'
    )
INSERT INTO
    access_control.resource_server_consumption_permissions (
        receptor_resource_server_id, -- Exposer (IAM Core)
        client_resource_server_id, -- Consumer (GUI)
        application_id, -- Consumer Application_id
        permission_id, -- Permission to consume
        is_active -- Status of the consumption
    )
SELECT
    exposer_ctx.rs_exposer_id,
    consumer_ctx.rs_consumer_id,
    consumer_ctx.rs_consumer_app_id,
    p.id,
    TRUE
FROM
    access_control.permissions p,
    exposer_context exposer_ctx,
    consumer_context consumer_ctx
WHERE
    p.name IN (
        'iam-api:auth:ban_user',
        'iam-api:auth:login_local',
        'iam-api:auth:signup_local',
        'iam-api:auth:reset_credentials',
        'iam-api:auth:generate_mfa_secret'
    ) ON CONFLICT
DO NOTHING;