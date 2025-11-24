INSERT INTO
  access_control.resource_server_exposed_permissions (
    receptor_resource_server_id,
    permission_id,
    application_id
  )
VALUES
  -- Exponer openid
  (
    (
      SELECT
        id
      FROM
        management.resource_servers
      WHERE
        client_id = 'IAM_SYSTEM_API_CLIENT_ID'
    ),
    (
      SELECT
        id
      FROM
        access_control.permissions
      WHERE
        name = 'openid'
        AND application_id IS NULL
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_PLACEHOLDER'
    )
  ),
  -- Exponer profile
  (
    (
      SELECT
        id
      FROM
        management.resource_servers
      WHERE
        client_id = 'IAM_SYSTEM_API_CLIENT_ID'
    ),
    (
      SELECT
        id
      FROM
        access_control.permissions
      WHERE
        name = 'profile'
        AND application_id IS NULL
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_PLACEHOLDER'
    )
  ),
  -- Exponer email
  (
    (
      SELECT
        id
      FROM
        management.resource_servers
      WHERE
        client_id = 'IAM_SYSTEM_API_CLIENT_ID'
    ),
    (
      SELECT
        id
      FROM
        access_control.permissions
      WHERE
        name = 'email'
        AND application_id IS NULL
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_PLACEHOLDER'
    )
  ),
  -- Exponer iam:users:read
  (
    (
      SELECT
        id
      FROM
        management.resource_servers
      WHERE
        client_id = 'IAM_SYSTEM_API_CLIENT_ID'
    ),
    (
      SELECT
        id
      FROM
        access_control.permissions
      WHERE
        name = 'iam:users:read'
        AND application_id IS NULL
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_PLACEHOLDER'
    )
  ),
  -- Exponer iam:users:create
  (
    (
      SELECT
        id
      FROM
        management.resource_servers
      WHERE
        client_id = 'IAM_SYSTEM_API_CLIENT_ID'
    ),
    (
      SELECT
        id
      FROM
        access_control.permissions
      WHERE
        name = 'iam:users:create'
        AND application_id IS NULL
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_PLACEHOLDER'
    )
  ),
  -- Exponer iam:users:edit
  (
    (
      SELECT
        id
      FROM
        management.resource_servers
      WHERE
        client_id = 'IAM_SYSTEM_API_CLIENT_ID'
    ),
    (
      SELECT
        id
      FROM
        access_control.permissions
      WHERE
        name = 'iam:users:edit'
        AND application_id IS NULL
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_PLACEHOLDER'
    )
  );

INSERT INTO
  access_control.resource_server_exposed_permissions (
    receptor_resource_server_id,
    permission_id,
    application_id
  )
VALUES
  (
    (
      SELECT
        id
      FROM
        management.resource_servers
      WHERE
        client_id = 'FOOD_APP_BILLING_SERVICE_CLIENT_ID'
    ),
    (
      SELECT
        id
      FROM
        access_control.permissions
      WHERE
        name = 'client:billing:read'
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'FOOD_APP_PLACEHOLDER'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        management.resource_servers
      WHERE
        client_id = 'FOOD_APP_BILLING_SERVICE_CLIENT_ID'
    ),
    (
      SELECT
        id
      FROM
        access_control.permissions
      WHERE
        name = 'client:billing:pay'
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'FOOD_APP_PLACEHOLDER'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        management.resource_servers
      WHERE
        client_id = 'FOOD_APP_BILLING_SERVICE_CLIENT_ID'
    ),
    (
      SELECT
        id
      FROM
        access_control.permissions
      WHERE
        name = 'client:billing:refund'
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'FOOD_APP_PLACEHOLDER'
    )
  );