package com.settings.management.repository;
import com.settings.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole_RoleName(String roleName);

    @Query("""
            select user
            from User user
            join fetch user.role
            order by user.createdAt desc, user.userId asc
            """)
    List<User> findAllWithRole();
}
