package com.settings.management.dto.response;
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
