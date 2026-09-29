# Zasady pracy nad projektem

Ten plik zawiera trwałe zasady współpracy. Wymagania produktu należą do
`SPEC.md`, decyzje techniczne do `STACK.md`, a bieżący zakres do `PLAN.md` lub
Issue. Nie duplikuj ich tutaj.

## Źródła prawdy

- Przy zmianie zachowania produktu korzystaj z `SPEC.md`.
- Przy zmianie architektury, danych, zależności lub wdrożenia korzystaj ze
  `STACK.md` albo właściwego dokumentu technicznego.
- Kolejność i zależności wynikają z `PLAN.md` oraz trackera zadań.
- Dla drobnej zmiany czytaj tylko dokumenty potrzebne do oceny jej wpływu.
- Gdy źródła są sprzeczne, zatrzymaj się i poproś o decyzję.

## Zakres i prostota

- Realizuj bieżące zadanie oraz konieczne testy i dokumentację.
- Wybieraj najprostsze rozwiązanie spełniające zatwierdzone wymagania.
- Nie dodawaj funkcji po MVP, przyszłościowych abstrakcji ani infrastruktury bez
  bieżącej potrzeby.
- Nową zależność uzasadnij wartością, której nie daje używany stos ani mały,
  czytelny fragment własnego kodu.
- Zachowuj cudze zmiany i nie poprawiaj przy okazji niezwiązanych plików.

## Decyzje człowieka

Zatrzymaj się, gdy zmiana:

- wpływa na zakres produktu, UX lub wygląd;
- wymaga zmiany `SPEC.md`;
- zmienia własność, format lub trwałość danych;
- wprowadza istotną zależność albo trudną do odwrócenia architekturę;
- znacząco zwiększa koszt lub zakres;
- wymaga świadomego zaakceptowania istotnego ryzyka;
- jest destrukcyjna albo trudna do odwrócenia.

Nie zatrzymuj się przy rutynowych, bezpiecznych krokach implementacji,
testowania, review i Git, jeśli mieszczą się w zatwierdzonym zadaniu.

## Autonomiczna pętla

Dla zatwierdzonego zadania samodzielnie:

1. sprawdź zależności i stan repozytorium;
2. zaimplementuj zmianę wraz z testami;
3. uruchom weryfikację odpowiednią do ryzyka;
4. uzyskaj niezależne review, jeśli jest wymagane;
5. popraw uwagi blokujące i ponownie sprawdź wynik;
6. wykonaj commit, push i merge, gdy spełnione są warunki poniżej;
7. zaktualizuj dokumentację i tracker oraz usuń tymczasowe artefakty.

Człowiek nie powinien obserwować tych kroków. Zgłoś się wcześniej tylko z
rzeczywistą decyzją albo blokerem.

## Git i wielu agentów

- Znaczące zmiany realizuj na osobnym branchu lub worktree.
- Drobne zmiany niskiego ryzyka można grupować.
- Nie rozpoczynaj zadania blokowanego przez nieukończoną zależność.
- Zadania równoległe muszą mieć stabilne granice, możliwie rozłączne obszary i
  jednego właściciela integracji.
- Po integracji równoległych zmian uruchom testy wspólnego przepływu.
- Spike musi mieć kryterium zakończenia i plan usunięcia albo świadomego
  przekształcenia w kod produkcyjny.

## Weryfikacja

- **Poziom 1 — mała zmiana:** testy obszaru, lint, typecheck, formatowanie i
  inspekcja diffu.
- **Poziom 2 — funkcja lub istotna poprawka:** pełne testy jednostkowe i
  integracyjne, build, adekwatny test zachowania oraz niezależne review.
- **Poziom 3 — milestone lub wydanie:** pełna bramka, krytyczne E2E, ręczny
  scenariusz, review zgodności i smoke test środowiska docelowego.

Polecenia projektu:

- testy obszaru: `<polecenie>`;
- pełne testy: `<polecenie>`;
- lint: `<polecenie>`;
- typecheck: `<polecenie albo nie dotyczy>`;
- format check: `<polecenie>`;
- build: `<polecenie>`;
- E2E: `<polecenie albo nie dotyczy>`.

Nie deklaruj powodzenia na podstawie niewykonanej kontroli. Podaj pominięte
kontrole i pozostałe ryzyko.

## Niezależne review i merge

Review w osobnym kontekście jest wymagane dla poziomów 2 i 3 oraz zmian
bezpieczeństwa, danych, uprawnień, prywatności, współbieżności, krytycznej
dostępności, migracji i ryzykownych integracji.

Raport review zaczyna się od werdyktu `APPROVE`, `REQUEST CHANGES` albo
`HUMAN DECISION`, a następnie podaje decyzje dla człowieka, problemy blokujące,
wykonaną weryfikację i najwyżej kilka uwag nieblokujących.

Możesz wykonać merge bez kolejnego potwierdzenia, gdy:

- wszystkie wymagane kontrole przeszły;
- wymagane review zakończyło się `APPROVE`;
- rozwiązano wszystkie problemy blokujące;
- branch jest aktualny i mergeowalny;
- nie ma otwartej decyzji dla człowieka;
- zmiana nie wprowadza niezatwierdzonego zakresu, UX ani wyglądu.

Po merge'u zaktualizuj Issue i milestone oraz zatrzymaj zbędne procesy.

## Raport końcowy

Podaj kolejno: rezultat, decyzje dla człowieka, wyniki kontroli, werdykt review,
aktualne ryzyka oraz stan merge'u, zadania i wdrożenia. Nie ukrywaj ważnego
ryzyka w środku długiego opisu.

## Bezpieczeństwo

- Nie zapisuj sekretów ani prywatnych danych w kodzie, testach, logach i
  dokumentacji.
- Traktuj dane wejściowe i trwałe jako niezaufane.
- Nie osłabiaj walidacji, typowania, bezpieczeństwa, dostępności ani testów.
- Operacje destrukcyjne wymagają potwierdzenia dokładnego zakresu.

## Uzupełnienia projektu

Dopisz tylko trwałe informacje specyficzne dla repozytorium: stos i wersje,
lokalizację dokumentacji, zasady danych oraz sposób wdrożenia i smoke testu.
