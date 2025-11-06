-- Assign all platform permissions (IAM CORE UI) to SUPERUSER role
INSERT INTO
  access_control.role_permissions (role_id, permission_id, is_active)
VALUES
  (
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'SUPERUSER' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    (
      SELECT id 
      FROM access_control.permissions 
      WHERE name = 'platform:read_roles' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    TRUE
  ),
  (
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'SUPERUSER' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    (
      SELECT id 
      FROM access_control.permissions 
      WHERE name = 'platform:create_roles' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
        )
    ),
    TRUE
  ),
  (
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'SUPERUSER' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    (
      SELECT id 
      FROM access_control.permissions 
      WHERE name = 'platform:update_roles' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    TRUE
  ),
  (
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'SUPERUSER' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    (
      SELECT id 
      FROM access_control.permissions 
      WHERE name = 'platform:delete_roles' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    TRUE
  ),
  (
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'SUPERUSER' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    (
      SELECT id 
      FROM access_control.permissions 
      WHERE name = 'platform:read_permissions' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    TRUE
  ),
  (
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'SUPERUSER' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    (
      SELECT id 
      FROM access_control.permissions 
      WHERE name = 'platform:create_permissions' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    TRUE
  ),
  (
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'SUPERUSER' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    (
      SELECT id 
      FROM access_control.permissions 
      WHERE name = 'platform:update_permissions' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    TRUE
  ),
  (
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'SUPERUSER' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    (
      SELECT id 
      FROM access_control.permissions 
      WHERE name = 'platform:delete_permissions' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    TRUE
  ),
  (
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'SUPERUSER' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    (
      SELECT id 
      FROM access_control.permissions 
      WHERE name = 'platform:assign_permissions' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    TRUE
  ),
  (
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'SUPERUSER' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    (
      SELECT id 
      FROM access_control.permissions 
      WHERE name = 'platform:revoke_permissions' AND system_id = (
        SELECT id 
        FROM management.systems 
        WHERE client_id = 'IAM_CORE_UI'
      )
    ),
    TRUE
  )

