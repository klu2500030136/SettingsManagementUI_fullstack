package com.settings.management.service;

import com.settings.management.dto.response.AuditLogResponse;
import com.settings.management.entity.AuditLog;
import com.settings.management.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class AuditLogService {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);

    @Autowired
    private AuditLogRepository auditLogRepository;

    public List<AuditLogResponse> getAuditLogs() {
        return auditLogRepository.findAllWithDetails().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AuditLogResponse mapToResponse(AuditLog auditLog) {
        String actionType = auditLog.getActionType();
        String settingKey = auditLog.getSetting().getSettingKey();

        return AuditLogResponse.builder()
                .id(auditLog.getLogId())
                .user(auditLog.getUser().getUsername())
                .action(formatAction(actionType, settingKey, auditLog.getOldValue(), auditLog.getNewValue()))
                .category(auditLog.getSetting().getConfigurationGroup().getGroupName())
                .severity(resolveSeverity(actionType))
                .date(auditLog.getCreatedAt().format(DATE_FORMATTER))
                .time(auditLog.getCreatedAt().format(TIME_FORMATTER))
                .timestamp(auditLog.getCreatedAt())
                .build();
    }

    private String formatAction(String actionType, String settingKey, String oldValue, String newValue) {
        if ("CREATE".equalsIgnoreCase(actionType)) {
            return "Created " + settingKey + " with value " + newValue;
        }

        if ("UPDATE".equalsIgnoreCase(actionType)) {
            return "Updated " + settingKey + " from " + oldValue + " to " + newValue;
        }

        if ("DELETE".equalsIgnoreCase(actionType)) {
            return "Deleted " + settingKey;
        }

        return actionType + " " + settingKey;
    }

    private String resolveSeverity(String actionType) {
        if ("DELETE".equalsIgnoreCase(actionType)) {
            return "Critical";
        }

        if ("UPDATE".equalsIgnoreCase(actionType)) {
            return "Medium";
        }

        return "Low";
    }
}
