package com.settings.management.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PreferenceRequest {
    @NotBlank
    @Pattern(regexp = "light|dark|system", message = "uiTheme must be light, dark, or system")
    private String uiTheme;

    @NotNull
    private Boolean notificationsEnabled;

    @Pattern(regexp = "English|Hindi|Telugu", message = "languagePreference must be English, Hindi, or Telugu")
    private String languagePreference;

    @Pattern(regexp = "IST|UTC|PST", message = "timeZonePreference must be IST, UTC, or PST")
    private String timeZonePreference;

    @Pattern(regexp = "Compact|Standard|Detailed", message = "dashboardLayoutPreference must be Compact, Standard, or Detailed")
    private String dashboardLayoutPreference;
}
