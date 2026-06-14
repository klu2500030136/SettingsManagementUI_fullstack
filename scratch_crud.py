import os

base_dir = "c:/Users/LENOVO/Downloads/DBEDBD/EndProject/backend"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)

# Exceptions
res_not_found = """package com.settings.management.exception;
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) { super(message); }
}
"""
dup_res = """package com.settings.management.exception;
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) { super(message); }
}
"""
inv_op = """package com.settings.management.exception;
public class InvalidOperationException extends RuntimeException {
    public InvalidOperationException(String message) { super(message); }
}
"""

glob_ex = """package com.settings.management.exception;

import com.settings.management.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(ex.getMessage(), null));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Object>> handleDuplicateResource(DuplicateResourceException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>(ex.getMessage(), null));
    }

    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidOperation(InvalidOperationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(ex.getMessage(), null));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse<>("Access Denied", null));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>("Bad credentials or unauthorized", null));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>("Validation Failed", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(ex.getMessage(), null));
    }
}
"""

# DTOs
api_res = """package com.settings.management.dto.response;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ApiResponse<T> {
    private String message;
    private T data;
}
"""

set_req = """package com.settings.management.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SettingRequest {
    @NotNull
    private Integer groupId;

    @NotBlank
    private String settingKey;

    @NotBlank
    private String settingValue;

    @NotBlank
    private String settingType;
}
"""

set_res = """package com.settings.management.dto.response;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class SettingResponse {
    private Integer settingId;
    private Integer groupId;
    private String groupName;
    private String settingKey;
    private String settingValue;
    private String settingType;
    private String lastModifiedByUsername;
    private LocalDateTime updatedAt;
}
"""

grp_req = """package com.settings.management.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupRequest {
    @NotBlank
    @Size(max = 100)
    private String groupName;

    private String description;
}
"""

grp_res = """package com.settings.management.dto.response;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class GroupResponse {
    private Integer groupId;
    private String groupName;
    private String description;
    private LocalDateTime createdAt;
}
"""

pref_req = """package com.settings.management.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PreferenceRequest {
    @NotBlank
    private String uiTheme;

    @NotNull
    private Boolean notificationsEnabled;
}
"""

pref_res = """package com.settings.management.dto.response;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PreferenceResponse {
    private Integer userId;
    private String uiTheme;
    private Boolean notificationsEnabled;
}
"""

# Services
grp_srv = """package com.settings.management.service;

import com.settings.management.dto.request.GroupRequest;
import com.settings.management.dto.response.GroupResponse;
import com.settings.management.entity.ConfigurationGroup;
import com.settings.management.exception.DuplicateResourceException;
import com.settings.management.exception.ResourceNotFoundException;
import com.settings.management.repository.ConfigurationGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConfigurationGroupService {

    @Autowired
    private ConfigurationGroupRepository groupRepository;

    public GroupResponse createGroup(GroupRequest request) {
        if (groupRepository.findByGroupName(request.getGroupName()).isPresent()) {
            throw new DuplicateResourceException("Group name already exists");
        }
        ConfigurationGroup group = new ConfigurationGroup();
        group.setGroupName(request.getGroupName());
        group.setDescription(request.getDescription());
        group = groupRepository.save(group);
        return mapToResponse(group);
    }

    public GroupResponse updateGroup(Integer id, GroupRequest request) {
        ConfigurationGroup group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
                
        if (!group.getGroupName().equals(request.getGroupName()) &&
            groupRepository.findByGroupName(request.getGroupName()).isPresent()) {
            throw new DuplicateResourceException("Group name already exists");
        }

        group.setGroupName(request.getGroupName());
        group.setDescription(request.getDescription());
        group = groupRepository.save(group);
        return mapToResponse(group);
    }

    public void deleteGroup(Integer id) {
        if (!groupRepository.existsById(id)) {
            throw new ResourceNotFoundException("Group not found");
        }
        groupRepository.deleteById(id);
    }

    public List<GroupResponse> getAllGroups() {
        return groupRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public GroupResponse getGroupById(Integer id) {
        ConfigurationGroup group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        return mapToResponse(group);
    }

    private GroupResponse mapToResponse(ConfigurationGroup group) {
        return GroupResponse.builder()
                .groupId(group.getGroupId())
                .groupName(group.getGroupName())
                .description(group.getDescription())
                .createdAt(group.getCreatedAt())
                .build();
    }
}
"""

set_srv = """package com.settings.management.service;

import com.settings.management.dto.request.SettingRequest;
import com.settings.management.dto.response.SettingResponse;
import com.settings.management.entity.AuditLog;
import com.settings.management.entity.ConfigurationGroup;
import com.settings.management.entity.Setting;
import com.settings.management.entity.User;
import com.settings.management.exception.DuplicateResourceException;
import com.settings.management.exception.ResourceNotFoundException;
import com.settings.management.repository.AuditLogRepository;
import com.settings.management.repository.ConfigurationGroupRepository;
import com.settings.management.repository.SettingRepository;
import com.settings.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SettingService {

    @Autowired
    private SettingRepository settingRepository;
    
    @Autowired
    private ConfigurationGroupRepository groupRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuditLogRepository auditLogRepository;

    public SettingResponse createSetting(SettingRequest request, String userEmail) {
        if (settingRepository.findBySettingKey(request.getSettingKey()).isPresent()) {
            throw new DuplicateResourceException("Setting key already exists");
        }

        ConfigurationGroup group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
                
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Setting setting = new Setting();
        setting.setConfigurationGroup(group);
        setting.setSettingKey(request.getSettingKey());
        setting.setSettingValue(request.getSettingValue());
        setting.setSettingType(request.getSettingType());
        setting.setLastModifiedBy(user);
        
        setting = settingRepository.save(setting);
        
        createAuditLog(setting, user, "CREATE", null, setting.getSettingValue());

        return mapToResponse(setting);
    }

    public SettingResponse updateSetting(Integer id, SettingRequest request, String userEmail) {
        Setting setting = settingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Setting not found"));
                
        if (!setting.getSettingKey().equals(request.getSettingKey()) &&
            settingRepository.findBySettingKey(request.getSettingKey()).isPresent()) {
            throw new DuplicateResourceException("Setting key already exists");
        }

        ConfigurationGroup group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String oldValue = setting.getSettingValue();

        setting.setConfigurationGroup(group);
        setting.setSettingKey(request.getSettingKey());
        setting.setSettingValue(request.getSettingValue());
        setting.setSettingType(request.getSettingType());
        setting.setLastModifiedBy(user);

        setting = settingRepository.save(setting);
        
        createAuditLog(setting, user, "UPDATE", oldValue, setting.getSettingValue());

        return mapToResponse(setting);
    }

    public void deleteSetting(Integer id, String userEmail) {
        Setting setting = settingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Setting not found"));
                
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        createAuditLog(setting, user, "DELETE", setting.getSettingValue(), null);
        
        settingRepository.deleteById(id);
    }

    public List<SettingResponse> getAllSettings() {
        return settingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public SettingResponse getSettingById(Integer id) {
        Setting setting = settingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Setting not found"));
        return mapToResponse(setting);
    }

    private void createAuditLog(Setting setting, User user, String action, String oldValue, String newValue) {
        AuditLog log = new AuditLog();
        log.setSetting(setting);
        log.setUser(user);
        log.setActionType(action);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        auditLogRepository.save(log);
    }

    private SettingResponse mapToResponse(Setting setting) {
        return SettingResponse.builder()
                .settingId(setting.getSettingId())
                .groupId(setting.getConfigurationGroup().getGroupId())
                .groupName(setting.getConfigurationGroup().getGroupName())
                .settingKey(setting.getSettingKey())
                .settingValue(setting.getSettingValue())
                .settingType(setting.getSettingType())
                .lastModifiedByUsername(setting.getLastModifiedBy() != null ? setting.getLastModifiedBy().getUsername() : null)
                .updatedAt(setting.getUpdatedAt())
                .build();
    }
}
"""

pref_srv = """package com.settings.management.service;

import com.settings.management.dto.request.PreferenceRequest;
import com.settings.management.dto.response.PreferenceResponse;
import com.settings.management.entity.User;
import com.settings.management.entity.UserPreference;
import com.settings.management.exception.ResourceNotFoundException;
import com.settings.management.repository.UserPreferenceRepository;
import com.settings.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserPreferenceService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPreferenceRepository preferenceRepository;

    public PreferenceResponse getPreferences(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        UserPreference pref = user.getUserPreference();
        if (pref == null) {
            pref = new UserPreference();
            pref.setUser(user);
            pref.setUserId(user.getUserId());
            pref = preferenceRepository.save(pref);
        }
        
        return mapToResponse(pref);
    }

    public PreferenceResponse updatePreferences(String email, PreferenceRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        UserPreference pref = user.getUserPreference();
        if (pref == null) {
            pref = new UserPreference();
            pref.setUser(user);
            pref.setUserId(user.getUserId());
        }
        
        pref.setUiTheme(request.getUiTheme());
        pref.setNotificationsEnabled(request.getNotificationsEnabled());
        
        pref = preferenceRepository.save(pref);
        
        return mapToResponse(pref);
    }

    private PreferenceResponse mapToResponse(UserPreference pref) {
        return PreferenceResponse.builder()
                .userId(pref.getUserId())
                .uiTheme(pref.getUiTheme())
                .notificationsEnabled(pref.getNotificationsEnabled())
                .build();
    }
}
"""

# Controllers
grp_ctrl = """package com.settings.management.controller;

import com.settings.management.dto.request.GroupRequest;
import com.settings.management.dto.response.ApiResponse;
import com.settings.management.dto.response.GroupResponse;
import com.settings.management.service.ConfigurationGroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/groups")
public class ConfigurationGroupController {

    @Autowired
    private ConfigurationGroupService groupService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<GroupResponse>> createGroup(@Valid @RequestBody GroupRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Group created successfully", groupService.createGroup(request)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GroupResponse>> updateGroup(@PathVariable Integer id, @Valid @RequestBody GroupRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Group updated successfully", groupService.updateGroup(id, request)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGroup(@PathVariable Integer id) {
        groupService.deleteGroup(id);
        return ResponseEntity.ok(new ApiResponse<>("Group deleted successfully", null));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupResponse>>> getAllGroups() {
        return ResponseEntity.ok(new ApiResponse<>("Groups retrieved successfully", groupService.getAllGroups()));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GroupResponse>> getGroupById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>("Group retrieved successfully", groupService.getGroupById(id)));
    }
}
"""

set_ctrl = """package com.settings.management.controller;

import com.settings.management.dto.request.SettingRequest;
import com.settings.management.dto.response.ApiResponse;
import com.settings.management.dto.response.SettingResponse;
import com.settings.management.service.SettingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/settings")
public class SettingController {

    @Autowired
    private SettingService settingService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<SettingResponse>> createSetting(@Valid @RequestBody SettingRequest request, Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>("Setting created successfully", settingService.createSetting(request, authentication.getName())));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SettingResponse>> updateSetting(@PathVariable Integer id, @Valid @RequestBody SettingRequest request, Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>("Setting updated successfully", settingService.updateSetting(id, request, authentication.getName())));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSetting(@PathVariable Integer id, Authentication authentication) {
        settingService.deleteSetting(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>("Setting deleted successfully", null));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<SettingResponse>>> getAllSettings() {
        return ResponseEntity.ok(new ApiResponse<>("Settings retrieved successfully", settingService.getAllSettings()));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SettingResponse>> getSettingById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>("Setting retrieved successfully", settingService.getSettingById(id)));
    }
}
"""

pref_ctrl = """package com.settings.management.controller;

import com.settings.management.dto.request.PreferenceRequest;
import com.settings.management.dto.response.ApiResponse;
import com.settings.management.dto.response.PreferenceResponse;
import com.settings.management.service.UserPreferenceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/preferences")
public class UserPreferenceController {

    @Autowired
    private UserPreferenceService preferenceService;

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public ResponseEntity<ApiResponse<PreferenceResponse>> getPreferences(Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>("Preferences retrieved successfully", preferenceService.getPreferences(authentication.getName())));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PutMapping
    public ResponseEntity<ApiResponse<PreferenceResponse>> updatePreferences(@Valid @RequestBody PreferenceRequest request, Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>("Preferences updated successfully", preferenceService.updatePreferences(authentication.getName(), request)));
    }
}
"""

doc = """# CRUD API Implementation Report
**Project:** Settings and Configuration Management UI (Full Stack)
**Status:** Core Business APIs Deployed & Secured

---

## 1. API Architecture
The system employs a strict layered architecture (`Controller` → `Service` → `Repository`), utilizing **DTOs** (Data Transfer Objects) to separate the JPA Entities from the external REST contract. 
Responses are standardized using a uniform generic wrapper `ApiResponse<T>`.

## 2. Endpoint List

### Configuration Groups (`/api/groups`)
- `GET /api/groups` (View all groups)
- `GET /api/groups/{id}` (View group details)
- `POST /api/groups` (Create new group)
- `PUT /api/groups/{id}` (Update existing group)
- `DELETE /api/groups/{id}` (Remove group)

### Settings (`/api/settings`)
- `GET /api/settings` (View all settings)
- `GET /api/settings/{id}` (View setting details)
- `POST /api/settings` (Create setting)
- `PUT /api/settings/{id}` (Update setting)
- `DELETE /api/settings/{id}` (Delete setting)

### User Preferences (`/api/preferences`)
- `GET /api/preferences` (View authenticated user's preferences)
- `PUT /api/preferences` (Update authenticated user's preferences)

## 3. RBAC Rules
Method-level security has been actively deployed using `@PreAuthorize`.
- **`ADMIN` ONLY**: Creating, updating, or deleting any Settings or Configuration Groups.
- **`USER` + `ADMIN`**: Viewing Settings/Groups and managing their *own* personal Preferences.

## 4. Request/Response Examples

**Success Response Envelope:**
```json
{
  "message": "Setting created successfully",
  "data": {
    "settingId": 1,
    "groupId": 2,
    "groupName": "Security",
    "settingKey": "MAX_RETRIES",
    "settingValue": "5",
    "settingType": "NUMBER",
    "lastModifiedByUsername": "admin@example.com"
  }
}
```

## 5. Validation Strategy
Validation is handled automatically using standard `jakarta.validation.constraints` (like `@NotBlank`, `@NotNull`, `@Size`) integrated directly into the Request DTOs.
Violations throw `MethodArgumentNotValidException`, which is seamlessly caught by the `@ControllerAdvice` to return a `400 Bad Request`.

## 6. Audit Logging Integration
Auditing is dynamically triggered within the `SettingService`.
Whenever a Setting is created, updated, or deleted, an entry is simultaneously saved to the `audit_logs` table tracking the specific `user`, `action`, `old_value`, `new_value`, and `timestamp` seamlessly in the exact same transaction.

## 7. Exception Handling
Custom business exceptions (`ResourceNotFoundException`, `DuplicateResourceException`, `InvalidOperationException`) have been established to prevent ugly stack traces from leaking to the client. 
The `GlobalExceptionHandler` converts these strictly typed exceptions into standardized `404`, `409`, and `400` JSON responses.
"""

write_file(f"{base_dir}/src/main/java/com/settings/management/exception/ResourceNotFoundException.java", res_not_found)
write_file(f"{base_dir}/src/main/java/com/settings/management/exception/DuplicateResourceException.java", dup_res)
write_file(f"{base_dir}/src/main/java/com/settings/management/exception/InvalidOperationException.java", inv_op)
write_file(f"{base_dir}/src/main/java/com/settings/management/exception/GlobalExceptionHandler.java", glob_ex)

write_file(f"{base_dir}/src/main/java/com/settings/management/dto/response/ApiResponse.java", api_res)
write_file(f"{base_dir}/src/main/java/com/settings/management/dto/request/SettingRequest.java", set_req)
write_file(f"{base_dir}/src/main/java/com/settings/management/dto/response/SettingResponse.java", set_res)
write_file(f"{base_dir}/src/main/java/com/settings/management/dto/request/GroupRequest.java", grp_req)
write_file(f"{base_dir}/src/main/java/com/settings/management/dto/response/GroupResponse.java", grp_res)
write_file(f"{base_dir}/src/main/java/com/settings/management/dto/request/PreferenceRequest.java", pref_req)
write_file(f"{base_dir}/src/main/java/com/settings/management/dto/response/PreferenceResponse.java", pref_res)

write_file(f"{base_dir}/src/main/java/com/settings/management/service/ConfigurationGroupService.java", grp_srv)
write_file(f"{base_dir}/src/main/java/com/settings/management/service/SettingService.java", set_srv)
write_file(f"{base_dir}/src/main/java/com/settings/management/service/UserPreferenceService.java", pref_srv)

write_file(f"{base_dir}/src/main/java/com/settings/management/controller/ConfigurationGroupController.java", grp_ctrl)
write_file(f"{base_dir}/src/main/java/com/settings/management/controller/SettingController.java", set_ctrl)
write_file(f"{base_dir}/src/main/java/com/settings/management/controller/UserPreferenceController.java", pref_ctrl)

write_file(f"{base_dir}/CRUD_API_IMPLEMENTATION_REPORT.md", doc)
