package com.settings.management.service;

import com.settings.management.dto.request.UpdateUserRoleRequest;
import com.settings.management.dto.response.AdminStatsResponse;
import com.settings.management.dto.response.AdminUserResponse;
import com.settings.management.entity.Role;
import com.settings.management.entity.User;
import com.settings.management.exception.InvalidOperationException;
import com.settings.management.exception.ResourceNotFoundException;
import com.settings.management.repository.AuditLogRepository;
import com.settings.management.repository.RoleRepository;
import com.settings.management.repository.SettingRepository;
import com.settings.management.repository.UserPreferenceRepository;
import com.settings.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private static final String ADMIN_ROLE = "ADMIN";
    private static final String USER_ROLE = "USER";
    private static final String ACTIVE_STATUS = "Active";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserPreferenceRepository userPreferenceRepository;

    @Autowired
    private SettingRepository settingRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAllWithRole().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long adminCount = userRepository.countByRole_RoleName(ADMIN_ROLE);
        long userCount = userRepository.countByRole_RoleName(USER_ROLE);

        return new AdminStatsResponse(totalUsers, adminCount, userCount, totalUsers);
    }

    @Transactional
    public AdminUserResponse updateUserRole(Integer userId, UpdateUserRoleRequest request) {
        User user = findUser(userId);
        String currentRole = user.getRole().getRoleName();
        String requestedRole = request.getRoleName();

        if (ADMIN_ROLE.equals(currentRole) && USER_ROLE.equals(requestedRole) && isLastAdmin(userId)) {
            throw new InvalidOperationException("Cannot remove the last remaining admin account");
        }

        Role role = roleRepository.findByRoleName(requestedRole)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + requestedRole));

        user.setRole(role);
        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Integer userId, String currentUserEmail) {
        User user = findUser(userId);

        if (user.getEmail().equalsIgnoreCase(currentUserEmail)) {
            throw new InvalidOperationException("Cannot delete the currently logged-in admin account");
        }

        if (ADMIN_ROLE.equals(user.getRole().getRoleName()) && isLastAdmin(userId)) {
            throw new InvalidOperationException("Cannot delete the last remaining admin account");
        }

        if (auditLogRepository.existsByUser_UserId(userId)) {
            throw new InvalidOperationException("Cannot delete a user with audit log history");
        }

        settingRepository.clearLastModifiedByForUser(userId);
        if (userPreferenceRepository.existsById(userId)) {
            userPreferenceRepository.deleteById(userId);
        }
        userRepository.delete(user);
    }

    private User findUser(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private boolean isLastAdmin(Integer userId) {
        User user = findUser(userId);
        return ADMIN_ROLE.equals(user.getRole().getRoleName())
                && userRepository.countByRole_RoleName(ADMIN_ROLE) <= 1;
    }

    private AdminUserResponse mapToResponse(User user) {
        return new AdminUserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getRoleName(),
                ACTIVE_STATUS
        );
    }
}
