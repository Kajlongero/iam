INSERT INTO 
  access_control.roles (name, description, is_default, system_id) 
VALUES
  (
    'SUPERUSER', 
    'Super User Admin Role that can do everything within the IAM.', 
    FALSE,
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE')
  );

INSERT INTO 
  access_control.roles (name, description, is_default, parent_role_id, system_id)
VALUES
  (
    'SUPERADMIN',
    'Super Admin Role that can do everything but not assign or modify GLOBAL platform permissions or modify permissions that are not on their scope.',
    FALSE,
    (SELECT id FROM access_control.roles WHERE name = 'SUPERUSER'),
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE')
  );

INSERT INTO 
  access_control.roles (name, description, is_default, parent_role_id, system_id)
VALUES
  (
    'ADMINISTRATOR',
    'Administrator Role. Is a default role for every IAM new User (only on the scope of the IAM not on client systems). This role has fewer permissions than the upper ones, but can do almost the required things like change user from client systems password, view sessions, disable sessions, etc.',
    TRUE,
    (SELECT id FROM access_control.roles WHERE name = 'SUPERADMIN'),
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE')
  ),
  (
    'AUDITOR',
    'Auditor role. This role can view Logs from the system, check logs like System Errors, Attempts to login from any system and report them if neccesary, give IAM Core related information.',
    FALSE,
    (SELECT id FROM access_control.roles WHERE name = 'SUPERADMIN'),
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE')
  ),
  (
    'TESTER',
    'Tester Role. This role will handle all validations like tests some routes before allowing them to all users etc.',
    FALSE,
    (SELECT id FROM access_control.roles WHERE name = 'SUPERADMIN'),
    (SELECT id FROM management.systems WHERE client_id = 'IAM_CORE')
  );