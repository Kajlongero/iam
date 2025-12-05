# IAM Api Permissions Strcuture

To add IAM Api Permissions we need to follow the next instructions:

- IAM Api Permissions MUST BE GLOBAL
- IAM Api Permissions MUST NOT HAVE `application_id` (`NULL`)
- IAM Api Permissions THERE MUST BE TIMES THAT THOSE PERMISSIONS SHOULD BE DELEGATED BUT NOT THE OIDC ONES
- IAM Api Permissions MUST BE `is_api_scope` TRUE
- IAM Api Permissions MUST FOLLOW THE NEXT COMMAND TO BE ADDED:
  - `INSERT INTO access_control.permissions (name, description, is_editable, is_delegable, is_api_scope, application_id) VALUES ([permission name on the comment of the file], [description], FALSE, TRUE [but not the provided on the oidc.sql file in this folder], TRUE, NULL), ...;`

> NT: IAM Api Permissions must be declared within the files on this folder. i.e users.sql in this folder must have the INSERT INTO query, the permissions were provided on the comments of the file that will be added on the INSERT INTO clausule.

> NT2: If the files does not have any INSERT INTO clausule, it should be added following the permission on comments
