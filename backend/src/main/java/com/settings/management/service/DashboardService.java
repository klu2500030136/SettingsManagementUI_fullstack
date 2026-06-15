package com.settings.management.service;

import com.settings.management.dto.response.DashboardResponse;
import com.settings.management.repository.AuditLogRepository;
import com.settings.management.repository.ConfigurationGroupRepository;
import com.settings.management.repository.SettingRepository;
import com.settings.management.repository.UserPreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private SettingRepository settingRepository;

    @Autowired
    private ConfigurationGroupRepository groupRepository;

    @Autowired
    private UserPreferenceRepository preferenceRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public DashboardResponse getDashboardStats() {
        DashboardResponse stats = new DashboardResponse();
        stats.setTotalSettings(settingRepository.count());
        stats.setTotalCategories(groupRepository.count());
        stats.setTotalPreferences(preferenceRepository.count());
        stats.setTotalAuditLogs(auditLogRepository.count());
        return stats;
    }
}
