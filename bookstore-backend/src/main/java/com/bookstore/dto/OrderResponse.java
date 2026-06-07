package com.bookstore.dto;

import com.bookstore.model.Order;
import com.bookstore.model.OrderStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private OrderStatus status;
    private BigDecimal total;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    @Data
    public static class OrderItemResponse {
        private Long bookId;
        private String title;
        private String author;
        private String coverImageUrl;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal subtotal;
    }

    public static OrderResponse from(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setStatus(order.getStatus());
        response.setTotal(order.getTotal());
        response.setCreatedAt(order.getCreatedAt());
        response.setItems(order.getItems().stream().map(item -> {
            OrderItemResponse itemResponse = new OrderItemResponse();
            itemResponse.setBookId(item.getBook().getId());
            itemResponse.setTitle(item.getBook().getTitle());
            itemResponse.setAuthor(item.getBook().getAuthor());
            itemResponse.setCoverImageUrl(item.getBook().getCoverImageUrl());
            itemResponse.setQuantity(item.getQuantity());
            itemResponse.setPrice(item.getPrice());
            itemResponse.setSubtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return itemResponse;
        }).toList());
        return response;
    }
}