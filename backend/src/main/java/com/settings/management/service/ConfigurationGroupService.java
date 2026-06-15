package com.settings.management.service;

import com.settings.management.dto.request.GroupRequest;
import com.settings.management.dto.response.GroupResponse;
import com.settings.management.entity.ConfigurationGroup;
import com.settings.management.exception.DuplicateResourceException;
import com.settings.management.exception.ResourceNotFoundException;
import com.settings.management.repository.ConfigurationGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConfigurationGroupService {

    @Autowired
    private ConfigurationGroupRepository groupRepository;

    public GroupResponse createGroup(GroupRequest request) {
        if (groupRepository.findByGroupName(request.getGroupName()).isPresent()) {
            throw new DuplicateResourceException("Group name already exists");
        }
        ConfigurationGroup group = new ConfigurationGroup();
        group.setGroupName(request.getGroupName());
        group.setDescription(request.getDescription());
        group = groupRepository.save(group);
        return mapToResponse(group);
    }

    public GroupResponse updateGroup(Integer id, GroupRequest request) {
        ConfigurationGroup group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
                
        if (!group.getGroupName().equals(request.getGroupName()) &&
            groupRepository.findByGroupName(request.getGroupName()).isPresent()) {
            throw new DuplicateResourceException("Group name already exists");
        }

        group.setGroupName(request.getGroupName());
        group.setDescription(request.getDescription());
        group = groupRepository.save(group);
        return mapToResponse(group);
    }

    public void deleteGroup(Integer id) {
        if (!groupRepository.existsById(id)) {
            throw new ResourceNotFoundException("Group not found");
        }
        groupRepository.deleteById(id);
    }

    public List<GroupResponse> getAllGroups() {
        return groupRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public GroupResponse getGroupById(Integer id) {
        ConfigurationGroup group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        return mapToResponse(group);
    }

    private GroupResponse mapToResponse(ConfigurationGroup group) {
        return GroupResponse.builder()
                .groupId(group.getGroupId())
                .groupName(group.getGroupName())
                .description(group.getDescription())
                .createdAt(group.getCreatedAt())
                .build();
    }
}
