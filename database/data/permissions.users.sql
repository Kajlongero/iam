-- Assign all platform permissions (IAM CORE UI) to SUPERUSER role
INSERT INTO
  access_control.role_permissions (role_id, permission_id, is_active)
SELECT
  (
    SELECT 
      id 
    FROM 
      access_control.roles 
    WHERE 
      name = 'SUPERUSER' 
    AND 
      system_id = (
        SELECT 
          id 
        FROM 
          management.systems 
        WHERE 
          client_id = 'IAM_CORE_UI'
      )
  ),
  p.id,
  TRUE
FROM
  access_control.permissions p
WHERE
  (p.name ILIKE 'platform:%' OR p.name ILIKE 'tenant:%')
  AND p.system_id = (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE_UI');

