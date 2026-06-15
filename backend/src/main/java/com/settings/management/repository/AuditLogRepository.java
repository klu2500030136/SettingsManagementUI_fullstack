package com.settings.management.repository;
import com.settings.management.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Integer> {
    @Query("""
            select auditLog
            from AuditLog auditLog
            join fetch auditLog.user
            join fetch auditLog.setting setting
            join fetch setting.configurationGroup
            order by auditLog.createdAt desc, auditLog.logId desc
            """)
    List<AuditLog> findAllWithDetails();

    boolean existsByUser_UserId(Integer userId);
}
