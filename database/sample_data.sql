-- ==============================================================================
-- SAMPLE DATA: Settings and Configuration Management UI
-- ==============================================================================

-- 1. Insert Roles
INSERT INTO roles (role_name, description) VALUES
('ADMIN', 'Full system access and configuration control'),
('USER', 'Standard access for personal preferences and limited viewing');

-- 2. Insert Users (Passwords are placeholder bcrypt hashes)
INSERT INTO users (username, email, password_hash, role_id) VALUES
('Admin Alice', 'admin.alice@example.com', '$2y$10$placeholderAdminHashExample123', 1),
('User Bob', 'bob@example.com', '$2y$10$placeholderUserHashExample123', 2),
('User Charlie', 'charlie@example.com', '$2y$10$placeholderUserHashExample456', 2);

-- 3. Insert User Preferences
INSERT INTO user_preferences (user_id, ui_theme, notifications_enabled, language_preference, time_zone_preference, dashboard_layout_preference) VALUES
(1, 'dark', true, 'English', 'IST', 'Standard'),
(2, 'light', false, 'Hindi', 'UTC', 'Compact'),
(3, 'system', true, 'Telugu', 'PST', 'Detailed');

-- 4. Insert Configuration Groups
INSERT INTO configuration_groups (group_name, description) VALUES
('Security', 'Security rules, password policies, and session limits'),
('Notifications', 'Global email and SMS notification settings'),
('UI Preferences', 'Global branding and frontend defaults'),
('System Limits', 'API rate limits and upload restrictions');

-- 5. Insert Settings
INSERT INTO settings (group_id, setting_key, setting_value, setting_type, last_modified_by) VALUES
-- Security Settings
(1, 'MAX_LOGIN_ATTEMPTS', '5', 'NUMBER', 1),
(1, 'SESSION_TIMEOUT_MINUTES', '30', 'NUMBER', 1),
(1, 'REQUIRE_MFA', 'true', 'BOOLEAN', 1),

-- Notifications Settings
(2, 'EMAIL_NOTIFICATIONS_ENABLED', 'true', 'BOOLEAN', 1),
(2, 'SYSTEM_ADMIN_EMAIL', 'admin@example.com', 'STRING', 1),

-- UI Settings
(3, 'DEFAULT_DARK_MODE', 'false', 'BOOLEAN', 1),
(3, 'BRAND_PRIMARY_COLOR', '#3b82f6', 'STRING', 1),

-- System Limits
(4, 'MAX_UPLOAD_SIZE_MB', '50', 'NUMBER', 1),
(4, 'API_RATE_LIMIT_PER_MIN', '1000', 'NUMBER', 1);

-- 6. Insert Audit Logs (Simulating historical changes)
INSERT INTO audit_logs (setting_id, user_id, action_type, old_value, new_value, created_at) VALUES
(1, 1, 'CREATE', NULL, '3', NOW() - INTERVAL '10 days'),
(1, 1, 'UPDATE', '3', '5', NOW() - INTERVAL '2 days'),
(3, 1, 'CREATE', NULL, 'false', NOW() - INTERVAL '10 days'),
(3, 1, 'UPDATE', 'false', 'true', NOW() - INTERVAL '1 day'),
(8, 1, 'CREATE', NULL, '10', NOW() - INTERVAL '5 days'),
(8, 1, 'UPDATE', '10', '50', NOW() - INTERVAL '1 day');
