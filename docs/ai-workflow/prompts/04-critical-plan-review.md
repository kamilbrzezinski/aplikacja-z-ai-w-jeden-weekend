# Prompt: krytyczne review planu

## Jak używać

Przekaż plan innemu agentowi lub uruchom osobną, niezależną sesję. Reviewer nie
powinien być autorem planu ani zakładać, że dotychczasowe decyzje są poprawne.

## Prompt

```text
Wykonaj krytyczne review PLAN.md przed rozpoczęciem implementacji. Twoim celem
nie jest rozbudowanie planu, lecz znalezienie prostszej drogi do spełnienia
SPEC.md.

Materiały:
- SPEC.md: <ścieżka lub treść>
- STACK.md/TECHNICAL_DESIGN.md: <ścieżka lub treść>
- PLAN.md: <ścieżka lub treść>
- Istniejące repozytorium, jeśli dotyczy: <ścieżka>

Nie implementuj kodu, nie zmieniaj plików i nie twórz Issues.

Sprawdź:
1. Czy każde zadanie wynika z zatwierdzonego zakresu.
2. Czy plan zawiera scope creep albo funkcje „przy okazji”.
3. Czy architektura lub kolejność prowadzą do overengineeringu.
4. Czy powstają abstrakcje, infrastruktura lub zależności bez bieżącego
   konsumenta.
5. Czy plan duplikuje mechanizmy już dostępne w stosie albo repozytorium.
6. Czy zadania są odpowiedniej wielkości i kończą się sprawdzalnym rezultatem.
7. Czy zależności są prawdziwe, a kolejność minimalizuje koszt przeróbek.
8. Czy największe ryzyka są walidowane odpowiednio wcześnie.
9. Czy spike'i mają konkretne pytanie i plan usunięcia kodu eksperymentalnego.
10. Czy kryteria akceptacji mierzą zachowanie, a nie sam fakt napisania kodu.
11. Czy testowanie jest proporcjonalne do ryzyka, bez przenoszenia całego ciężaru
    do E2E.
12. Czy zadania równoległe mają stabilne granice i nie będą stale edytować tych
    samych plików.
13. Czy projekt z UI ma punkt akceptacji wizualnej przed docelową implementacją.
14. Czy plan wskazuje momenty wymagające decyzji człowieka.
15. Czy definicja ukończenia obejmuje także dokumentację, tracker i usunięcie
    tymczasowych artefaktów.

Spróbuj usunąć lub połączyć zadania. Dla każdego proponowanego elementu zadaj
pytanie: „Co się stanie, jeśli tego nie zrobimy w bieżącym wydaniu?”.

Zwróć raport w formacie:

## Werdykt
APPROVE albo REVISE.

## Decyzje wymagane od człowieka
Tylko decyzje produktowe, wizualne, trudne do odwrócenia albo dotyczące
świadomego ryzyka. Jeśli brak, napisz „Brak”.

## Problemy blokujące rozpoczęcie implementacji
Dla każdego: dowód, wpływ i najmniejsza poprawka planu.

## Proponowane uproszczenia
Co usunąć, połączyć lub odłożyć oraz dlaczego.

## Brakujące elementy konieczne
Tylko rzeczy wymagane przez SPEC.md, bezpieczeństwo albo możliwość weryfikacji.

## Ocena kolejności i równoległości
Konflikty zależności, obszary możliwe do równoległej pracy i właściciel
integracji.

## Minimalny skorygowany plan
Podaj go tylko wtedy, gdy werdykt to REVISE. Nie przepisuj bez potrzeby części,
które są poprawne.

Uwagi opcjonalne umieść na końcu i ogranicz do maksymalnie trzech. Nie zamieniaj
review w nowy backlog funkcji.
```
