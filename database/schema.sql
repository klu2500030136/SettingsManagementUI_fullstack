-- ==============================================================================
-- DATABASE SCHEMA: Settings and Configuration Management UI
-- STATUS: BCNF Compliant
-- ENGINE: PostgreSQL
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ROLES TABLE
-- Centralizes Role-Based Access Control (RBAC) definitions.
-- ------------------------------------------------------------------------------
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. USERS TABLE
-- Core identity and authentication table.
-- ------------------------------------------------------------------------------
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) 
        REFERENCES roles (role_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ------------------------------------------------------------------------------
-- 3. USER PREFERENCES TABLE
-- Isolates UI configurations from core identity logic (1:1 relationship).
-- ------------------------------------------------------------------------------
CREATE TABLE user_preferences (
    user_id INT PRIMARY KEY,
    ui_theme VARCHAR(50) DEFAULT 'light' CHECK (ui_theme IN ('light', 'dark', 'system')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    language_preference VARCHAR(50) DEFAULT 'English' CHECK (language_preference IN ('English', 'Hindi', 'Telugu')),
    time_zone_preference VARCHAR(50) DEFAULT 'IST' CHECK (time_zone_preference IN ('IST', 'UTC', 'PST')),
    dashboard_layout_preference VARCHAR(50) DEFAULT 'Standard' CHECK (dashboard_layout_preference IN ('Compact', 'Standard', 'Detailed')),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) 
        REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ------------------------------------------------------------------------------
-- 4. CONFIGURATION GROUPS TABLE
-- Logical categories for grouping system settings.
-- ------------------------------------------------------------------------------
CREATE TABLE configuration_groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. SETTINGS TABLE
-- Core system configurations and values.
-- ------------------------------------------------------------------------------
CREATE TABLE settings (
    setting_id SERIAL PRIMARY KEY,
    group_id INT NOT NULL,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(50) NOT NULL CHECK (setting_type IN ('STRING', 'BOOLEAN', 'NUMBER', 'JSON')),
    last_modified_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_settings_group FOREIGN KEY (group_id) 
        REFERENCES configuration_groups (group_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_settings_user FOREIGN KEY (last_modified_by) 
        REFERENCES users (user_id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ------------------------------------------------------------------------------
-- 6. AUDIT LOGS TABLE
-- Tracks all configuration modifications for compliance.
-- ------------------------------------------------------------------------------
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    setting_id INT NOT NULL,
    user_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('CREATE', 'UPDATE', 'DELETE')),
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_settings FOREIGN KEY (setting_id) 
        REFERENCES settings (setting_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_audit_users FOREIGN KEY (user_id) 
        REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);
