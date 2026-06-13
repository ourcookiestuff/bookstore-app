package com.bookstore.service;

import com.bookstore.dto.OrderResponse;
import com.bookstore.dto.PaymentRequest;
import com.bookstore.model.*;
import com.bookstore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final UserRepository userRepository;
    private final ShelfEntryRepository shelfEntryRepository;
    private final BookRepository bookRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
    }

    public List<OrderResponse> getOrders() {
        User user = getCurrentUser();
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    public OrderResponse getOrder(Long id) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zamówienie nie istnieje"));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Brak dostępu");
        }
        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse checkout(PaymentRequest paymentRequest) {
        User user = getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Koszyk jest pusty");
        }

        BigDecimal total = cartItems.stream()
                .map(item -> item.getBook().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .total(total)
                .street(paymentRequest.getStreet())
                .city(paymentRequest.getCity())
                .postalCode(paymentRequest.getPostalCode())
                .build();
        order = orderRepository.save(order);

        final Order savedOrder = order;
        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> OrderItem.builder()
                        .order(savedOrder)
                        .book(cartItem.getBook())
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getBook().getPrice())
                        .build())
                .toList();
        savedOrder.setItems(orderItems);

        boolean paymentSuccess = new Random().nextInt(10) != 0;

        PaymentTransaction transaction = PaymentTransaction.builder()
                .order(savedOrder)
                .amount(total)
                .status(paymentSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED)
                .build();
        paymentTransactionRepository.save(transaction);

        if (paymentSuccess) {
            savedOrder.setStatus(OrderStatus.PAID);

            for (CartItem cartItem : cartItems) {
                Book book = cartItem.getBook();
                book.setStock(Math.max(0, book.getStock() - cartItem.getQuantity()));
                bookRepository.save(book);
            }

            cartItemRepository.deleteByUser(user);
            
            for (OrderItem item : orderItems) {
                shelfEntryRepository.findByUserAndBookId(user, item.getBook().getId())
                        .orElseGet(() -> shelfEntryRepository.save(
                                ShelfEntry.builder()
                                        .user(user)
                                        .book(item.getBook())
                                        .status(ShelfStatus.TO_READ)
                                        .currentPage(0)
                                        .build()
                        ));
            }
        } else {
            savedOrder.setStatus(OrderStatus.CANCELLED);
            throw new RuntimeException("Płatność nie powiodła się. Spróbuj ponownie.");
        }

        return OrderResponse.from(orderRepository.save(savedOrder));
    }
}