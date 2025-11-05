INSERT INTO access_control.permissions (name, description, is_global, is_editable, system_id)
VALUES
  (
    'platform:read_roles', 
    'Read IAM Core roles permission', 
    FALSE, 
    FALSE, 
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI')
  ),
  (
    'platform:create_roles', 
    'Create IAM Core roles permission', 
    FALSE, 
    FALSE, 
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI')
  ),
    (
    'platform:update_roles', 
    'Edit IAM Core roles permission', 
    FALSE, 
    FALSE, 
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI')
  ),
  (
    'platform:delete_roles', 
    'Delete IAM Core roles permission', 
    FALSE, 
    FALSE, 
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI')
  ),
  (
    'platform:read_permissions', 
    'Read IAM Core permissions', 
    FALSE, 
    FALSE, 
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI')
  ),
  (
    'platform:create_permissions', 
    'Create IAM Core permissions', 
    FALSE, 
    TRUE, 
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI')
  ),
  (
    'platform:update_permissions', 
    'Edit IAM Core permissions', 
    FALSE, 
    TRUE, 
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI')
  ),
  (
    'platform:delete_permissions', 
    'Delete IAM Core permissions', 
    FALSE, 
    TRUE, 
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI')
  ),
  (
    'platform:assign_permissions', 
    'Assign IAM Core permissions to roles', 
    FALSE, 
    TRUE, 
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI')
  ),
  (
    'platform:revoke_permissions', 
    'Revoke IAM Core permissions from roles', 
    FALSE,
    TRUE,
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI')
  );
  -- (
  --   '',
  --   '',
  --   FALSE,
  --   TRUE,
  --   (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI')
  -- ),