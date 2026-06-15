package com.settings.management.controller;

import com.settings.management.dto.request.SettingRequest;
import com.settings.management.dto.response.ApiResponse;
import com.settings.management.dto.response.SettingResponse;
import com.settings.management.service.SettingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/settings")
public class SettingController {

    @Autowired
    private SettingService settingService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<SettingResponse>> createSetting(@Valid @RequestBody SettingRequest request, Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>("Setting created successfully", settingService.createSetting(request, authentication.getName())));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SettingResponse>> updateSetting(@PathVariable Integer id, @Valid @RequestBody SettingRequest request, Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>("Setting updated successfully", settingService.updateSetting(id, request, authentication.getName())));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSetting(@PathVariable Integer id, Authentication authentication) {
        settingService.deleteSetting(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>("Setting deleted successfully", null));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<SettingResponse>>> getAllSettings() {
        return ResponseEntity.ok(new ApiResponse<>("Settings retrieved successfully", settingService.getAllSettings()));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SettingResponse>> getSettingById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>("Setting retrieved successfully", settingService.getSettingById(id)));
    }
}
