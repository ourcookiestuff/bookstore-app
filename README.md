# Bookstore

## Uruchomienie

Aby uruchomić aplikację, należy w głównym folderze projektu wykonać komendę:
```bash
docker compose up --build -d
```
Aplikacja będzie dostępna pod adresem: `http://localhost:5173/`

Aby uruchomić seeding po inicjacji nalezy wykonać komendę:
```bash
docker compose --profile seed run --rm --build seeder
```

## Dokumentacja

Dokumentacja aplikacji znajduje się [tutaj](https://github.com/ourcookiestuff/bookstore-app/blob/main/dokumentacja/README.md)