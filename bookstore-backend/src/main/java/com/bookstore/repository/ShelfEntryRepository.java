package com.bookstore.repository;

import com.bookstore.model.ShelfEntry;
import com.bookstore.model.ShelfStatus;
import com.bookstore.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShelfEntryRepository extends JpaRepository<ShelfEntry, Long> {
    Page<ShelfEntry> findByUser(User user, Pageable pageable);
    Page<ShelfEntry> findByUserAndStatus(User user, ShelfStatus status, Pageable pageable);
    Optional<ShelfEntry> findByUserAndBookId(User user, Long bookId);
}