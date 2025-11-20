# IAM Core Project Roadmap

## Databases

See `database` folder to have access to **sql** related

- [x] DDL Schemas (security, access_control, management).
- [x] Partitions: Configure PARTITION BY LIST on critic tables
- **Seeds**:
  - [x] Principal Applications script SQL
  - [x] Principal Users script SQL
  - [] Principal Roles script SQL
  - [] Principal Permissions script SQL
  - [x] Principal Objects and Methods script SQL
  - [] Principal Resource Servers script SQL
  - [] Principal Resource Servers Permissions script SQL
  - [x] Principal Global Roles script SQL
  - [x] Principal Status values script SQL
  - [] Connect Permissions to Roles script SQL
- [] Implement `resource_server_types` table
- [] Implement Authentication methods tables such as MFA, Login codes, etc...
- [] Implement Audit Logs tables for critical permissions
- [] Implement Audit logs to link other dbs table such as MongoDB
- [] Implement Support to login with other platforms table such as Discord, Google, etc...
- [] Implement Notifications table

## Crypto

- [x] Implement JWKS encryption to delegate jwks key to applications or resource servers to use it and not always calling IAM
- [x] Implement Argon2 Hashing algorithm service to handle passwords and sensible data
- [] Implement rotative RSA Keys
- [] Implement a mechanism to rotate RSA Keys for JWKS

## Security

- [x] Develop a guard to verify if an object or method is active to let the request continue
- [x] Develop a guard to verify the client id and client secret password to generate m2m tokens
