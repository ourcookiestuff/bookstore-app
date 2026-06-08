package com.bookstore.dto;

import com.bookstore.model.ShelfStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ShelfEntryRequest {

    @NotNull(message = "Status jest wymagany")
    private ShelfStatus status;

    @Min(value = 0, message = "Strona nie może być ujemna")
    private Integer currentPage;

    @Min(value = 1, message = "Ocena minimalna to 1")
    @Max(value = 5, message = "Ocena maksymalna to 5")
    private Integer rating;

    private String review;
}