package com.bookstore.repository;

import com.bookstore.model.ShelfEntry;
import com.bookstore.model.ShelfStatus;
import com.bookstore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShelfEntryRepository extends JpaRepository<ShelfEntry, Long> {
    List<ShelfEntry> findByUser(User user);
    List<ShelfEntry> findByUserAndStatus(User user, ShelfStatus status);
    Optional<ShelfEntry> findByUserAndBookId(User user, Long bookId);
}