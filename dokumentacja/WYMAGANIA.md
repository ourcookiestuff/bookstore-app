# Wymagania projektowe

## Wymagania minimalne

| **ID** | **Wymaganie** | **Opis realizacji** | **Status** |
| ------ | ------------- | ------------------- | ---------- |
| **R1** | **Backend API** | REST API z zasobami: User, Book, CartItem, Order, OrderItem, ShelfEntry, PaymentTransaction - 7 zasobów powiązanych relacjami, wystawione przez Spring Boot 3 | ✓ |
| **R2** | **Baza danych** | PostgreSQL 16 z przemyślanym schematem relacyjnym. Migracje zarządzane przez Flyway, wykonywane automatycznie przy starcie aplikacji | ✓ |
| **R3** | **Frontend** | SPA zbudowane w React 19 + TypeScript, komunikujące się z API przez Axios. Routing po stronie klienta przez React Router, UI przez shadcn/ui + Tailwind CSS | ✓ |
| **R4** | **Autentykacja** | JWT podpisany HMAC-SHA256, weryfikowany przez Spring Security przy każdym żądaniu. Rozróżnienie ról USER/ADMIN, ochrona endpointów przez `@PreAuthorize`, publiczne widoki (katalog, strona główna) dostępne bez logowania | ✓ |
| **R5** | **Konteneryzacja** | `docker compose up --build` uruchamia trzy serwisy: PostgreSQL 16, backend Spring Boot i frontend React serwowany przez nginx. Multi-stage builds redukują rozmiar obrazów | ✓ |
| **R6** | **Repozytorium** | Publiczne repozytorium na GitHub z historią commitów, plikiem README zawierającym instrukcję uruchomienia, opis architektury i dokumentację ADR | ✓ |

## Wymagania dodatkowe

| **Element** | **Opis** | **Status** |
| ----------- | -------- | ---------- |
| **Walidacja danych** | Bean Validation (`@Valid`, `@NotBlank`, `@Min`, `@Email`) na każdym endpoincie API + Zod na formularze frontendowe (rejestracja, logowanie, checkout, dodawanie książek) | ✓ |
| **Dokumentacja API** | Swagger UI przez springdoc-openapi - automatycznie generowana z adnotacji Spring, dostępna pod `/swagger-ui/index.html`. Specyfikacja OpenAPI 3.0 pod `/v3/api-docs` | ✓ |
| **Seed data** | `DataSeeder.java` z profilem Spring `seed` - tworzy admina, 5 użytkowników testowych, 16 książek i losowe wpisy na półkach z ocenami i recenzjami. Uruchamiany przez `docker compose --profile seed run --rm seeder` | ✓ |
