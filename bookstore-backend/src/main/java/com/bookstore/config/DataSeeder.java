package com.bookstore.config;

import com.bookstore.model.*;
import com.bookstore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.ArrayList;
import java.util.Collections;

@Component
@Profile("seed")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ShelfEntryRepository shelfEntryRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Override
    public void run(String... args) {
        System.out.println("=== Rozpoczynam seeding danych ===");

        seedBooks();
        List<User> users = seedUsers();
        List<Book> books = bookRepository.findAll();
        seedShelfEntries(users, books);

        System.out.println("=== Seeding zakończony ===");
    }

    private void seedBooks() {
        List<Object[]> books = List.of(
            new Object[]{"Hobbit", "J.R.R. Tolkien", "Przygoda Bilba Bagginsa w świecie Śródziemia.", new BigDecimal("34.99"), "https://covers.openlibrary.org/b/isbn/9780261102217-L.jpg", "9780261102217", "Fantasy", 310, 20},
            new Object[]{"Władca Pierścieni: Drużyna Pierścienia", "J.R.R. Tolkien", "Pierwsza część epickiej trylogii.", new BigDecimal("49.99"), "https://covers.openlibrary.org/b/isbn/9780261103573-L.jpg", "9780261103573", "Fantasy", 423, 15},
            new Object[]{"Nowe Szaty Cesarza", "Andrzej Sapkowski", "Kolejna część sagi o Wiedźminie.", new BigDecimal("39.99"), "https://covers.openlibrary.org/b/isbn/9788373198029-L.jpg", "9788373198029", "Fantasy", 352, 12},
            new Object[]{"Diuna: Mesjasz", "Frank Herbert", "Druga część sagi Diuny.", new BigDecimal("44.99"), "https://covers.openlibrary.org/b/isbn/9780441172696-L.jpg", "9780441172696", "Science Fiction", 256, 8},
            new Object[]{"Rok 1984", "George Orwell", "Dystopia o totalitarnym państwie.", new BigDecimal("29.99"), "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg", "9780451524936", "Dystopia", 328, 18},
            new Object[]{"Nowy wspaniały świat", "Aldous Huxley", "Wizja przyszłości gdzie ludzie są warunkowani.", new BigDecimal("32.99"), "https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg", "9780060850524", "Dystopia", 311, 14},
            new Object[]{"Mistrz i Małgorzata", "Michaił Bułhakow", "Satyra na sowieckie społeczeństwo.", new BigDecimal("38.99"), "https://covers.openlibrary.org/b/isbn/9788308060469-L.jpg", "9788308060469", "Klasyka", 480, 10},
            new Object[]{"Zbrodnia i kara", "Fiodor Dostojewski", "Powieść psychologiczna o zbrodni.", new BigDecimal("34.99"), "https://covers.openlibrary.org/b/isbn/9788308060445-L.jpg", "9788308060446", "Klasyka", 640, 9},
            new Object[]{"Sto lat samotności", "Gabriel García Márquez", "Magiczny realizm w Ameryce Łacińskiej.", new BigDecimal("42.99"), "https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg", "9780060883287", "Klasyka", 417, 11},
            new Object[]{"Proces", "Franz Kafka", "Absurdalna historia człowieka oskarżonego o nieznane przestępstwo.", new BigDecimal("27.99"), "https://covers.openlibrary.org/b/isbn/9780805209990-L.jpg", "9780805209990", "Klasyka", 255, 13},
            new Object[]{"Foundation", "Isaac Asimov", "Upadek galaktycznego imperium.", new BigDecimal("44.99"), "https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg", "9780553293357", "Science Fiction", 244, 16},
            new Object[]{"Hyperion", "Dan Simmons", "Epicka science fiction w świecie przyszłości.", new BigDecimal("49.99"), "https://covers.openlibrary.org/b/isbn/9780553283686-L.jpg", "9780553283686", "Science Fiction", 482, 7},
            new Object[]{"Neuromancer", "William Gibson", "Klasyka cyberpunku.", new BigDecimal("36.99"), "https://covers.openlibrary.org/b/isbn/9780441569595-L.jpg", "9780441569595", "Science Fiction", 271, 10},
            new Object[]{"Zbrodnia Czarnego Rycerza", "Andrzej Pilipiuk", "Polska fantasy historyczna.", new BigDecimal("32.99"), null, "9788375742410", "Fantasy", 312, 15},
            new Object[]{"Metro 2033", "Dmitry Glukhovsky", "Postapokaliptyczna Moskwa.", new BigDecimal("37.99"), "https://covers.openlibrary.org/b/isbn/9788374692908-L.jpg", "9788374692908", "Science Fiction", 458, 12},
            new Object[]{"Wiedźmin: Miecz Przeznaczenia", "Andrzej Sapkowski", "Drugi zbiór opowiadań o Geralcie.", new BigDecimal("39.99"), "https://covers.openlibrary.org/b/isbn/9788373198012-L.jpg", "9788373198012", "Fantasy", 352, 18},
            new Object[]{"Władca Pierścieni: Dwie Wieże", "J.R.R. Tolkien", "Druga część trylogii.", new BigDecimal("49.99"), "https://covers.openlibrary.org/b/isbn/9780261102361-L.jpg", "9780261102361", "Fantasy", 352, 14},
            new Object[]{"Władca Pierścieni: Powrót Króla", "J.R.R. Tolkien", "Finał epickiej trylogii.", new BigDecimal("49.99"), "https://covers.openlibrary.org/b/isbn/9780261102378-L.jpg", "9780261102378", "Fantasy", 416, 14},
            new Object[]{"Czarownice z Lochaber", "Terry Pratchett", "Komediowa fantasy ze Świata Dysku.", new BigDecimal("33.99"), null, "9788375742527", "Fantasy", 284, 11},
            new Object[]{"Atlasówka", "Ayn Rand", "Filozoficzna powieść o kapitalizmie.", new BigDecimal("54.99"), null, "9780452011878", "Klasyka", 1168, 6},
            new Object[]{"Wiedźmin: Ostatnie życzenie", "Andrzej Sapkowski", "Zbiór opowiadań o wiedźminie Geralcie z Rivii.", new BigDecimal("39.99"), "https://covers.openlibrary.org/b/isbn/9788375780635-L.jpg", "9788375780635", "Fantasy", 288, 15},
            new Object[]{"Pan Tadeusz", "Adam Mickiewicz", "Epopeja narodowa, arcydzieło polskiej literatury romantycznej.", new BigDecimal("24.99"), "https://covers.openlibrary.org/b/isbn/9788307004525-L.jpg", "9788307004525", "Klasyka", 384, 20},
            new Object[]{"Harry Potter i Kamień Filozoficzny", "J.K. Rowling", "Pierwsza część przygód młodego czarodzieja Harry'ego Pottera.", new BigDecimal("39.99"), "https://covers.openlibrary.org/b/isbn/8372780110-L.jpg", "8372780110", "Fantasy", 328, 25}
        );

        int added = 0;
        for (Object[] b : books) {
            String isbn = (String) b[5];
            if (bookRepository.findAll().stream().noneMatch(book -> isbn.equals(book.getIsbn()))) {
                bookRepository.save(Book.builder()
                        .title((String) b[0])
                        .author((String) b[1])
                        .description((String) b[2])
                        .price((BigDecimal) b[3])
                        .coverImageUrl((String) b[4])
                        .isbn(isbn)
                        .genre((String) b[6])
                        .pages((Integer) b[7])
                        .stock((Integer) b[8])
                        .build());
                added++;
            }
        }
        System.out.println("Dodano " + added + " nowych książek");
    }

    private List<User> seedUsers() {
        String[] emails = {
                "anna.kowalska@example.com",
                "jan.nowak@example.com",
                "maria.wisniewska@example.com",
                "piotr.zielinski@example.com",
                "kasia.lewandowska@example.com"
        };

        return List.of(emails).stream()
                .map(email -> userRepository.findByEmail(email)
                        .orElseGet(() -> userRepository.save(User.builder()
                                .email(email)
                                .password(passwordEncoder.encode("password123"))
                                .role(Role.USER)
                                .build())))
                .toList();
    }

    private void seedShelfEntries(List<User> users, List<Book> books) {
        String[] reviews = {
                "Świetna książka, polecam każdemu!",
                "Nie do końca trafiła w mój gust, ale dobrze napisana.",
                "Jedna z lepszych pozycji jakie czytałem w tym roku.",
                "Trochę przegadana, ale fabuła wciąga.",
                "Klasyka która broni się latami.",
                "Zaskakujące zakończenie, czytałem jednym tchem.",
                "Solidna pozycja, choć nie bez wad.",
                "Absolutny must-read dla fanów gatunku.",
                "Rozczarowałem się, spodziewałem się więcej.",
                "Piękny język i świetnie zbudowane postacie."
        };

        ShelfStatus[] statuses = ShelfStatus.values();

        for (User user : users) {
            List<Book> shuffled = new ArrayList<>(books);
            Collections.shuffle(shuffled);
            int entriesCount = 3 + random.nextInt(5);

            for (int i = 0; i < Math.min(entriesCount, shuffled.size()); i++) {
                Book book = shuffled.get(i);

                if (shelfEntryRepository.findByUserAndBookId(user, book.getId()).isPresent()) {
                    continue;
                }

                ShelfStatus status = statuses[random.nextInt(statuses.length)];
                Integer rating = null;
                String review = null;
                Integer currentPage = 0;

                if (status == ShelfStatus.READ) {
                    rating = 3 + random.nextInt(3);
                    review = random.nextBoolean() ? reviews[random.nextInt(reviews.length)] : null;
                    currentPage = book.getPages() != null ? book.getPages() : 0;
                } else if (status == ShelfStatus.READING && book.getPages() != null) {
                    currentPage = 1 + random.nextInt(book.getPages());
                }

                shelfEntryRepository.save(ShelfEntry.builder()
                        .user(user)
                        .book(book)
                        .status(status)
                        .currentPage(currentPage)
                        .rating(rating)
                        .review(review)
                        .build());
            }
        }

        System.out.println("Dodano wpisy na półkach dla " + users.size() + " użytkowników");
    }
}