# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Jedna osoba planująca swój tydzień na komputerze — zarówno zadania zawodowe, jak i prywatne. Nie współdzieli danych i nie dzieli zadań na projekty.

Aplikacja ma dwa rytmy użycia:

- **sesja planowania** — raz w tygodniu użytkownik zbiera zadania i przeciąga je na dni;
- **praca w ciągu tygodnia** — aplikacja jest otwierana na chwilę, aby odhaczyć wykonane zadanie albo przesunąć pojedyncze zadanie na inny dzień.

## Product Purpose

Zamienia ogólną listę zadań w plan tygodnia. Zwykła lista mówi, co zrobić; organizer pomaga zdecydować, kiedy, i od razu pokazuje obciążenie każdego dnia (czas zaplanowany i pozostały). Sukces: użytkownik w kilka minut rozkłada tydzień i w każdej chwili widzi, ile pracy zostało w danym dniu.

## Positioning

Świadome rozkładanie zadań na siedem stałych dni z widocznym obciążeniem czasowym, bez dat, godzin, projektów i automatyzacji. Prostota jest cechą produktu, nie brakiem.

## Operating Context

- Jeden ekran: lista „Do zaplanowania”, formularz dodawania nad nią i siedem kolumn dni (poniedziałek–niedziela) bez konkretnych dat.
- Przenoszenie przeciąganiem wskaźnikiem oraz dostępną akcją „Przenieś do…” z klawiatury.
- Dane wyłącznie w `localStorage` przeglądarki; brak backendu i synchronizacji.
- Projektowane przede wszystkim pod ekran komputera; na wąskim ekranie układ ma pozostać używalny.

## Capabilities and Constraints

- Zakres MVP i reguły biznesowe opisuje `SPEC.md`; stos i architekturę — `STACK.md`; zasady pracy — `AGENTS.md`.
- Czas zadania w minutach, wielokrotność 15, minimum 15. Priorytet: niski, średni (domyślny), wysoki.
- Poza zakresem: konta, daty i tygodnie, godziny, projekty, powiadomienia, eksport, funkcje AI, automatyczne planowanie.

## Brand Commitments

- Kolorystyka i typografia zgodne z serwisem [Skillweb](https://www.skillweb.pl/) w motywie jasnym i ciemnym: paleta slate z jednym akcentem bursztynowym, Inter dla tekstu, Space Grotesk dla nagłówków, JetBrains Mono dla etykiet.
- Przełącznik motywu: Automatyczny (domyślny), Jasny, Ciemny.
- Interfejs w języku polskim, spokojny i rzeczowy ton.

## Evidence on Hand

Brak materiałów marketingowych, opinii i danych użytkowników. Nie wymyślać ich.

## Product Principles

1. Plan ma być czytelny na pierwszy rzut oka: obciążenie dni ważniejsze niż ozdobniki.
2. Jedna akcja, jedno miejsce — bez powtórzeń i szumu na każdej karcie.
3. Dane użytkownika zostają w przeglądarce.
4. Każdą operację da się wykonać wskaźnikiem i klawiaturą.

## Accessibility & Inclusion

WCAG AA dla kontrastu tekstu w obu motywach. Priorytet czytelny nie tylko kolorem. Pełna obsługa z klawiatury, natywne `<dialog>` z przywracaniem fokusu.
