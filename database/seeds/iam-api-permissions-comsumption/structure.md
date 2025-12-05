# IAM API Permissions Consumption for UI

In this file we will define how our system will be connected on our GUI and giving them the permissions defined on `database/seeds/iam-api-permissions/*`. All the permissions given by the IAM must be consumed by our GUI due to their Super System control nature.

## How it will works

To fill this folder for our GUI, we must follow the next steps:

1. The consumer

The consumer of these permissions must be the slug called `iam-ui-backend_c2bcab70391b1eb3`

2. The exposer

The exposer of these permissions is the IAM Core Primary RS and their slug is `iam-system-api_f5981a16c78b035d`

3. The permission

The permission id is all the permissions defined in our `database/seeds/iam-api-permissions/*` files. Those permissions have their name something like `iam-api:resource:action`. The resource is the action such as i.e `auth`, `applications`, etc. The action would likely to be `read`, `create`, etc...

These permissions names must be added inside the `IN (...)`

4. Application id

The application id, is the application which is consuming the permission, in this case is our application where the `iam-ui-backend_c2bcab70391b1eb3` is from.

> NT: If there is not any file you must create them. If there is a file, but something is missing, it should be added.

### Example of the code

We need to create functions following this structure for the consumers

```sql
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
        client_resource_server_id,   -- Consumer (GUI)
        application_id,              -- Consumer Application_id
        permission_id,               -- Permission to consume
        is_active                    -- Status of the consumption
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
      -- List of permissions of the files within the seeds i.e /database/seeds/iam-api-permissions/applications.sql
      -- iam:applications:read
    )
ON CONFLICT DO NOTHING;
```
