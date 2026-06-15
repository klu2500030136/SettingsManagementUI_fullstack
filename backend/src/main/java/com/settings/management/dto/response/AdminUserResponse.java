package com.settings.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AdminUserResponse {
    private Integer userId;
    private String name;
    private String email;
    private String role;
    private String status;
}
