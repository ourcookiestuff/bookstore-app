package com.bookstore.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotBlank(message = "Imię i nazwisko jest wymagane")
    private String cardholderName;

    @NotBlank(message = "Numer karty jest wymagany")
    private String cardNumber;

    @NotBlank(message = "Data ważności jest wymagana")
    private String expiryDate;

    @NotBlank(message = "CVV jest wymagany")
    private String cvv;
}