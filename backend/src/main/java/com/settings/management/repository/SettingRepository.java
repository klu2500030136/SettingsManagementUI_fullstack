package com.settings.management.repository;
import com.settings.management.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SettingRepository extends JpaRepository<Setting, Integer> {
    Optional<Setting> findBySettingKey(String settingKey);

    @Modifying
    @Query("update Setting setting set setting.lastModifiedBy = null where setting.lastModifiedBy.userId = :userId")
    int clearLastModifiedByForUser(@Param("userId") Integer userId);
}
