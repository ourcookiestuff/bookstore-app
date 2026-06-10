package com.bookstore.repository;

import com.bookstore.model.Book;
import com.bookstore.model.ShelfEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
    Page<Book> findByGenre(String genre, Pageable pageable);
    Page<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(
        String title, String author, Pageable pageable
    );

    @Query("SELECT AVG(s.rating) FROM ShelfEntry s WHERE s.book.id = :bookId AND s.rating IS NOT NULL")
    Double findAverageRatingByBookId(Long bookId);

    @Query("SELECT COUNT(s) FROM ShelfEntry s WHERE s.book.id = :bookId AND s.rating IS NOT NULL")
    Long findRatingsCountByBookId(Long bookId);

    @Query("SELECT COUNT(s) FROM ShelfEntry s WHERE s.book.id = :bookId AND s.review IS NOT NULL AND s.review != ''")
    Long findReviewsCountByBookId(Long bookId);

    @Query("SELECT s FROM ShelfEntry s WHERE s.book.id = :bookId AND s.review IS NOT NULL AND s.review != '' ORDER BY s.updatedAt DESC")
    Page<ShelfEntry> findReviewsByBookId(Long bookId, Pageable pageable);
}