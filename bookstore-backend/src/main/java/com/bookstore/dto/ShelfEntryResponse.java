package com.bookstore.dto;

import com.bookstore.model.ShelfEntry;
import com.bookstore.model.ShelfStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ShelfEntryResponse {
    private Long id;
    private Long bookId;
    private String title;
    private String author;
    private String coverImageUrl;
    private Integer pages;
    private ShelfStatus status;
    private Integer currentPage;
    private Integer rating;
    private String review;
    private LocalDateTime updatedAt;

    public static ShelfEntryResponse from(ShelfEntry entry) {
        ShelfEntryResponse response = new ShelfEntryResponse();
        response.setId(entry.getId());
        response.setBookId(entry.getBook().getId());
        response.setTitle(entry.getBook().getTitle());
        response.setAuthor(entry.getBook().getAuthor());
        response.setCoverImageUrl(entry.getBook().getCoverImageUrl());
        response.setPages(entry.getBook().getPages());
        response.setStatus(entry.getStatus());
        response.setCurrentPage(entry.getCurrentPage());
        response.setRating(entry.getRating());
        response.setReview(entry.getReview());
        response.setUpdatedAt(entry.getUpdatedAt());
        return response;
    }
}