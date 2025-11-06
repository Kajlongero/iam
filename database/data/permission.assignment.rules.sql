INSERT INTO 
  access_control.permission_assignment_rules 
  (system_id, minimum_owner_role_id, permission_id)
VALUES
  (
    (
      SELECT id 
      FROM management.systems 
      WHERE client_id = 'IAM_CORE_UI'
    ),
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'ADMINISTRATOR' AND system_id = (
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
    )
  ),
  (
    (
      SELECT id 
      FROM management.systems 
      WHERE client_id = 'IAM_CORE_UI'
    ),
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'SUPERADMIN' AND system_id = (
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
    )
  ),
  (
    (
      SELECT id 
      FROM management.systems 
      WHERE client_id = 'IAM_CORE_UI'
    ),
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
    )
  ),
  (
    (
      SELECT id 
      FROM management.systems 
      WHERE client_id = 'IAM_CORE_UI'
    ),
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
    )
  ),
  (
    (
      SELECT id 
      FROM management.systems 
      WHERE client_id = 'IAM_CORE_UI'
    ),
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'ADMINISTRATOR' AND system_id = (
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
    )
  ),
  (
    (
      SELECT id 
      FROM management.systems 
      WHERE client_id = 'IAM_CORE_UI'
    ),
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
    )
  ),
  (
    (
      SELECT id 
      FROM management.systems 
      WHERE client_id = 'IAM_CORE_UI'
    ),
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
    )
  ),
  (
    (
      SELECT id 
      FROM management.systems 
      WHERE client_id = 'IAM_CORE_UI'
    ),
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
    )
  ),
  (
    (
      SELECT id 
      FROM management.systems 
      WHERE client_id = 'IAM_CORE_UI'
    ),
    (
      SELECT id 
      FROM access_control.roles 
      WHERE name = 'SUPERADMIN' AND system_id = (
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
    )
  ),
  (
    (
      SELECT id 
      FROM management.systems 
      WHERE client_id = 'IAM_CORE_UI'
    ),
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
    )
  );