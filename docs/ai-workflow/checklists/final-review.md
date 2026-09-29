# Checklista finalnego review projektu lub wydania

## 1. Zakres i produkt

- [ ] Każde wymaganie MVP ma działającą implementację albo jawną decyzję o
      wyłączeniu.
- [ ] Każde kryterium akceptacji zostało sprawdzone.
- [ ] Nie dodano nieuzgodnionych funkcji ani zachowań po MVP.
- [ ] Podstawowy przepływ można ukończyć bez wiedzy technicznej.
- [ ] Stany puste, błędy, anulowanie i powrót po przerwaniu działają poprawnie.
- [ ] Wygląd i UX uzyskały akceptację człowieka, jeśli projekt ma interfejs.

## 2. Dane, bezpieczeństwo i odporność

- [ ] Dane wejściowe i trwałe są walidowane.
- [ ] Błędy zewnętrznych usług lub storage nie powodują niekontrolowanej utraty
      stanu.
- [ ] Uprawnienia i granice dostępu są zgodne ze specyfikacją.
- [ ] Sekrety i dane prywatne nie znajdują się w kodzie, logach ani historii.
- [ ] Operacje destrukcyjne mają właściwe zabezpieczenia.
- [ ] Migracja, kopia zapasowa lub możliwość wycofania zostały sprawdzone, jeśli
      dotyczą wydania.

## 3. Jakość techniczna

- [ ] Kod ma czytelne granice odpowiedzialności.
- [ ] Nie istnieją dwie konkurencyjne implementacje tej samej reguły.
- [ ] Nie pozostał martwy kod, wykorzystany spike ani tymczasowy przełącznik.
- [ ] Nowe zależności są potrzebne i świadomie wybrane.
- [ ] Nie ma abstrakcji bez bieżącego konsumenta.
- [ ] Dokument techniczny opisuje faktyczną architekturę.

## 4. Testy i weryfikacja

- [ ] Lint, typecheck i formatowanie przechodzą.
- [ ] Testy jednostkowe i integracyjne przechodzą.
- [ ] Build produkcyjny przechodzi.
- [ ] E2E obejmuje krytyczne przepływy, ale nie zastępuje testów niższego
      poziomu.
- [ ] Ręcznie wykonano pełny scenariusz akceptacyjny.
- [ ] Najbardziej ryzykowne zachowanie zostało samodzielnie odtworzone przez
      reviewera, a nie tylko wywnioskowane z testów.
- [ ] Pominięte kontrole i pozostałe ryzyka są jawne.

## 5. Niezależne review

- [ ] Reviewer porównał kod z `SPEC.md`, dokumentem technicznym i planem.
- [ ] Reviewer sprawdził diff oraz uruchomił adekwatne kontrole.
- [ ] Raport zawiera werdykt i osobną sekcję decyzji dla człowieka.
- [ ] Wszystkie problemy blokujące rozwiązano.
- [ ] Dla ryzykownego wydania wykonano drugie, eksploracyjne przejście inną
      metodą niż pierwsze review.

## 6. Wdrożenie i operacje

- [ ] Środowisko docelowe używa właściwych wersji i konfiguracji.
- [ ] Zmienne środowiskowe oraz sekrety są kompletne i właściwie ograniczone.
- [ ] Wdrożenie nie zależy od lokalnych, niecommitowanych plików.
- [ ] Logi wdrożenia nie zawierają niewyjaśnionych błędów ani ostrzeżeń.
- [ ] Smoke test docelowego adresu przeszedł.
- [ ] Sprawdzono konsolę, sieć, dane trwałe i zachowanie po odświeżeniu, jeśli
      dotyczą projektu.
- [ ] Istnieje sposób wycofania albo odtworzenia poprzedniej wersji, gdy jest
      potrzebny.

## 7. Zamknięcie procesu

- [ ] Issues i milestone'y odpowiadają faktycznemu stanowi.
- [ ] Dokumentacja uruchomienia i wdrożenia jest aktualna.
- [ ] Tymczasowe branche, worktree, serwery i artefakty są uporządkowane.
- [ ] Świadomie odłożone problemy znajdują się w osobnym backlogu.
- [ ] Pomysły po MVP nie są przedstawiane jako brak ukończenia bieżącego wydania.
- [ ] Końcowy werdykt brzmi jednoznacznie: `READY`, `CONDITIONAL` albo
      `NOT READY`.
- [ ] Każdy warunek werdyktu `CONDITIONAL` ma właściciela i termin decyzji.

## 8. Krótka retrospektywa

- [ ] Zapisano, co przyspieszyło pracę.
- [ ] Zapisano, co wymagało ręcznej interwencji.
- [ ] Zidentyfikowano problemy pominięte przez testy lub review.
- [ ] Usunięto z workflow instrukcje, które nie dały realnej wartości.
- [ ] Dodano najwyżej kilka konkretnych usprawnień do następnego projektu.
