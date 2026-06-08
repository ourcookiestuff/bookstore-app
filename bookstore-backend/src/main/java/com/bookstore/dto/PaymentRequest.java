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

    @NotBlank(message = "Ulica jest wymagana")
    private String street;

    @NotBlank(message = "Miasto jest wymagane")
    private String city;

    @NotBlank(message = "Kod pocztowy jest wymagany")
    private String postalCode;
}