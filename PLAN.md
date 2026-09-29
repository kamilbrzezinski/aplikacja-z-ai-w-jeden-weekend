# Plan rozwoju po wdrożeniu MVP

## 1. Cel dokumentu

Ten dokument porządkuje propozycje dalszych prac ujawnione podczas dwóch audytów
pre-deployment wykonanych 25 września 2026 r. Plan zaczyna obowiązywać po:

1. ukończeniu [Z13 — dostępne przenoszenie zadań klawiaturą](https://github.com/kamilbrzezinski/aplikacja-z-ai-w-jeden-weekend/issues/22);
2. wdrożeniu aplikacji w ramach [Z12 — publikacja statycznej aplikacji](https://github.com/kamilbrzezinski/aplikacja-z-ai-w-jeden-weekend/issues/12);
3. przejściu smoke testu na docelowym adresie Vercel.

Identyfikatory `PD1`–`PD12` są roboczymi oznaczeniami propozycji, a nie numerami
GitHub Issues. Na tym etapie żadne z tych zadań nie zostało utworzone na GitHubie.

## 2. Zasady realizacji

- Jedno przyszłe issue powinno obejmować jedną małą, skupioną zmianę.
- Najpierw stabilizujemy działającą produkcję, później redukujemy dług techniczny.
- Refaktoryzacje nie mogą zmieniać zachowania bez osobnej decyzji produktowej.
- Każda zmiana przechodzi testy obszaru, `npm run lint`, `npm run typecheck` i
  `npm run build`; większe zmiany dodatkowo pełne `npm test` i `npm run test:e2e`.
- Nie dodajemy backendu, analityki, kont ani synchronizacji danych.
- Zmiany związane z Vercel najpierw weryfikujemy na Preview Deployment.

## 3. Proponowana kolejność

| Kolejność | Zadanie                                          | Priorytet  | Szacowany rozmiar | Zależności     |
| --------- | ------------------------------------------------ | ---------- | ----------------- | -------------- |
| 1         | PD1 — CI i obowiązkowa bramka jakości            | wysoki     | M                 | zakończone Z12 |
| 2         | PD2 — Widoczny błąd zapisu lokalnego             | wysoki     | M                 | zakończone Z12 |
| 3         | PD3 — Przywracanie fokusu po usunięciu           | średni     | S                 | zakończone Z13 |
| 4         | PD4 — Czytelność i semantyka akcji kart          | średni     | S                 | zakończone Z13 |
| 5         | PD5 — Usunięcie martwego kodu                    | średni     | M                 | PD1            |
| 6         | PD6 — Wspólne helpery i etykiety domenowe        | średni     | M                 | PD5            |
| 7         | PD7 — Podział odpowiedzialności `TaskManagement` | średni     | M/L               | PD5, PD6       |
| 8         | PD8 — Dokumentacja produkcji i drobne assety     | średni     | S                 | zakończone Z12 |
| 9         | PD9 — Nagłówki bezpieczeństwa Vercel             | niski      | S/M               | PD8            |
| 10        | PD10 — Rozdzielenie konfiguracji TypeScript      | niski      | M                 | PD1            |
| 11        | PD11 — Awaryjny ekran błędu renderowania         | niski      | S/M               | PD7            |
| 12        | PD12 — Kontrolowany przegląd zależności i bundla | opcjonalny | spike             | PD1–PD11       |

## 4. Etap A — stabilizacja po publikacji

### PD1. CI i obowiązkowa bramka jakości

**Źródło:** M6 z drugiego audytu.

**Cel:** każda zmiana trafiająca do `main` ma automatycznie przechodzić te same
kontrole, które wykonano przed pierwszym wdrożeniem.

**Zakres:**

- workflow GitHub Actions dla Node.js 24;
- `npm ci`, lint, typecheck, Vitest i produkcyjny build na każdym Pull Requeście;
- Playwright w Chromium jako osobny job z instalacją wymaganej przeglądarki;
- cache npm bez pomijania `devDependencies`;
- czytelne nazwy checków przygotowane do późniejszego oznaczenia jako wymagane.

**Kryteria akceptacji:**

- czysty checkout przechodzi workflow;
- celowo zepsuty test, lint albo typecheck blokuje odpowiedni job;
- workflow nie wykonuje deploymentu i nie potrzebuje sekretów;
- README wskazuje lokalne odpowiedniki wszystkich checków.

**Ryzyka:** Playwright może wymagać stabilnego oczekiwania na animacje DnD. Nie
należy maskować niestabilności zwiększaniem liczby retry bez diagnozy.

### PD2. Widoczny błąd zapisu lokalnego

**Źródło:** M1 z drugiego audytu oraz problem zapisu wskazany w pierwszym
audycie.

**Cel:** użytkownik wie, że bieżące zmiany nie zostaną zachowane po
odświeżeniu, gdy `localStorage` jest niedostępny albo pełny.

**Zakres:**

- wykorzystanie wyniku `saveAppState` w providerze;
- stan dostępności zapisu niezależny od stanu domenowego;
- jeden nieinwazyjny, dostępny komunikat: „Zmiany nie są zapisywane w tej
  przeglądarce”;
- brak blokowania pracy i brak utraty stanu aktualnie widocznego na ekranie;
- test błędu `setItem`, jego powtarzania i późniejszego udanego zapisu.

**Kryteria akceptacji:**

- wyjątek z `localStorage.setItem` nie przerywa działania aplikacji;
- komunikat jest ogłaszany technologiom asystującym i nie pojawia się wielokrotnie;
- każda kolejna zmiana nadal podejmuje próbę zapisu;
- poprawny zapis nie zmienia zachowania istniejącej aplikacji.

### PD3. Przywracanie fokusu po usunięciu zadania

**Źródło:** M8 z drugiego audytu.

**Cel:** po potwierdzonym usunięciu użytkownik klawiatury pozostaje w logicznym
miejscu interfejsu.

**Zakres:**

- przed usunięciem ustalić następny cel fokusu;
- preferować następną kartę, potem poprzednią, a dla pustej kolumny jej nagłówek;
- nie zmieniać natywnego potwierdzenia usunięcia;
- testy dla pierwszej, środkowej, ostatniej i jedynej karty.

**Kryteria akceptacji:** po usunięciu fokus nigdy nie spada na `<body>` i nie
przenosi użytkownika do innej kolumny bez potrzeby.

### PD4. Czytelność i semantyka akcji kart

**Źródło:** N3 i N4 z drugiego audytu.

**Cel:** zachować kompaktowe karty, ale poprawić odkrywalność akcji i strukturę
nagłówków.

**Zakres:**

- zapewnić czytelne nazwy lub podpowiedzi dla ikon „Przenieś”, „Edytuj” i „Usuń”;
- zweryfikować, czy widoczna etykieta statusu wykonania jest potrzebna obok
  checkboxa;
- zmienić poziom tytułu zadania tak, aby nie konkurował z nagłówkiem kolumny;
- zachować prawidłowe `aria-label` oraz obsługę fokusu.

**Kryteria akceptacji:** akcje są zrozumiałe dla użytkownika myszy, klawiatury i
czytnika ekranu, bez zwiększania karty ponad czytelną szerokość kolumny.

## 5. Etap B — redukcja długu technicznego

### PD5. Usunięcie martwego kodu

**Źródło:** M2 oraz N6 z drugiego audytu.

**Cel:** pozostawić w `src` wyłącznie kod używany przez aplikację i jej aktualne
testy.

**Zakres:**

- usunąć `src/dnd-spike/`, ponieważ ustalenia spike’u są już w historii Git i
  dokumentacji;
- usunąć nieużywany wariant `layout="stacked"` formularza;
- usunąć nieużywany szeroki wariant `TaskCard`, jeśli ponowna inspekcja nie
  znajdzie konsumenta;
- usunąć martwe, nadpisywane reguły `.footer` w media query;
- zdecydować, czy `selectTasksByLocation` zostaje wykorzystany w PD6, czy usunięty;
- usunąć deklarację `Inter` albo jawnie udokumentować systemowy fallback; nie
  dodawać zewnętrznego fontu tylko dla zgodności z nazwą.

**Kryteria akceptacji:** brak zmiany zachowania i wyglądu aplikacji, mniejsza
liczba testów dotyczących nieużywanego prototypu oraz brak osieroconych eksportów.

### PD6. Wspólne helpery i etykiety domenowe

**Źródło:** M3 z drugiego audytu i duplikacja wskazana w pierwszym audycie.

**Cel:** jedna implementacja niezmienników i nazw używanych w reducerze,
integracji DnD i dialogach.

**Zakres:**

- jeden helper `findTaskPosition` zwracający `null` przy naruszeniu niezmiennika;
- jedna mapa etykiet priorytetów;
- jedna mapa etykiet lokalizacji, obejmująca backlog i dni;
- użycie selektora zadań zamiast lokalnej kopii `tasksIn`, jeśli uprości kod;
- testy helperów bez duplikowania tych samych przypadków w komponentach.

**Kryteria akceptacji:** brak cichego fallbacku `{ backlog, 0 }`, brak
powielonych etykiet oraz brak zmiany formatu zapisu.

### PD7. Podział odpowiedzialności `TaskManagement`

**Źródło:** M4 z drugiego audytu.

**Cel:** zmniejszyć komponent koordynujący bez tworzenia rozbudowanej warstwy
abstrakcji.

**Zakres:**

- wydzielić sesję DnD do małego hooka, np. `useTaskDragSession`;
- wydzielić planszę backlogu i tygodnia od nagłówka oraz panelu dodawania;
- ujednolicić mechanizmy przywracania fokusu;
- usunąć zależność komponentów domenowych od `App.module.css`, jeśli da się to
  zrobić bez masowej zmiany stylów;
- zachować reducer jako jedyne miejsce zatwierdzania ruchu.

**Kryteria akceptacji:**

- `onDragOver` nadal zmienia tylko lokalny draft;
- anulowanie nie wysyła akcji i nie zapisuje stanu;
- poprawne upuszczenie wysyła dokładnie jedną akcję;
- testy skupiają się na zachowaniu, a nie strukturze nowego hooka.

**Zależności:** rozpocząć dopiero po Z13, PD5 i PD6, aby nie refaktoryzować kodu,
który zaraz zostanie usunięty lub przeniesiony.

## 6. Etap C — higiena produkcyjna i hardening

### PD8. Dokumentacja produkcji i drobne assety

**Źródło:** M7, N1 i N9 z drugiego audytu oraz zalecenia deploymentowe z
pierwszego audytu.

**Cel:** repozytorium opisuje faktyczne środowisko produkcyjne i nie generuje
zbędnych żądań.

**Zakres:**

- dodać do README: docelowy URL, Vite, Node 24.x, komendę buildu, katalog `dist`
  i brak zmiennych środowiskowych;
- poprawić sformułowanie „stan docelowo zarządzany” na stan faktyczny;
- zapisać wynik kontroli Node/npm z pierwszego buildu Vercela;
- dodać lokalną faviconę bez zewnętrznych zasobów;
- przypomnieć, że dane są związane z originem i preview nie współdzieli danych z
  produkcją;
- udokumentować, że Web Analytics i Speed Insights pozostają wyłączone.

**Kryteria akceptacji:** nowa osoba może odtworzyć konfigurację projektu Vercel
na podstawie repozytorium, a wejście na aplikację nie powoduje 404 favicony.

### PD9. Nagłówki bezpieczeństwa Vercel

**Źródło:** N2 z drugiego audytu.

**Cel:** obrona w głąb dla statycznej aplikacji bez zewnętrznych zasobów.

**Zakres:**

- przygotować minimalny `vercel.json` z CSP, `frame-ancestors 'none'`,
  `X-Content-Type-Options` i `Referrer-Policy`;
- nie dodawać szerokiego `'unsafe-inline'` bez udokumentowanej potrzeby;
- przed ustawieniem ręcznego `Cache-Control` sprawdzić rzeczywiste nagłówki
  hashowanych assetów na Vercelu; nie dublować poprawnego cache platformy;
- zweryfikować aplikację na Preview przed promocją.

**Kryteria akceptacji:** aplikacja działa bez naruszeń CSP, assety się ładują,
DnD i dialogi działają, a nagłówki są widoczne w odpowiedzi produkcyjnej.

### PD10. Rozdzielenie konfiguracji TypeScript

**Źródło:** N7 z drugiego audytu.

**Cel:** kod przeglądarkowy nie może przypadkowo korzystać z globali Node.js.

**Zakres:**

- osobny `tsconfig.app.json` dla `src` z typami DOM i Vite;
- osobny `tsconfig.node.json` dla konfiguracji narzędzi oraz testów Node;
- jawna konfiguracja E2E, jeśli będzie potrzebna;
- główny `tsconfig.json` jako references albo mały punkt wejścia.

**Kryteria akceptacji:** użycie `process`, `Buffer` lub modułu Node w kodzie
aplikacji powoduje błąd, a wszystkie istniejące konfiguracje i testy nadal się
typizują.

### PD11. Awaryjny ekran błędu renderowania

**Źródło:** N8 z drugiego audytu.

**Cel:** nieoczekiwany wyjątek Reacta nie pozostawia użytkownika z pustą stroną.

**Zakres:**

- mały error boundary przy korzeniu aplikacji;
- neutralny komunikat i możliwość ponownego załadowania strony;
- brak wysyłania błędów do zewnętrznych usług i brak logowania danych zadań;
- test kontrolowanego błędu potomka.

**Kryteria akceptacji:** fallback jest dostępny, nie usuwa `localStorage` i nie
wprowadza systemu telemetrycznego.

## 7. Etap D — opcjonalny spike po stabilizacji

### PD12. Kontrolowany przegląd zależności i bundla

**Źródło:** N10 i N11 z drugiego audytu.

**Cel:** ocenić korzyści i koszt aktualizacji bez łączenia jej z funkcjonalnością.

**Zakres spike’u:**

- sprawdzić stabilną ścieżkę aktualizacji `@dnd-kit/*` z przypiętego `0.5.0`;
- porównać kontrakt pointer DnD i anulowania z aktualnym STACK;
- zmierzyć wpływ pełnego Zod i ewentualnego lżejszego importu na bundle;
- zapisać decyzję „aktualizujemy” albo „pozostajemy przy obecnej wersji” wraz z
  wynikami testów i rozmiarem bundla.

**Kryteria akceptacji:** spike nie trafia do produkcji i nie kończy się
automatyczną aktualizacją zależności. Osobne issue implementacyjne powstaje tylko
wtedy, gdy korzyść przewyższa ryzyko regresji DnD.

## 8. Świadomie odłożone propozycje

Poniższych punktów nie proponujemy obecnie jako osobnych zadań:

- częściowe odzyskiwanie uszkodzonego wpisu `localStorage` — SPEC jawnie pozwala
  uruchomić pusty stan, a migracja pojedynczych rekordów zwiększa złożoność;
- ładowanie fontu Inter — systemowy font jest szybszy i lepszy dla prywatności;
- dzielenie bundla tylko dla wyniku liczbowego — obecny build nie zgłasza
  ostrzeżenia i jest mały po gzip;
- routing, backend, eksport, synchronizacja i pełna optymalizacja telefonu —
  pozostają poza zakresem MVP.

## 9. Decyzje potrzebne przed utworzeniem kolejnych Issues

Przed przeniesieniem planu na GitHub należy zdecydować:

1. Czy PD1–PD4 realizujemy jako bezpośrednią stabilizację po publikacji?
2. Czy PD5 i PD6 mają być dwoma zmianami, czy jednym PR-em porządkowym z dwoma
   osobnymi commitami?
3. Czy PD7 jest potrzebne przed kolejną funkcją produktową, czy dopiero przy
   pierwszej zmianie w DnD?
4. Czy PD9 wdrażamy od razu, czy najpierw obserwujemy rzeczywiste nagłówki
   pierwszego deploymentu?
5. Które zadania niskiego priorytetu pozostają wyłącznie w backlogu planu bez
   tworzenia Issues?
