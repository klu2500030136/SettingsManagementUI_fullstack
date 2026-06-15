package com.settings.management.controller;

import com.settings.management.dto.request.PreferenceRequest;
import com.settings.management.dto.response.ApiResponse;
import com.settings.management.dto.response.PreferenceResponse;
import com.settings.management.security.service.UserDetailsImpl;
import com.settings.management.service.UserPreferenceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/preferences")
public class UserPreferenceController {

    @Autowired
    private UserPreferenceService preferenceService;

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public ResponseEntity<ApiResponse<PreferenceResponse>> getPreferences(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(new ApiResponse<>("Preferences retrieved successfully", preferenceService.getPreferences(userDetails.getId())));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PutMapping
    public ResponseEntity<ApiResponse<PreferenceResponse>> updatePreferences(@Valid @RequestBody PreferenceRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(new ApiResponse<>("Preferences updated successfully", preferenceService.savePreferences(userDetails.getId(), request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping
    public ResponseEntity<ApiResponse<PreferenceResponse>> savePreferences(@Valid @RequestBody PreferenceRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(new ApiResponse<>("Preferences saved successfully", preferenceService.savePreferences(userDetails.getId(), request)));
    }
}
