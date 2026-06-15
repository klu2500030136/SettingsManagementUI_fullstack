-- ==============================================================================
-- DATABASE INDEXES: Settings and Configuration Management UI
-- PURPOSE: Optimize query performance and enforce unique constraints.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- UNIQUE INDEXES (Enforcing BCNF Candidate Keys structurally)
-- ------------------------------------------------------------------------------

-- Ensure rapid login lookups and guarantee email uniqueness
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Ensure rapid role lookups by natural name
CREATE UNIQUE INDEX idx_roles_name ON roles(role_name);

-- Ensure rapid configuration category lookups by natural name
CREATE UNIQUE INDEX idx_configuration_groups_name ON configuration_groups(group_name);

-- Ensure application can quickly fetch any setting by its natural key
CREATE UNIQUE INDEX idx_settings_key ON settings(setting_key);

-- ------------------------------------------------------------------------------
-- FOREIGN KEY INDEXES (Optimizing JOIN performance)
-- ------------------------------------------------------------------------------

-- Optimize JOINs between users and roles
CREATE INDEX idx_users_role_id ON users(role_id);

-- Optimize JOINs between settings and their configuration groups
CREATE INDEX idx_settings_group_id ON settings(group_id);

-- Optimize JOINs to identify who last modified a setting
CREATE INDEX idx_settings_last_modified_by ON settings(last_modified_by);

-- Optimize audit log retrieval by the setting modified
CREATE INDEX idx_audit_logs_setting_id ON audit_logs(setting_id);

-- Optimize audit log retrieval by the user who performed the action
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- ------------------------------------------------------------------------------
-- TIME-BASED INDEXES (Optimizing chronological queries)
-- ------------------------------------------------------------------------------

-- Optimize filtering audit logs by date ranges (highly common in compliance checks)
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
