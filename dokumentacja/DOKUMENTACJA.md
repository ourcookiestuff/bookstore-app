# BookStore - Dokumentacja

## Opis aplikacji

BookStore to aplikacja internetowa łącząca funkcjonalność księgarni internetowej z osobistą biblioteką czytelnika. Użytkownicy mogą przeglądać katalog książek, dodawać je do koszyka i kupować przez symulowany checkout z płatnością kartą. Po zakupie książki automatycznie trafiają na osobistą półkę użytkownika, gdzie może śledzić postęp czytania, oceniać książki w skali 1-5 i pisać recenzje widoczne dla innych użytkowników.

Aplikacja składa się z backendu REST API (Spring Boot 3 + PostgreSQL) i frontendu SPA (React 19 + TypeScript), skonteneryzowanych przez Docker Compose.

## Aktorzy 

| Rola                      | Uprawnienia                                                                                                                                                                              |
| :------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gość (niezalogowany)      | Przegląda stronę główną; Przegląda katalog książek z filtrowaniem po gatunku i wyszukiwaniem; Ogląda szczegóły książki wraz ze średnią ocen i recenzjami innych użytkowników.            |
| Użytkownik (zalogowany)   | Składa zamówienia przez checkout z symulowaną płatnością kartą (90% szans na sukces); Zarządza osobistą półką - zmienia status czytania, śledzi aktualną stronę, ocenia i pisze recenzje |
| Administrator             | Dostęp do panelu admina; Przegląda wszystkie zamówienia; Dodaje i usuwa książki z katalogu                                                                                               |


# Architecture Decision Records

## ADR-001: Spring Boot

| **Decyzja** | Spring Boot 3 + Java 21 jako backend. |
| :-|:- |
| **Kontekst** | Aplikacja wymaga warstwy API obsługującej autentykację JWT, walidację danych wejściowych, mapowanie encji na DTO oraz kontrolę dostępu opartą na rolach (USER/ADMIN). Każdy z tych elementów musi być spójnie zintegrowany - luźno sklejone biblioteki w Node.js/Express wymagałyby ręcznej integracji i konfiguracji, co zwiększa ryzyko błędów i niespójności. |
| **Alternatywy** | Node.js/Express (ten sam język co frontend, lżejszy, ale brak wbudowanego DI i security), Django REST Framework (Python, szybkie prototypowanie, ale inny język niż reszta projektu). |
| **Uzasadnienie** | Spring Boot oferuje kompletny, spójny ekosystem gdzie Spring Security, Spring Data JPA, Bean Validation i springdoc-openapi działają razem bez dodatkowej konfiguracji. `@PreAuthorize("hasRole('ADMIN')")` na poziomie metody, automatyczna walidacja przez `@Valid`, generowanie Swaggera z adnotacji kontrolerów. Java 21 z silnym typowaniem eliminuje całą klasę błędów runtime które w JavaScript ujawniają się dopiero w produkcji.
| **Trade-offy** | Większy boilerplate niż Express, każdy endpoint wymaga kontrolera, serwisu, repozytorium i DTO. Czas startu aplikacji większy niż dla Node.js. Obraz Docker większy przez JVM. |

## ADR-002: PostgreSQL

| **Decyzja** | PostgreSQL 16 jako relacyjna baza danych. |
| :- | :- |
| **Kontekst** | Aplikacja posiada złożone, wzajemne relacje między encjami: użytkownik składa zamówienia zawierające pozycje powiązane z książkami, ten sam użytkownik ma koszyk i półkę również powiązane z książkami. Integralność tych danych jest wymagana, nie możemy dopuścić do sytuacji gdzie istnieje pozycja zamówienia bez zamówienia, albo wpis na półce dla usuniętej książki. |
| **Alternatywy** | MongoDB (elastyczny schemat dokumentowy, brak relacji), MySQL (popularniejszy w hostingu, ale słabsze wsparcie dla zaawansowanych typów i window functions), SQLite (zero konfiguracji, ale brak prawdziwej współbieżności przy wielu połączeniach). |
| **Uzasadnienie** | Dane są silnie ustrukturyzowane i powiązane - idealny przypadek dla bazy relacyjnej. PostgreSQL wymusza integralność przez foreign keys z `ON DELETE CASCADE` (usunięcie użytkownika usuwa jego koszyk i półkę), constraint `UNIQUE(user_id, book_id)` na poziomie bazy zapobiega duplikatom niezależnie od logiki aplikacji.
| **Trade-offy** | Wymaga zdefiniowanego schematu z góry - każda zmiana struktury to migracja. Bardziej złożona konfiguracja niż SQLite. Wymaga osobnego kontenera Docker z healthcheckiem. |

---

## ADR-003: JWT

| **Decyzja** | JWT (JSON Web Token) podpisany HMAC-SHA256, weryfikowany przez Spring Security przy każdym żądaniu. |
| :- | :- |
| **Kontekst** | Aplikacja ma architekturę SPA + REST API - frontend (React) i backend (Spring Boot) działają na osobnych serwerach. |
| **Alternatywy** | Sesje HTTP z Redis (stateful, wymaga dodatkowego serwisu), OAuth2/OIDC z zewnętrznym providerem (Google, GitHub - eliminuje zarządzanie hasłami, ale wprowadza zewnętrzną zależność i overkill dla projektu), Basic Auth (brak możliwości wylogowania bez zmiany hasła). |
| **Uzasadnienie** | JWT jest stateless - cała informacja o użytkowniku (email, rola) jest zakodowana w tokenie. Backend weryfikuje podpis kryptograficzny bez odpytywania bazy przy każdym żądaniu. `JwtAuthenticationFilter` w łańcuchu Spring Security przechwytuje każde żądanie, ekstrahuje email z tokenu i ustawia kontekst bezpieczeństwa - `SecurityContextHolder.getContext().getAuthentication()` w serwisach daje dostęp do zalogowanego użytkownika bez przekazywania go przez parametry. Token zawiera rolę użytkownika, co umożliwia `@PreAuthorize("hasRole('ADMIN')")` bez odpytywania bazy. |
| **Trade-offy** | Token nie może być unieważniony przed wygaśnięciem (brak blacklisty). Wymaga krótkiego TTL (24h) dla bezpieczeństwa. Większy payload niż session cookie.  |

---

## ADR-004: Flyway

| **Decyzja** | Flyway jako narzędzie do wersjonowania i wykonywania migracji schematu. |
| :- | :- |
| **Kontekst** | Schemat bazy danych ewoluował przez cały projekt — dodawano tabele (cart_items, orders, shelf_entries), kolumny (street, city, postal_code w orders) - potrzebowaliśmy kontroli wersji dla zmian schematu.  |
| **Alternatywy** | Hibernate `ddl-auto: create-drop` (wygodne w developmencie, ale destruktywne - niszczy dane przy restarcie), ręczne skrypty SQL (brak historii, łatwo o błąd kolejności). |
| **Uzasadnienie** | Flyway wykonuje migracje automatycznie przy starcie aplikacji w kolejności wersji (V1, V2, ...). Migracje są niezmienne - każda zmiana to nowy plik. Integruje się natywnie ze Spring Boot. Pliki SQL są czytelne i łatwe do review. |
| **Trade-offy** | Migracje są nieodwracalne - raz wykonanego pliku nie można edytować. Każda korekta wymaga nowej migracji, co przy częstych zmianach schematu w fazie prototypowania generuje wiele małych plików. |

---

## ADR-005: React + TypeScript + Vite

| **Decyzja** | React 19 z TypeScript, Vite jako bundler, shadcn/ui + Tailwind CSS jako warstwa UI. |
| :- | :- |
| **Kontekst** | Frontend musi komunikować się z REST API, zarządzać stanem autentykacji (token JWT), cachować dane z serwera (katalog książek, koszyk, półka) i obsługiwać routing po stronie klienta. Interfejs ma wiele interaktywnych elementów - filtrowanie katalogu, edycja półki inline, paginacja, toasty. |
| **Alternatywy** | Next.js (SSR/SSG, lepsze SEO - zbędne dla aplikacji za loginem, dodatkowa złożoność deploymentu), Vue 3 (prostszy, Composition API podobne do React Hooks, ale mniejszy ekosystem komponentów), Angular (silnie typowany, kompletny framework, ale ogromny boilerplate i steep learning curve). |
| **Uzasadnienie** | React z TypeScript daje pełną kontrolę nad typami danych przepływających między API a komponentami - interfejsy `BookResponse`, `OrderResponse`, `ShelfEntryResponse` są współdzielone przez całą warstwę frontendu. Vite zapewnia natychmiastowy HMR podczas developmentu. shadcn/ui kopiuje komponenty bezpośrednio do projektu (nie są zależnością npm) - można je dowolnie modyfikować. Tailwind eliminuje potrzebę pisania CSS od nowa. |
| **Trade-offy** | Brak SSR - słabsze SEO (nieistotne dla aplikacji wymagającej logowania). React sam w sobie nie narzuca struktury projektu, wymaga świadomych decyzji o podział odpowiedzialności. Tailwind generuje duże pliki CSS w trybie dev. |

---

## ADR-006: TanStack Query

| **Decyzja** | TanStack Query v5 (React Query) do fetchowania, cachowania i synchronizacji danych z API. |
| :- | :- |
| **Kontekst** | Aplikacja wykonuje wiele zapytań do API których dane są ze sobą powiązane - dodanie do koszyka powinno odświeżyć licznik w Navbar, zakup powinien odświeżyć koszyk i półkę jednocześnie. Bez dedykowanego narzędzia zarządzanie tym ręcznie przez `useEffect` i `useState` prowadzi do race conditions i niespójności. |
| **Alternatywy** | Redux Toolkit Query (większy boilerplate, bardziej złożony), SWR (prostszy, mniej funkcji). |
| **Uzasadnienie** | React Query separuje "stan serwera" (dane z API, mają swoje TTL i mogą być nieaktualne) od "stanu UI" (co jest otwarte, co jest zaznaczone). `queryKey` jako tablica parametrów pozwala cache'ować każdą kombinację filtrów katalogu osobno - powrót na poprzednią stronę katalogu serwuje dane z cache natychmiast. `invalidateQueries({ queryKey: ['cart'] })` po dodaniu do koszyka odświeża wszystkie komponenty subskrybowane na ten klucz - Navbar, CartPage i CheckoutPage synchronicznie. |
| **Trade-offy** | Dodatkowa koncepcja `queryKey` do zrozumienia - nieprawidłowy klucz prowadzi do nieodświeżania danych po mutacji. Cache może serwować nieaktualne dane jeśli ktoś inny zmodyfikował zasób (np. admin usunął książkę którą użytkownik ma w koszyku). |
