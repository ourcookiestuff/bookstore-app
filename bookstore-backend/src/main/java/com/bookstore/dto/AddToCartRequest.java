package com.bookstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddToCartRequest {

    @NotNull(message = "ID książki jest wymagane")
    private Long bookId;

    @Min(value = 1, message = "Ilość musi być większa od 0")
    private Integer quantity = 1;
}