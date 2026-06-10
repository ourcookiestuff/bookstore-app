package com.bookstore.dto;

import com.bookstore.model.ShelfEntry;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private String email;
    private Integer rating;
    private String review;
    private LocalDateTime updatedAt;

    public static ReviewResponse from(ShelfEntry entry) {
        ReviewResponse response = new ReviewResponse();
        response.setEmail(entry.getUser().getEmail());
        response.setRating(entry.getRating());
        response.setReview(entry.getReview());
        response.setUpdatedAt(entry.getUpdatedAt());
        return response;
    }
}