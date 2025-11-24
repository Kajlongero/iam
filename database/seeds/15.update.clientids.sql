-- CHANGE CLIENT ID FROM BOTH APPLICATIONS TO THE CORRECT CLIENTID FROM .env
UPDATE management.applications
SET
  client_id = ''
WHERE
  client_id = 'IAM_CORE_PLACEHOLDER';

UPDATE management.applications
SET
  client_id = ''
WHERE
  client_id = 'IAM_CORE_UI_PLACEHOLDER';

UPDATE management.applications
SET
  client_id = ''
WHERE
  client_id = 'FOOD_APP_PLACEHOLDER';

UPDATE management.resource_servers
SET
  client_id = ''
WHERE
  client_id = 'IAM_SYSTEM_API_CLIENT_ID';

UPDATE management.resource_servers
SET
  client_id = ''
WHERE
  client_id = 'IAM_UI_BACKEND_CLIENT_ID';

UPDATE management.resource_servers
SET
  client_id = ''
WHERE
  client_id = 'FOOD_APP_ORDER_SERVICE_CLIENT_ID';

UPDATE management.resource_servers
SET
  client_id = ''
WHERE
  client_id = 'FOOD_APP_BILLING_SERVICE_CLIENT_ID';