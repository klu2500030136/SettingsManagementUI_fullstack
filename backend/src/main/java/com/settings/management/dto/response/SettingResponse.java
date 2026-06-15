package com.settings.management.dto.response;
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
