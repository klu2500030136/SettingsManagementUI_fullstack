package com.settings.management.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupRequest {
    @NotBlank
    @Size(max = 100)
    private String groupName;

    private String description;
}
