# Bookstore

BookStore to aplikacja łącząca księgarnię internetową z osobistą biblioteką. Uzytkownik przegląda katalog, kupuje ksiązki przez symulowany checkout z płatnością kartą, a po zakupie ksiązki trafiają automatycznie na jego półkę, gdzie śledzi postęp czytania i pisze recenzje.

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

Dokumentacja aplikacji znajduje się [tutaj](https://github.com/ourcookiestuff/bookstore-app/tree/main/dokumentacja)