INSERT INTO
  access_control.resource_server_consumption_permissions (
    client_resource_server_id,
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
        client_id = 'IAM_UI_BACKEND_CLIENT_ID'
    ),
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
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_UI_PLACEHOLDER'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        management.resource_servers
      WHERE
        client_id = 'IAM_UI_BACKEND_CLIENT_ID'
    ),
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
    ),
    (
      SELECT
        id
      FROM
        management.applications
      WHERE
        client_id = 'IAM_CORE_UI_PLACEHOLDER'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        management.resource_servers
      WHERE
        client_id = 'FOOD_APP_ORDER_SERVICE_CLIENT_ID'
    ),
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
        client_id = 'FOOD_APP_ORDER_SERVICE_CLIENT_ID'
    ),
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
  );