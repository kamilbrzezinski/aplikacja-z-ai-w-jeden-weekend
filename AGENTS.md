# Zasady pracy nad projektem

## Źródła prawdy

- Przed zmianą zapoznaj się z `SPEC.md` i `STACK.md`.
- Bieżący zakres i kolejność realizacji śledź w GitHub Issues i przypisanych kamieniach milowych. Przed rozpoczęciem zadania sprawdź jego zależności i nie rozpoczynaj pracy blokowanej przez nieukończone zadanie.
- Realizuj tylko zakres potrzebny do bieżącego zadania. Nie dodawaj funkcji spoza MVP bez zgody użytkownika.
- Jeśli wymagania, dokumentacja i istniejący kod są sprzeczne, nie zgaduj. Opisz konflikt i poproś użytkownika o decyzję.

## Technologie i architektura

- Używaj Reacta, TypeScriptu w trybie `strict`, Vite, Node.js LTS i npm.
- Stan aplikacji utrzymuj w `useReducer` i Context. Logikę biznesową oddzielaj od komponentów Reacta i zapisuj jako testowalne funkcje TypeScript.
- Do przeciągania używaj `@dnd-kit/react` i `@dnd-kit/helpers`, do walidacji danych z `localStorage` — Zod, a do stylów — CSS Modules i zmiennych CSS.
- Twórz małe komponenty o jednej odpowiedzialności. Używaj semantycznego HTML, powiązanych etykiet formularzy i interfejsu dostępnego z klawiatury.
- Nie dodawaj backendu, routingu, zewnętrznego API ani biblioteki zarządzania stanem, jeżeli użytkownik nie zmieni zakresu projektu.

## Stałe ustalenia implementacyjne

- Formatuj czas jako `0 min`, same minuty, pełne godziny albo połączenie, np. `30 min`, `2 godz.` i `1 godz. 30 min`.
- Czas zadania wprowadzaj przez pole liczbowe bez sztucznego maksimum, z `min="15"` i `step="15"`. Niezależnie waliduj wartości puste, ujemne, ułamkowe i niepodzielne przez 15.
- Formularz dodawania umieszczaj nad backlogiem, a edycję realizuj za pomocą natywnego elementu `<dialog>` z prawidłowym zamykaniem klawiszem `Esc` i przywracaniem fokusu.
- Używaj klucza `organizer-tygodnia:v1` dla danych w `localStorage`. Brak synchronizacji i rozwiązywania konfliktów między jednocześnie otwartymi kartami pozostaje poza zakresem MVP.
- `createdAt` pozostaje niezmienne. `updatedAt` aktualizuj przy edycji danych, zmianie statusu, przeniesieniu i zmianie kolejności; znacznik czasu przekazuj w akcji, aby reducer pozostał deterministyczny.
- Identyfikatory i znaczniki czasu generuj poza reducerem.

## Kontrakt przeciągania i zapisu

- Stan domenowy jest źródłem prawdy poza trwającym przeciąganiem. Na `onDragStart` zapisuj migawkę kolumn, a na `onDragOver` aktualizuj wyłącznie lokalny, przejściowy układ potrzebny do wizualizacji.
- Helper `move()` służy do przejściowej mechaniki interfejsu. Niezmienniki końcowego stanu utrzymuj w czystej funkcji domenowej.
- Anulowanie klawiszem `Esc` lub upuszczenie poza poprawnym celem odrzuca stan przejściowy i nie wysyła akcji do reducera.
- Poprawne upuszczenie wylicza docelową lokalizację i indeks, a następnie zatwierdza ruch jedną semantyczną akcją reducera. Nie zapisuj do `localStorage` podczas `onDragOver`; zapisuj dopiero stan zatwierdzony po upuszczeniu.
- Zweryfikuj obsługę DnD wskaźnikiem i klawiaturą, w tym ruch do pustej kolumny oraz anulowanie. Jeśli sensor klawiatury nie zapewnia niezawodnie wszystkich ruchów, dodaj dostępną akcję „Przenieś do…” korzystającą z tej samej operacji domenowej.

## Uruchamianie projektu

Po inicjalizacji projektu utrzymuj poniższe skrypty npm jako standardowy interfejs pracy:

```bash
npm install
npm run dev
npm test
npm run test:e2e
npm run lint
npm run typecheck
npm run build
```

- `npm run dev` uruchamia aplikację lokalnie.
- `npm test` uruchamia testy Vitest i React Testing Library.
- `npm run test:e2e` uruchamia testy Playwright w Chromium. Przy pierwszym użyciu może być potrzebne `npx playwright install chromium`.
- Jeśli skrypt jeszcze nie istnieje, dodaj go podczas konfiguracji odpowiadającego mu narzędzia i zaktualizuj ten dokument, gdy nazwa polecenia się zmieni.

## Sposób pracy

- Dla zadania wieloetapowego utwórz krótki plan i aktualizuj go po każdym istotnym etapie. Drobna, oczywista zmiana nie wymaga osobnego planu.
- Realizuj jedno GitHub Issue jako małą, skupioną zmianę wraz z dotyczącymi jej testami. Po osiągnięciu kamienia milowego zaktualizuj status zadań i zapisz ujawnione ryzyka przed rozpoczęciem kolejnego etapu.
- Gdy użytkownik potwierdzi implementację, wykonaj commit i push, zamknij odpowiadające GitHub Issue oraz zatrzymaj działający serwer aplikacji.
- Wprowadzaj małe, skupione zmiany. Nie wykonuj przy okazji refaktoryzacji, zmian formatowania ani porządków niezwiązanych z zadaniem.
- Zachowuj istniejące zmiany użytkownika i nie cofaj ich bez wyraźnej prośby.
- Przed dodaniem zależności sprawdź, czy problem można rozwiązać używanym już stosem lub małym fragmentem własnego kodu. Nie dodawaj zbędnych zależności; każdą nową zależność uzasadnij.
- Gdy decyzja nie jest oczywista, krótko wyjaśnij użytkownikowi przyjęte założenie, alternatywy i wpływ wyboru. Decyzje zmieniające zakres, dane lub architekturę wymagają zgody użytkownika.
- Aktualizuj `SPEC.md`, `STACK.md`, testy i niniejszy plik, gdy zmieniają się wymagania, architektura albo polecenia projektu.

## Jakość i sprawdzanie pracy

- Każdą zmianę sprawdź w zakresie proporcjonalnym do ryzyka. Nie deklaruj ukończenia bez wykonania dostępnych kontroli.
- Po zmianie kodu uruchom co najmniej testy dotyczące zmienionego obszaru oraz `npm run typecheck` i `npm run lint`.
- Przed zakończeniem większej funkcji lub publikacją uruchom pełny zestaw: `npm test`, `npm run test:e2e`, `npm run lint`, `npm run typecheck` i `npm run build`.
- Jeśli kontroli nie można uruchomić, jasno podaj które, dlaczego i jakie ryzyko pozostaje.
- Testuj zachowanie widoczne dla użytkownika oraz przypadki brzegowe opisane w `SPEC.md`. Przed publikacją MVP wykonaj ręcznie pełny scenariusz akceptacyjny.
- Utrzymuj testy Playwrighta w `e2e/` i jawnie wykluczaj ten katalog z Vitesta. Playwright uruchamiaj w Chromium przeciw produkcyjnemu buildowi obsługiwanemu przez `vite preview`.
- Docelowy zestaw E2E dla MVP ma obejmować: główny przepływ DnD klawiaturą z odświeżeniem i kontrolą zapisu, co najmniej jeden ruch wskaźnikiem oraz uruchomienie z uszkodzonym wpisem w `localStorage`.
- Logikę domenową i mapowanie zdarzeń DnD testuj przede wszystkim na poziomie jednostkowym i integracyjnym; nie przenoś całego ciężaru weryfikacji do kruchych testów E2E.
- Kod ma być czytelny, poprawnie typowany i pozbawiony martwych fragmentów. Komentarze dodawaj tylko wtedy, gdy wyjaśniają powód decyzji, a nie oczywiste działanie kodu.

## Publikacja

- Publikuj produkcyjny build jako statyczną aplikację na Vercel. Wdrożenie nie może dodawać backendu, sekretów, analityki wysyłającej dane użytkownika ani innej trwałej warstwy danych.
- Przed wdrożeniem uruchom pełną bramkę jakości. Po wdrożeniu wykonaj smoke test docelowego URL, sprawdź konsolę, Network i `localStorage`, a następnie potwierdź zachowanie danych po odświeżeniu i ponownym otwarciu aplikacji.
- Pamiętaj, że `localStorage` jest związany z originem. Zmiana domeny lub adresu wdrożenia tworzy osobny obszar danych.

## Bezpieczeństwo i dane

- Nie umieszczaj sekretów, kluczy, danych uwierzytelniających ani prywatnych danych w kodzie, testach, logach i repozytorium.
- Dane użytkownika pozostają w przeglądarce. Nie wysyłaj ich do usług zewnętrznych bez jawnej zmiany wymagań i zgody użytkownika.
- Traktuj dane z `localStorage` jako niezaufane: waliduj je przed użyciem, bezpiecznie obsługuj błędy odczytu i zapisu oraz nie przerywaj działania aplikacji z powodu uszkodzonego wpisu.
- Nie osłabiaj walidacji, typowania, dostępności ani testów w celu szybkiego obejścia problemu.
- Operacje nieodwracalne wymagają potwierdzenia i ostrożnego wskazania zakresu. Nie usuwaj plików ani danych użytkownika bez wyraźnej potrzeby i zgody.

## Raport końcowy

- Podsumuj, co zmieniono i dlaczego.
- Wymień wykonane kontrole oraz ich wynik.
- Wskaż niewykonane kontrole, otwarte ryzyka i decyzje potrzebne od użytkownika.
