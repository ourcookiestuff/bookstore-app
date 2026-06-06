package com.bookstore.service;

import com.bookstore.dto.AddToCartRequest;
import com.bookstore.dto.CartItemResponse;
import com.bookstore.model.Book;
import com.bookstore.model.CartItem;
import com.bookstore.model.User;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartItemRepository;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
    }

    public List<CartItemResponse> getCart() {
        User user = getCurrentUser();
        return cartItemRepository.findByUser(user)
                .stream()
                .map(CartItemResponse::from)
                .toList();
    }

    public CartItemResponse addToCart(AddToCartRequest request) {
        User user = getCurrentUser();
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Książka nie istnieje"));

        if (book.getStock() < request.getQuantity()) {
            throw new RuntimeException("Niewystarczająca ilość w magazynie");
        }

        CartItem cartItem = cartItemRepository.findByUserAndBookId(user, book.getId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + request.getQuantity());
                    return existing;
                })
                .orElse(CartItem.builder()
                        .user(user)
                        .book(book)
                        .quantity(request.getQuantity())
                        .build());

        return CartItemResponse.from(cartItemRepository.save(cartItem));
    }

    public CartItemResponse updateQuantity(Long cartItemId, Integer quantity) {
        User user = getCurrentUser();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Pozycja koszyka nie istnieje"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Brak dostępu");
        }

        cartItem.setQuantity(quantity);
        return CartItemResponse.from(cartItemRepository.save(cartItem));
    }

    @Transactional
    public void removeFromCart(Long cartItemId) {
        User user = getCurrentUser();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Pozycja koszyka nie istnieje"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Brak dostępu");
        }

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart() {
        cartItemRepository.deleteByUser(getCurrentUser());
    }
}