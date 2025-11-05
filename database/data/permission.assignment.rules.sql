INSERT INTO 
  access_control.permission_assignment_rules 
  (system_id, minimum_owner_role_id, permission_id)
VALUES
  (
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI'),
    (SELECT id FROM access_control.roles WHERE name = 'ADMINISTRATOR'),
    (SELECT id FROM access_control.permissions WHERE name = 'platform:read_roles')
  ),
  (
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI'),
    (SELECT id FROM access_control.roles WHERE name = 'SUPERADMIN'),
    (SELECT id FROM access_control.permissions WHERE name = 'platform:create_roles')
  ),
  (
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI'),
    (SELECT id FROM access_control.roles WHERE name = 'SUPERUSER'),
    (SELECT id FROM access_control.permissions WHERE name = 'platform:update_roles')
  ),
  (
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI'),
    (SELECT id FROM access_control.roles WHERE name = 'SUPERUSER'),
    (SELECT id FROM access_control.permissions WHERE name = 'platform:delete_roles')
  ),
  (
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI'),
    (SELECT id FROM access_control.roles WHERE name = 'ADMINISTRATOR'),
    (SELECT id FROM access_control.permissions WHERE name = 'platform:read_permissions')
  ),
  (
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI'),
    (SELECT id FROM access_control.roles WHERE name = 'SUPERUSER'),
    (SELECT id FROM access_control.permissions WHERE name = 'platform:create_permissions')
  ),
  (
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI'),
    (SELECT id FROM access_control.roles WHERE name = 'SUPERUSER'),
    (SELECT id FROM access_control.permissions WHERE name = 'platform:update_permissions')
  ),
  (
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI'),
    (SELECT id FROM access_control.roles WHERE name = 'SUPERUSER'),
    (SELECT id FROM access_control.permissions WHERE name = 'platform:delete_permissions')
  ),
  (
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI'),
    (SELECT id FROM access_control.roles WHERE name = 'SUPERADMIN'),
    (SELECT id FROM access_control.permissions WHERE name = 'platform:assign_permissions')
  ),
  (
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI'),
    (SELECT id FROM access_control.roles WHERE name = 'SUPERUSER'),
    (SELECT id FROM access_control.permissions WHERE name = 'platform:revoke_permissions')
  );