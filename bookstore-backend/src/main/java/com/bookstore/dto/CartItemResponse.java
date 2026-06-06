package com.bookstore.dto;

import com.bookstore.model.CartItem;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemResponse {
    private Long id;
    private Long bookId;
    private String title;
    private String author;
    private String coverImageUrl;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;

    public static CartItemResponse from(CartItem item) {
        CartItemResponse response = new CartItemResponse();
        response.setId(item.getId());
        response.setBookId(item.getBook().getId());
        response.setTitle(item.getBook().getTitle());
        response.setAuthor(item.getBook().getAuthor());
        response.setCoverImageUrl(item.getBook().getCoverImageUrl());
        response.setPrice(item.getBook().getPrice());
        response.setQuantity(item.getQuantity());
        response.setSubtotal(item.getBook().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        return response;
    }
}