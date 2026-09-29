# Checklista implementacji

## Przed rozpoczęciem

- [ ] Rozumiem rezultat, zakres i kryteria akceptacji zadania.
- [ ] Sprawdziłem zależności i zadanie nie jest blokowane.
- [ ] Przeczytałem tylko właściwe źródła prawdy dla tej zmiany.
- [ ] Repozytorium nie zawiera cudzych zmian, które mógłbym nadpisać.
- [ ] Wybrałem poziom weryfikacji: 1, 2 albo 3.
- [ ] Decyzje produktowe, wizualne i trudne do odwrócenia są rozstrzygnięte.
- [ ] Dla znaczącej zmiany mam osobny branch lub worktree.
- [ ] Jeśli praca jest równoległa, granice plików i właściciel integracji są
      jasne.

## Podczas pracy

- [ ] Implementuję najprostsze rozwiązanie spełniające bieżące wymagania.
- [ ] Nie dodaję funkcji ani refaktoryzacji spoza zadania.
- [ ] Testuję zachowanie i przypadki brzegowe, nie tylko strukturę kodu.
- [ ] Aktualizuję dokumentację, gdy zmienia się kontrakt lub trwała decyzja.
- [ ] Nowa zależność ma zapisane uzasadnienie.
- [ ] Spike ma kryterium zakończenia i plan usunięcia.
- [ ] Zatrzymuję się, jeśli muszę zmienić specyfikację albo zaakceptować nowe
      ryzyko.

## Weryfikacja

### Poziom 1 — mała zmiana

- [ ] Testy zmienionego obszaru.
- [ ] Lint.
- [ ] Typecheck, jeśli dotyczy.
- [ ] Kontrola formatowania.
- [ ] Inspekcja diffu.

### Poziom 2 — funkcja lub istotna poprawka

- [ ] Pełne testy jednostkowe i integracyjne.
- [ ] Build.
- [ ] Adekwatny test przepływu użytkownika.
- [ ] Niezależne review.
- [ ] Poprawki po review i ponowne sprawdzenie.

### Poziom 3 — milestone lub wydanie

- [ ] Pełna bramka projektu.
- [ ] E2E krytycznych przepływów.
- [ ] Ręczny scenariusz akceptacyjny.
- [ ] Review zgodności ze specyfikacją.
- [ ] Niezależny audyt eksploracyjny, jeśli ryzyko to uzasadnia.
- [ ] Smoke test środowiska docelowego.

## Review i merge

- [ ] Reviewer podał jednoznaczny werdykt.
- [ ] Nie ma nierozstrzygniętych decyzji wymagających człowieka.
- [ ] Wszystkie uwagi blokujące są poprawione albo zasadnie odrzucone i ponownie
      zaakceptowane.
- [ ] Wymagane kontrole przechodzą po ostatniej poprawce.
- [ ] Branch jest aktualny i mergeowalny.
- [ ] Zmiana nie wprowadza niezatwierdzonego zakresu ani UX.
- [ ] Warunki automatycznego merge'u są spełnione.

## Po merge'u

- [ ] Issue oraz milestone odzwierciedlają rzeczywisty stan.
- [ ] Dokumentacja jest aktualna.
- [ ] Tymczasowy kod, pliki i procesy zostały usunięte lub świadomie zachowane.
- [ ] Nowe pomysły trafiły do osobnego backlogu, nie do ukończonego zakresu.
- [ ] Raport końcowy pokazuje wynik, kontrole, review i pozostałe ryzyka.
