-- Assign all platform permissions (IAM CORE) to SUPERUSER role 
INSERT INTO 
  access_control.role_permissions (role_id, permission_id, is_active) 
SELECT 
  (SELECT id FROM access_control.roles WHERE name = 'SUPERUSER'), 
  p.id, 
  TRUE 
FROM 
  access_control.permissions p 
WHERE 
  p.name 
ILIKE 
  'platform:%';