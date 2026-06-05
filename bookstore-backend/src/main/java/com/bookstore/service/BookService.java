package com.bookstore.service;

import com.bookstore.dto.BookRequest;
import com.bookstore.dto.BookResponse;
import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public Page<BookResponse> getBooks(String search, String genre, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return bookRepository
                .findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(search, search, pageable)
                .map(BookResponse::from);
        }
        if (genre != null && !genre.isBlank()) {
            return bookRepository
                .findByGenre(genre, pageable)
                .map(BookResponse::from);
        }
        return bookRepository.findAll(pageable).map(BookResponse::from);
    }

    public BookResponse getBook(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Książka nie istnieje"));
        return BookResponse.from(book);
    }

    public BookResponse createBook(BookRequest request) {
        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .description(request.getDescription())
                .price(request.getPrice())
                .coverImageUrl(request.getCoverImageUrl())
                .isbn(request.getIsbn())
                .genre(request.getGenre())
                .pages(request.getPages())
                .stock(request.getStock())
                .build();
        return BookResponse.from(bookRepository.save(book));
    }

    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Książka nie istnieje"));
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        book.setCoverImageUrl(request.getCoverImageUrl());
        book.setIsbn(request.getIsbn());
        book.setGenre(request.getGenre());
        book.setPages(request.getPages());
        book.setStock(request.getStock());
        return BookResponse.from(bookRepository.save(book));
    }

    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Książka nie istnieje");
        }
        bookRepository.deleteById(id);
    }
}