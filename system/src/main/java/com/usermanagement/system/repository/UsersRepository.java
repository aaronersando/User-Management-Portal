package com.usermanagement.system.repository;

import java.util.Optional;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import com.usermanagement.system.entity.OurUsers;

@Repository
public class UsersRepository {

    private final JdbcClient jdbcClient;

    public UsersRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public Optional<OurUsers> findByEmail(String email) {
        return jdbcClient.sql("SELECT * FROM our_users WHERE email = :email")
                .param("email", email)
                .query(OurUsers.class)
                .optional();
    }

}
