package com.settings.management.repository;
import com.settings.management.entity.ConfigurationGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ConfigurationGroupRepository extends JpaRepository<ConfigurationGroup, Integer> {
    Optional<ConfigurationGroup> findByGroupName(String groupName);
}
