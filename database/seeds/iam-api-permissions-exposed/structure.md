# IAM API Permissions Exposed

This folder will have the permission exposure from the IAM Core

## How it will works

This folder must have the same files from `/database/seeds/iam-api-permissions/*`, but the contents will change. The files inside this folder will have the same name and the content will be:

We need to add queries following this form:

```sql
-- {file_name}.sql
WITH context AS (
    SELECT
        rs.id as rs_id,
        app.id as app_id
    FROM management.resource_servers rs, management.applications app
    WHERE rs.name = 'iam-system-api'
      AND app.slug = 'IAM_CORE_0cab234cddfa7162'
)
INSERT INTO access_control.resource_server_exposed_permissions
(receptor_resource_server_id, permission_id, application_id, is_active)
SELECT
    ctx.rs_id,
    p.id,
    ctx.app_id,
    TRUE
FROM access_control.permissions p, context ctx
WHERE p.name IN (
    -- Add here the permission names from the original file in /database/seeds/iam-api-permissions/{file_name}.sql
)
ON CONFLICT DO NOTHING;
```

Because these are permissions exposed within the IAM Core, the `receptor_resource_server_id` MUST BE get following this query:

```sql
  SELECT id FROM management.resource_servers WHERE name = 'iam-system-api';
```

The `permission_id` must be calculated following this query:

```sql
SELECT id FROM access_control.permissions WHERE name IN ('...', '...');
```

The `application_id` MUST BE get following this query:

```sql
SELECT id FROM management.applications WHERE slug = 'IAM_CORE_0cab234cddfa7162';
```

And last the `is_active` MUST BE TRUE, and why? because these are permissions exposed by default as a services on the IAM Core. The `ON CONFLICT DO NOTHING` is a good practice for seeds.

> NT: If there is not files within this folder `/database/seeds/iam-api-permissions-exposed/*`, the files must be created and the rules descripted in this file must be used.
