# IAM Core Project Roadmap

## Databases

See `database` folder to have access to **sql** related

- [x] DDL Schemas (security, access_control, management).
- [x] **Partitions**: Configure PARTITION BY LIST on critic tables
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

## Cache

- **Preload Data**:
  - [x] Applications
  - [x] Roles
  - [x] Permissions
  - [x] Objects and Methods
  - [] Resource Servers

## Crypto

- [x] Implement JWKS encryption to delegate jwks key to applications or resource servers to use it and not always calling IAM
- [x] Implement Argon2 Hashing algorithm service to handle passwords and sensible data
- [] Implement rotative RSA Keys
- [] Implement a mechanism to rotate RSA Keys for JWKS

## Security

- [x] Develop a guard to verify if an object or method is active to let the request continue
- [x] Develop a guard to verify the client id and client secret password to generate m2m tokens

## S2S / M2M Authentication

- [ ] **Exchange Endpoint:** `POST /token/exchange`
  - [x] **Guard:** `ValidateCredentialsExchangeTokenGuard` (Validates `x-client-id` + `x-client-secret` vs Redis).
  - [ ] **DTO:** Receives `target_name` (Alias of the destination service).
  - [ ] **"Zero DB" Logic:**
    1.  **DNS Lookup:** Resolve `target_name` in Redis.
    2.  **ACL Check:** Verify `iam:s2s:{origin}:{target}` in Redis.
  - [ ] **Issuance:** Generate RS256 JWT with `aud: target_client_id` and `type: m2m`.

## User Authentication (Humans)

- [ ] **Login Endpoint:** `POST /auth/login`
  - [ ] **Guard 1 (Brute Force):** `BruteForceGuard` (Redis: 5 fails = 1 hour block).
  - [ ] **Guard 2 (S2S Context):** `JwtAuthGuard('s2s-jwt')` (Only authorized UIs/Backends can request login).
  - [ ] **Service:**
    - [ ] Validate credentials (Argon2 Slow).
    - [ ] Validate Membership (`application_users`) using the S2S token's `clientId`.
  - [ ] **Issuance:** Access Token (RS256) + Refresh Token (HS256).

- [ ] **Refresh Endpoint:** `POST /token/refresh`
  - [ ] **Guard:** `JwtRefreshGuard` (Validates signature and expiration).
  - [ ] **Logic:** Token Rotation (Burn after use).
