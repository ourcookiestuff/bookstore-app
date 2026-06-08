package com.bookstore.controller;

import com.bookstore.dto.ShelfEntryRequest;
import com.bookstore.dto.ShelfEntryResponse;
import com.bookstore.model.ShelfStatus;
import com.bookstore.service.ShelfService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shelf")
@RequiredArgsConstructor
public class ShelfController {

    private final ShelfService shelfService;

    @GetMapping
    public ResponseEntity<List<ShelfEntryResponse>> getShelf(
            @RequestParam(required = false) ShelfStatus status
    ) {
        return ResponseEntity.ok(shelfService.getShelf(status));
    }

    @PostMapping("/books/{bookId}")
    public ResponseEntity<ShelfEntryResponse> addToShelf(
            @PathVariable Long bookId,
            @Valid @RequestBody ShelfEntryRequest request
    ) {
        return ResponseEntity.ok(shelfService.addToShelf(bookId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShelfEntryResponse> updateEntry(
            @PathVariable Long id,
            @Valid @RequestBody ShelfEntryRequest request
    ) {
        return ResponseEntity.ok(shelfService.updateEntry(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromShelf(@PathVariable Long id) {
        shelfService.removeFromShelf(id);
        return ResponseEntity.noContent().build();
    }
}