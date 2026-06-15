package com.settings.management.dto.request;
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
