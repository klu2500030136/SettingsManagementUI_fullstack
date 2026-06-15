package com.settings.management.controller;

import com.settings.management.dto.request.GroupRequest;
import com.settings.management.dto.response.ApiResponse;
import com.settings.management.dto.response.GroupResponse;
import com.settings.management.service.ConfigurationGroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/groups")
public class ConfigurationGroupController {

    @Autowired
    private ConfigurationGroupService groupService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<GroupResponse>> createGroup(@Valid @RequestBody GroupRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Group created successfully", groupService.createGroup(request)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GroupResponse>> updateGroup(@PathVariable Integer id, @Valid @RequestBody GroupRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Group updated successfully", groupService.updateGroup(id, request)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGroup(@PathVariable Integer id) {
        groupService.deleteGroup(id);
        return ResponseEntity.ok(new ApiResponse<>("Group deleted successfully", null));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupResponse>>> getAllGroups() {
        return ResponseEntity.ok(new ApiResponse<>("Groups retrieved successfully", groupService.getAllGroups()));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GroupResponse>> getGroupById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>("Group retrieved successfully", groupService.getGroupById(id)));
    }
}
