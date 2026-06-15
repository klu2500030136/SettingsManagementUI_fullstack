package com.settings.management.dto.response;

public class DashboardResponse {
    private long totalSettings;
    private long totalCategories;
    private long totalPreferences;
    private long totalAuditLogs;

    public DashboardResponse() {}

    public DashboardResponse(long totalSettings, long totalCategories, long totalPreferences, long totalAuditLogs) {
        this.totalSettings = totalSettings;
        this.totalCategories = totalCategories;
        this.totalPreferences = totalPreferences;
        this.totalAuditLogs = totalAuditLogs;
    }

    public long getTotalSettings() {
        return totalSettings;
    }

    public void setTotalSettings(long totalSettings) {
        this.totalSettings = totalSettings;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public long getTotalPreferences() {
        return totalPreferences;
    }

    public void setTotalPreferences(long totalPreferences) {
        this.totalPreferences = totalPreferences;
    }

    public long getTotalAuditLogs() {
        return totalAuditLogs;
    }

    public void setTotalAuditLogs(long totalAuditLogs) {
        this.totalAuditLogs = totalAuditLogs;
    }
}
