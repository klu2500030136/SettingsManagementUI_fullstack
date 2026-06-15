package com.settings.management.service;

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
