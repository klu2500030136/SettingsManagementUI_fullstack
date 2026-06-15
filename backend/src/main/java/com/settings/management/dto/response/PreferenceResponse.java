package com.settings.management.dto.response;
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
    private String languagePreference;
    private String timeZonePreference;
    private String dashboardLayoutPreference;
}
