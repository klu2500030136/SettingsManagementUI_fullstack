package com.settings.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long adminCount;
    private long userCount;
    private long activeUserCount;
}
