package com.bookstore.controller;

import com.bookstore.dto.OrderResponse;
import com.bookstore.repository.OrderRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final OrderRepository orderRepository;

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(
            orderRepository.findAll(pageable).map(OrderResponse::from)
        );
    }

    @GetMapping("/orders/search")
    public ResponseEntity<Page<OrderResponse>> searchOrders(
            @RequestParam(required = false) Long id,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        if (id != null) {
            return orderRepository.findById(id)
                    .map(order -> {
                        Page<OrderResponse> page = new org.springframework.data.domain.PageImpl<>(
                                List.of(OrderResponse.from(order))
                        );
                        return ResponseEntity.ok(page);
                    })
                    .orElse(ResponseEntity.ok(Page.empty()));
        }
        return ResponseEntity.ok(orderRepository.findAll(pageable).map(OrderResponse::from));
    }
}