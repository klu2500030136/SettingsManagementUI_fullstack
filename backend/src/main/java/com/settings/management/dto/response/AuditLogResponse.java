package com.settings.management.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class AuditLogResponse {
    private Integer id;
    private String user;
    private String action;
    private String category;
    private String severity;
    private String date;
    private String time;
    private LocalDateTime timestamp;
}
