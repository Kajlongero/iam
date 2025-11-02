CREATE TABLE IF NOT EXISTS management.systems (
  id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL, 
  client_id VARCHAR (96) NOT NULL UNIQUE,
  client_secret VARCHAR (255) NOT NULL,
  redirect_url VARCHAR (255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_systems_url ON management.systems (url);
CREATE INDEX idx_systems_client_id ON management.systems (client_id);

CREATE TABLE IF NOT EXISTS management.status (
  id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(24) UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_status_name ON management.status (name);

CREATE TABLE IF NOT EXISTS management.providers (
  id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE, 
  description TEXT,
  strategy_type VARCHAR(24) NOT NULL, 
  client_id VARCHAR(255), 
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS access_control.objects (
  id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT,
  name VARCHAR (64) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  system_id UUID NOT NULL REFERENCES management.systems (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (name, system_id)
);

CREATE INDEX idx_objects_name ON access_control.objects (name);
CREATE INDEX idx_objects_system_id ON access_control.objects (system_id);

CREATE TABLE IF NOT EXISTS access_control.methods (
  id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR (64) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  object_id UUID NOT NULL REFERENCES access_control.objects (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (name, object_id)
);

CREATE INDEX idx_access_control_methods_name ON access_control.methods (name);

CREATE TABLE IF NOT EXISTS security.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR (64) UNIQUE,
  is_local_password BOOLEAN NOT NULL DEFAULT FALSE,
  is_email_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS security.system_users (
  user_id UUID NOT NULL REFERENCES security.users (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  system_id UUID NOT NULL REFERENCES management.systems (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  status_id UUID NOT NULL REFERENCES management.status (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, system_id)
);

CREATE TABLE IF NOT EXISTS security.password_resets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES security.users (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  ip_address VARCHAR(45),
  token_hash VARCHAR NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_resets_user_id ON security.password_resets (user_id);

CREATE TABLE IF NOT EXISTS security.auth (
  id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR (255) NOT NULL UNIQUE,
  password VARCHAR (255),
  last_login_at TIMESTAMPTZ,
  locked_end_time TIMESTAMPTZ, 
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  last_password_change_at TIMESTAMPTZ,
  user_id UUID NOT NULL REFERENCES security.users (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  provider_id UUID REFERENCES management.providers (id) ON UPDATE CASCADE ON DELETE RESTRICT,  
  provider_unique_id VARCHAR(128),

  UNIQUE (provider_id, provider_unique_id)
);

CREATE INDEX idx_auth_email ON security.auth (email);
CREATE INDEX idx_auth_user_id ON security.auth (user_id);

CREATE TABLE IF NOT EXISTS security.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID NOT NULL REFERENCES security.auth (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  system_id UUID REFERENCES management.systems (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  expires_at TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  refresh_token VARCHAR (64) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_auth_id ON security.sessions(auth_id);
CREATE INDEX idx_sessions_system_id ON security.sessions(system_id);
CREATE INDEX idx_sessions_refresh_token ON security.sessions (refresh_token);
CREATE INDEX idx_sessions_auth_id_refresh_token ON security.sessions (auth_id, refresh_token);

CREATE TABLE access_control.permissions (
  id UUID PRIMARY KEY DEFAULT UUID_generate_v4(),
  name VARCHAR (128) NOT NULL,
  description TEXT,
  is_global BOOLEAN NOT NULL DEFAULT FALSE,
  is_editable BOOLEAN NOT NULL DEFAULT TRUE,
  system_id UUID REFERENCES management.systems (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (system_id, name)
);

CREATE TABLE access_control.method_permissions (
  method_id UUID NOT NULL REFERENCES access_control.methods (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  permission_id UUID NOT NULL REFERENCES access_control.permissions (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (method_id, permission_id)
);

CREATE TABLE IF NOT EXISTS access_control.roles (
  id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(48) NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  system_id UUID REFERENCES management.systems (id) ON UPDATE CASCADE ON DELETE RESTRICT,  
  parent_role_id UUID REFERENCES access_control.roles (id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,

  UNIQUE (system_id, name)
);

CREATE INDEX idx_access_control_roles_system_id ON access_control.roles (system_id);
CREATE UNIQUE INDEX uix_system_default_role ON access_control.roles (system_id) WHERE is_default = TRUE;

CREATE TABLE IF NOT EXISTS access_control.permission_assignment_rules (
  system_id UUID NOT NULL REFERENCES management.systems (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  permission_id UUID NOT NULL REFERENCES access_control.permissions (id) ON UPDATE CASCADE ON DELETE CASCADE,
  minimum_owner_role_id UUID NOT NULL REFERENCES access_control.roles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
  PRIMARY KEY (permission_id, system_id)
);

CREATE TABLE IF NOT EXISTS access_control.role_permissions (
  role_id UUID NOT NULL REFERENCES access_control.roles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  permission_id UUID NOT NULL REFERENCES access_control.permissions (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX idx_access_control_role_permission_role_id ON access_control.role_permissions (role_id);
CREATE INDEX idx_access_control_role_permission_permission_id ON access_control.role_permissions (permission_id);

CREATE TABLE IF NOT EXISTS access_control.platform_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL UNIQUE,
  description TEXT,
  parent_platform_role_id UUID REFERENCES access_control.platform_roles (id) ON UPDATE CASCADE ON DELETE SET NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_platform_roles_name ON access_control.platform_roles (name);

CREATE TABLE IF NOT EXISTS management.client_platform_roles (
  system_id UUID NOT NULL REFERENCES management.systems (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  platform_role_id UUID NOT NULL REFERENCES access_control.platform_roles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (system_id, platform_role_id)
);

CREATE TABLE access_control.platform_role_permissions (
  permission_id UUID NOT NULL REFERENCES access_control.permissions (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  platform_role_id UUID NOT NULL REFERENCES access_control.platform_roles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (permission_id, platform_role_id)
);

CREATE TABLE access_control.system_user_roles (
  user_id UUID NOT NULL REFERENCES security.users (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  system_id UUID NOT NULL REFERENCES management.systems (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  role_id UUID NOT NULL REFERENCES access_control.roles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  created_at timestamptz DEFAULT NOW(),

  PRIMARY KEY (user_id, system_id, role_id)
);

