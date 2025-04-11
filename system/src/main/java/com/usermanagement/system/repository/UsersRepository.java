package com.usermanagement.system.repository;

import java.util.List;
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

    public OurUsers save(OurUsers ourUser) {
        String sql = """
            INSERT INTO our_users (email, name, password, city, role)
            VALUES (:email, :name, :password, :city, :role)
        """;
    
        int rowsAffected = jdbcClient.sql(sql)
            .param("email", ourUser.email())
            .param("name", ourUser.name())
            .param("password", ourUser.password())
            .param("city", ourUser.city())
            .param("role", ourUser.role())
            .update();
    
        if (rowsAffected > 0) {
            // Return the same user object with a placeholder ID (if needed)
            return ourUser.withId(0); // Replace 0 with the actual ID if available
        } else {
            throw new IllegalStateException("Failed to insert user into the database");
        }
    }

    public List<OurUsers> findAll() {
        return jdbcClient.sql("SELECT * FROM our_users")
                .query(OurUsers.class)
                .list();
    }

    public Optional<OurUsers> findById(Integer id) {
        return jdbcClient.sql("SELECT * FROM our_users WHERE id = :id")
                .param("id", id)
                .query(OurUsers.class)
                .optional();
    }

    public void deleteById(Integer id) {
        jdbcClient.sql("DELETE FROM our_users WHERE id = :id")
                .param("id", id)
                .update();
    }

}
