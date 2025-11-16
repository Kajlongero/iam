CREATE TABLE IF NOT EXISTS
  management.status (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(24) UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

CREATE INDEX idx_status_name ON management.status (name);

CREATE TABLE IF NOT EXISTS
  security.users (
    id UUID NOT NULL PRIMARY KEY,
    is_local_password BOOLEAN NOT NULL DEFAULT FALSE,
    is_email_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
  );

CREATE TABLE IF NOT EXISTS
  management.applications (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    name VARCHAR(96) NOT NULL,
    client_id VARCHAR(96) NOT NULL UNIQUE,
    client_secret VARCHAR(255) NOT NULL,
    redirect_url VARCHAR(255) NOT NULL,
    status_id SMALLINT NOT NULL REFERENCES management.status (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    creator_user_id UUID NOT NULL REFERENCES security.users (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
  );

CREATE INDEX idx_applications_url ON management.applications (url);

CREATE INDEX idx_applications_client_id ON management.applications (client_id);

CREATE TABLE IF NOT EXISTS
  management.resource_servers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(96) NOT NULL,
    client_id VARCHAR(96) NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    UNIQUE (application_id, name)
  );

CREATE TABLE IF NOT EXISTS
  management.providers (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    strategy_type VARCHAR(24) NOT NULL,
    client_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

CREATE TABLE IF NOT EXISTS
  access_control.objects (
    id SERIAL PRIMARY KEY,
    description TEXT,
    name VARCHAR(64) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (name, application_id)
  );

CREATE INDEX idx_objects_name ON access_control.objects (name);

CREATE INDEX idx_objects_application_id ON access_control.objects (application_id);

CREATE TABLE IF NOT EXISTS
  access_control.methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    object_id INTEGER NOT NULL REFERENCES access_control.objects (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (name, object_id)
  );

CREATE INDEX idx_access_control_methods_name ON access_control.methods (name);

CREATE TABLE IF NOT EXISTS
  access_control.resource_server_objects (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    object_id INTEGER NOT NULL REFERENCES access_control.objects (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    resource_server_id INTEGER NOT NULL REFERENCES management.resource_servers (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (application_id, resource_server_id, object_id)
  );

CREATE TABLE IF NOT EXISTS
  access_control.resource_server_object_methods (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    object_id INTEGER NOT NULL REFERENCES access_control.objects (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    method_id INTEGER NOT NULL REFERENCES access_control.methods (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    resource_server_id INTEGER NOT NULL REFERENCES management.resource_servers (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (
      application_id,
      resource_server_id,
      object_id,
      method_id
    )
  );

CREATE TABLE IF NOT EXISTS
  security.profiles (
    user_id UUID NOT NULL PRIMARY KEY REFERENCES security.users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128),
    phone_number VARCHAR(32),
    address TEXT,
    date_of_birth DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
  );

CREATE TABLE IF NOT EXISTS
  security.application_users (
    user_id UUID NOT NULL REFERENCES security.users (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    status_id SMALLINT NOT NULL REFERENCES management.status (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    username VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, application_id),
    UNIQUE (application_id, username)
  )
PARTITION BY
  LIST (application_id);

CREATE TABLE IF NOT EXISTS
  security.password_resets (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES security.users (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address INET,
    token_hash VARCHAR(45) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

CREATE INDEX idx_password_resets_user_id ON security.password_resets (user_id);

CREATE INDEX idx_password_resets_token_hash ON security.password_resets (token_hash);

CREATE TABLE IF NOT EXISTS
  security.auth (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    last_login_at TIMESTAMPTZ,
    locked_end_time TIMESTAMPTZ,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    last_password_change_at TIMESTAMPTZ,
    user_id UUID NOT NULL REFERENCES security.users (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    provider_id SMALLINT REFERENCES management.providers (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    provider_unique_id VARCHAR(128),
    UNIQUE (provider_id, provider_unique_id)
  );

CREATE INDEX idx_auth_user_id ON security.auth (user_id);

CREATE TABLE IF NOT EXISTS
  security.sessions (
    id BIGSERIAL,
    auth_id BIGINT NOT NULL REFERENCES security.auth (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    application_id INTEGER REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    expires_at TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    refresh_token VARCHAR(64) NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (application_id, id)
  )
PARTITION BY
  LIST (application_id);

CREATE INDEX idx_sessions_auth_id_refresh_token ON security.sessions (application_id, auth_id, refresh_token);

CREATE TABLE IF NOT EXISTS
  access_control.permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    is_global BOOLEAN NOT NULL DEFAULT FALSE,
    is_editable BOOLEAN NOT NULL DEFAULT TRUE,
    application_id INTEGER REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (application_id, name)
  );

CREATE INDEX idx_permission_application_id ON access_control.permissions (application_id);

CREATE TABLE IF NOT EXISTS
  access_control.permission_importance_levels (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL UNIQUE,
    logging_policy VARCHAR(16) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

CREATE TABLE IF NOT EXISTS
  access_control.permission_importance (
    permission_id INTEGER NOT NULL REFERENCES access_control.permissions (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    importance_level_id SMALLINT NOT NULL REFERENCES access_control.permission_importance_levels (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (permission_id, application_id)
  );

CREATE INDEX idx_permission_importance_level_id ON access_control.permission_importance (importance_level_id);

CREATE TABLE IF NOT EXISTS
  access_control.method_permissions (
    method_id INTEGER NOT NULL REFERENCES access_control.methods (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    permission_id INTEGER NOT NULL REFERENCES access_control.permissions (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (method_id, permission_id, application_id)
  );

CREATE TABLE IF NOT EXISTS
  access_control.roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(48) NOT NULL,
    description TEXT,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    parent_role_id INTEGER REFERENCES access_control.roles (id) ON UPDATE CASCADE ON DELETE SET NULL,
    application_id INTEGER REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    UNIQUE (application_id, name)
  );

CREATE UNIQUE INDEX uix_application_default_role ON access_control.roles (application_id)
WHERE
  is_default = TRUE;

CREATE TABLE IF NOT EXISTS
  access_control.application_user_roles (
    user_id UUID NOT NULL REFERENCES security.users (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    role_id INTEGER NOT NULL REFERENCES access_control.roles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at timestamptz DEFAULT NOW(),
    PRIMARY KEY (user_id, application_id, role_id)
  )
PARTITION BY
  LIST (application_id);

CREATE TABLE IF NOT EXISTS
  access_control.permission_assignment_rules (
    permission_id INTEGER NOT NULL REFERENCES access_control.permissions (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    minimum_owner_role_id INTEGER NOT NULL REFERENCES access_control.roles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (permission_id, application_id)
  );

CREATE INDEX idx_pa_minimum_owner_role_id ON access_control.permission_assignment_rules (minimum_owner_role_id);

CREATE TABLE IF NOT EXISTS
  access_control.role_permissions (
    role_id INTEGER NOT NULL REFERENCES access_control.roles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    permission_id INTEGER NOT NULL REFERENCES access_control.permissions (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_assignable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id, application_id)
  );

CREATE INDEX idx_access_control_role_permission_permission_id ON access_control.role_permissions (permission_id);

CREATE TABLE IF NOT EXISTS
  access_control.application_role_assignments (
    id SERIAL NOT NULL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES access_control.roles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    UNIQUE (application_id, role_id)
  );

CREATE TABLE IF NOT EXISTS
  access_control.resource_server_max_allowed_scopes (
    permission_id INTEGER NOT NULL REFERENCES access_control.permissions (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    resource_server_id INTEGER NOT NULL REFERENCES management.resource_servers (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (resource_server_id, permission_id, application_id)
  );

CREATE TABLE IF NOT EXISTS
  access_control.resource_server_exposed_permissions (
    receptor_resource_server_id INTEGER NOT NULL REFERENCES management.resource_servers (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    permission_id INTEGER NOT NULL REFERENCES access_control.permissions (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (
      receptor_resource_server_id,
      permission_id,
      application_id
    )
  );

CREATE TABLE IF NOT EXISTS
  access_control.resource_server_consumption_permissions (
    client_resource_server_id INTEGER NOT NULL REFERENCES management.resource_servers (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    receptor_resource_server_id INTEGER NOT NULL REFERENCES management.resource_servers (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    permission_id INTEGER NOT NULL REFERENCES access_control.permissions (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    application_id INTEGER NOT NULL REFERENCES management.applications (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (
      client_resource_server_id,
      receptor_resource_server_id,
      permission_id,
      application_id
    )
  );