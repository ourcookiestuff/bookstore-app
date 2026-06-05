package com.bookstore.dto;

import com.bookstore.model.Book;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BookResponse {

    private Long id;
    private String title;
    private String author;
    private String description;
    private BigDecimal price;
    private String coverImageUrl;
    private String isbn;
    private String genre;
    private Integer pages;
    private Integer stock;
    private LocalDateTime createdAt;

    public static BookResponse from(Book book) {
        BookResponse response = new BookResponse();
        response.setId(book.getId());
        response.setTitle(book.getTitle());
        response.setAuthor(book.getAuthor());
        response.setDescription(book.getDescription());
        response.setPrice(book.getPrice());
        response.setCoverImageUrl(book.getCoverImageUrl());
        response.setIsbn(book.getIsbn());
        response.setGenre(book.getGenre());
        response.setPages(book.getPages());
        response.setStock(book.getStock());
        response.setCreatedAt(book.getCreatedAt());
        return response;
    }
}