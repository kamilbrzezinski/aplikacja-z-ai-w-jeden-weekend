# Zasady pracy nad projektem

## Źródła prawdy

- Przed zmianą zapoznaj się z `SPEC.md` i `STACK.md`.
- Realizuj tylko zakres potrzebny do bieżącego zadania. Nie dodawaj funkcji spoza MVP bez zgody użytkownika.
- Jeśli wymagania, dokumentacja i istniejący kod są sprzeczne, nie zgaduj. Opisz konflikt i poproś użytkownika o decyzję.

## Technologie i architektura

- Używaj Reacta, TypeScriptu w trybie `strict`, Vite, Node.js LTS i npm.
- Stan aplikacji utrzymuj w `useReducer` i Context. Logikę biznesową oddzielaj od komponentów Reacta i zapisuj jako testowalne funkcje TypeScript.
- Do przeciągania używaj `@dnd-kit/react` i `@dnd-kit/helpers`, do walidacji danych z `localStorage` — Zod, a do stylów — CSS Modules i zmiennych CSS.
- Twórz małe komponenty o jednej odpowiedzialności. Używaj semantycznego HTML, powiązanych etykiet formularzy i interfejsu dostępnego z klawiatury.
- Nie dodawaj backendu, routingu, zewnętrznego API ani biblioteki zarządzania stanem, jeżeli użytkownik nie zmieni zakresu projektu.

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
- Kod ma być czytelny, poprawnie typowany i pozbawiony martwych fragmentów. Komentarze dodawaj tylko wtedy, gdy wyjaśniają powód decyzji, a nie oczywiste działanie kodu.

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
