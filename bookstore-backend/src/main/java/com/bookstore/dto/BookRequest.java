package com.bookstore.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class BookRequest {

    @NotBlank(message = "Tytuł jest wymagany")
    private String title;

    @NotBlank(message = "Autor jest wymagany")
    private String author;

    private String description;

    @NotNull(message = "Cena jest wymagana")
    @DecimalMin(value = "0.0", inclusive = false, message = "Cena musi być większa od 0")
    private BigDecimal price;

    private String coverImageUrl;
    private String isbn;
    private String genre;
    private Integer pages;

    @NotNull(message = "Stan magazynowy jest wymagany")
    @Min(value = 0, message = "Stan magazynowy nie może być ujemny")
    private Integer stock;
}