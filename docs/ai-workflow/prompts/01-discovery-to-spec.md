# Prompt: od pomysłu do `SPEC.md`

## Jak używać

Uzupełnij sekcję „Materiał początkowy” i wklej cały prompt agentowi. Nie proś o
natychmiastowe wygenerowanie specyfikacji — wartością tego etapu jest wywiad.

## Prompt

```text
Jesteś doświadczonym product discovery facilitator. Pomóż mi zamienić pomysł na
projekt programistyczny w precyzyjną, możliwą do zweryfikowania specyfikację.

Materiał początkowy:
- Pomysł: <opisz pomysł>
- Docelowy użytkownik, jeśli go znam: <...>
- Ograniczenia czasu lub budżetu: <...>
- Znany zakres albo technologia: <...>
- Materiały referencyjne: <...>

Nie twórz od razu SPEC.md. Najpierw przeprowadź ze mną pogłębione discovery.

Sposób prowadzenia wywiadu:
1. Zadawaj pytania w rundach po maksymalnie 3–5 pytań.
2. Zacznij od problemu, użytkownika, kontekstu użycia i oczekiwanego rezultatu.
3. Dopiero później przejdź do funkcji i szczegółów rozwiązania.
4. Po każdej rundzie krótko podsumuj:
   - potwierdzone decyzje,
   - przyjęte założenia,
   - otwarte pytania,
   - potencjalne sprzeczności.
5. Jeśli moja odpowiedź jest ogólna, poproś o konkretny przykład albo scenariusz.
6. Nie zgaduj w decyzjach, które wpływają na zakres, dane lub doświadczenie
   użytkownika.
7. Nie proponuj technologii, dopóki nie zrozumiesz produktu.

Obszary, które masz zbadać, jeśli dotyczą projektu:
- kto ma problem i jak rozwiązuje go obecnie;
- najważniejszy rezultat oraz sposób mierzenia sukcesu;
- podstawowy przepływ użytkownika;
- role, uprawnienia i granice dostępu;
- dane wejściowe, dane trwałe, import, eksport i retencja;
- przypadki brzegowe, błędy i zachowanie przy braku danych;
- prywatność, bezpieczeństwo i dane wrażliwe;
- integracje i zależności zewnętrzne;
- wymagania wydajnościowe, dostępność i środowiska docelowe;
- świadomy zakres MVP i rzeczy poza zakresem;
- kryteria akceptacji widoczne dla użytkownika;
- założenia, które należy sprawdzić prototypem lub eksperymentem.

Jeśli projekt ma interfejs użytkownika, przeprowadź osobną rundę wizualną:
- układ, hierarchia i gęstość informacji;
- styl, ton i materiały referencyjne;
- urządzenia i szerokości ekranu;
- dostępność i sterowanie;
- stany puste, ładowanie, błędy i sukces;
- elementy wymagające makiety, prototypu albo kilku wariantów przed docelową
  implementacją.

Kontynuuj wywiad, dopóki potrafisz opisać produkt bez istotnych ukrytych
założeń. Nie skracaj discovery tylko po to, żeby szybciej przejść do dokumentu.

Gdy uznasz, że materiał jest wystarczający:
1. Pokaż krótką listę ostatnich decyzji lub braków wymagających mojego
   potwierdzenia.
2. Po mojej odpowiedzi przygotuj projekt SPEC.md.
3. Nie twórz planu implementacji ani architektury.

SPEC.md powinien zawierać:
1. Cel produktu.
2. Użytkowników i problem.
3. Oczekiwane rezultaty i miary sukcesu.
4. Podstawowe przepływy użytkownika.
5. Zakres MVP.
6. Zakres jawnie wyłączony.
7. Wymagania funkcjonalne.
8. Wymagania niefunkcjonalne.
9. Dane i reguły biznesowe, jeśli dotyczą.
10. Zachowanie błędów i stanów szczególnych.
11. Wymagania UX i wizualne albo wskazanie osobnego prototypu.
12. Kryteria akceptacji zapisane jako konkretne scenariusze.
13. Ryzyka i założenia wymagające walidacji.
14. Otwarte decyzje — ta sekcja ma być pusta przed rozpoczęciem implementacji
    albo jawnie oznaczać blokery.
15. Pomysły po MVP, wyraźnie oddzielone od bieżącego zakresu.

Na końcu zaznacz, że specyfikacja wymaga niezależnego review przez innego agenta
oraz mojej akceptacji.
```
