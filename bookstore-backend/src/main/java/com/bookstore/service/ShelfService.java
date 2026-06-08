package com.bookstore.service;

import com.bookstore.dto.ShelfEntryRequest;
import com.bookstore.dto.ShelfEntryResponse;
import com.bookstore.model.*;
import com.bookstore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShelfService {

    private final ShelfEntryRepository shelfEntryRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
    }

    public List<ShelfEntryResponse> getShelf(ShelfStatus status) {
        User user = getCurrentUser();
        List<ShelfEntry> entries = status != null
                ? shelfEntryRepository.findByUserAndStatus(user, status)
                : shelfEntryRepository.findByUser(user);
        return entries.stream().map(ShelfEntryResponse::from).toList();
    }

    public ShelfEntryResponse addToShelf(Long bookId, ShelfEntryRequest request) {
        User user = getCurrentUser();
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Książka nie istnieje"));

        ShelfEntry entry = shelfEntryRepository.findByUserAndBookId(user, bookId)
                .map(existing -> {
                    existing.setStatus(request.getStatus());
                    existing.setCurrentPage(request.getCurrentPage());
                    existing.setRating(request.getRating());
                    existing.setReview(request.getReview());
                    return existing;
                })
                .orElse(ShelfEntry.builder()
                        .user(user)
                        .book(book)
                        .status(request.getStatus())
                        .currentPage(request.getCurrentPage() != null ? request.getCurrentPage() : 0)
                        .rating(request.getRating())
                        .review(request.getReview())
                        .build());

        return ShelfEntryResponse.from(shelfEntryRepository.save(entry));
    }

    public ShelfEntryResponse updateEntry(Long entryId, ShelfEntryRequest request) {
        User user = getCurrentUser();
        ShelfEntry entry = shelfEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Pozycja nie istnieje"));

        if (!entry.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Brak dostępu");
        }

        entry.setStatus(request.getStatus());
        entry.setCurrentPage(request.getCurrentPage());
        entry.setRating(request.getRating());
        entry.setReview(request.getReview());

        return ShelfEntryResponse.from(shelfEntryRepository.save(entry));
    }

    public void removeFromShelf(Long entryId) {
        User user = getCurrentUser();
        ShelfEntry entry = shelfEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Pozycja nie istnieje"));

        if (!entry.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Brak dostępu");
        }

        shelfEntryRepository.delete(entry);
    }
}