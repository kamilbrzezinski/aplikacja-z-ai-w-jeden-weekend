# Retrospektywa projektu „Organizer tygodnia”

## 1. Zakres analizy

Retrospektywa powstała na podstawie:

- `SPEC.md`, `STACK.md`, `AGENTS.md`, `README.md` i nieśledzonego `PLAN.md`;
- struktury kodu i konfiguracji projektu;
- historii Git od dokumentacji początkowej do wdrożenia MVP;
- GitHub Issues Z1–Z13, milestone'ów i Pull Requestów;
- testów Vitest, React Testing Library i Playwright;
- wcześniejszych zadań implementacyjnych, code review oraz dwóch audytów
  pre-deployment;
- wywiadu z właścicielem produktu.

To jest materiał specyficzny dla tego projektu. Uniwersalny proces znajduje się
w [`WORKFLOW.md`](./WORKFLOW.md).

## 2. Jak przebiegał projekt

1. Krótkie discovery doprowadziło do utworzenia szczegółowych `SPEC.md` i
   `STACK.md`.
2. Przed implementacją przygotowano Z1–Z12, podzielone na cztery milestone'y.
3. Z1 i Z2 zrealizowano bezpośrednio na `main`. Od Z3 nową funkcjonalność
   rozwijano na branchach i w Pull Requestach.
4. Z2 był technicznym spike'iem dnd-kit. Potwierdził kontrakt stanu przejściowego
   i pojedynczego zatwierdzenia ruchu, lecz jego kod pozostał w `src/` po użyciu.
5. Z5 i Z6 wykonano równolegle, a następnie zintegrowano stan trwały z
   formularzami.
6. W Z7 właściciel produktu świadomie poprosił o trzy działające warianty kart i
   wybrał wariant kompaktowy.
7. Pierwsza realizacja Z8 była zgodna z ówczesną specyfikacją, ale po uruchomieniu
   nie spełniła oczekiwań wizualnych. Powstał nowy wariant planszy, a `SPEC.md`
   został zaktualizowany.
8. Z9–Z11 domknęły DnD, dostępność i rozbudowaną bramkę jakości.
9. Pierwszy audyt pre-deployment uznał projekt za gotowy. Niezależny drugi audyt
   wykrył niedeterministyczne przenoszenie za pomocą sensora klawiatury.
10. Z13 wyłączyło wadliwą ścieżkę i ustanowiło dialog „Przenieś do…” jako
    oficjalną metodę klawiaturową.
11. Aplikację wdrożono na Vercel. Dwie późniejsze zmiany tekstowe wykonano
    bezpośrednio na `main` z węższym zakresem kontroli.

## 3. Praktyki, które warto zachować

### Szczegółowe zadania jako kontrakt wykonania

Issues zawierały rezultat, zakres, definicję ukończenia, sposób weryfikacji,
zależności i ryzyka. Były wystarczająco precyzyjne, aby kolejni agenci mogli
pracować bez ponownego tłumaczenia całego projektu. Ta szczegółowość nie była
odczuwana jako nadmiar.

### Dokumentacja przenosząca kontekst

`SPEC.md`, `STACK.md` i `AGENTS.md` skutecznie przenosiły decyzje pomiędzy
oddzielnymi zadaniami. Właściciel produktu rzadko musiał przypominać wcześniejsze
ustalenia.

### Prosta architektura

Zakres MVP pozostał frontendowy. Logikę domenową, stan, trwałość danych i UI
rozdzielono bez dodawania backendu, routingu ani zewnętrznej biblioteki stanu.
Nie zaobserwowano produktowego scope creep.

### Szybkie eksperymenty wizualne

Trzy warianty kart oraz działająca alternatywa układu pozwoliły podejmować
decyzje na podstawie produktu widocznego na żywo. W tym projekcie nie była to
strata czasu, lecz skuteczny mechanizm discovery wizualnego.

### Warstwowe testy

Projekt testował reguły domenowe, reducer, walidację storage, komponenty,
integrację DnD oraz najważniejsze przepływy E2E. Logika nie została przeniesiona
wyłącznie do kruchych testów przeglądarkowych.

### Ręczne używanie aplikacji

Właściciel produktu uznał ręczne korzystanie z aplikacji za najważniejsze źródło
zaufania. Było ono szczególnie wartościowe przy wyglądzie, ergonomii i pełnym
przepływie użytkownika.

## 4. Praktyki, które warto zmienić

### Pogłębić discovery

Początkowa rozmowa była celowo krótka ze względu na kursowy charakter projektu.
W realnym projekcie powinna dokładniej zbadać użytkownika, przepływy, przypadki
brzegowe, ograniczenia i wygląd. Precyzyjny zapis niewystarczająco rozpoznanej
decyzji nadal może prowadzić do kosztownej przebudowy.

### Zaprojektować kierunek wizualny przed docelowym UI

Pierwszy układ Z8 wiernie realizował specyfikację, ale sama specyfikacja opisywała
niewłaściwy kierunek. Dla projektów frontendowych przed implementacją docelową
potrzebna jest osobna bramka wizualna: makieta, prototyp albo kilka wariantów.

### Skrócić raporty i wyeksponować decyzje

Ryzyko sensora klawiatury zostało zapisane w raporcie PR #19, ale zniknęło wśród
szczegółów technicznych. Raport powinien zaczynać się od werdyktu, problemów
blokujących i sekcji „Decyzje wymagane od człowieka”. Szczegóły są dodatkiem, nie
głównym kanałem komunikacji.

### Nadać PR-om realną funkcję

W tym projekcie osobny PR dla każdego Issue był częściowo demonstracją na
potrzeby kursu. Większość PR-ów nie miała zapisanych review ani automatycznych
checków i była mergowana po kilku minutach. W następnym procesie PR powinien być
punktem autonomicznej współpracy implementera z niezależnym reviewerem, a nie
rytuałem wymagającym ręcznego potwierdzenia.

### Zależnie od ryzyka dobierać zakres kontroli

Pełna bramka przy każdym większym zadaniu była wartościowa. Drobne zmiany nie
muszą uruchamiać kosztownego E2E, ale powinny zawsze przechodzić tani zestaw
podstawowy. Po ostatniej zmianie tekstowej testy, lint i typecheck przechodzą,
lecz `format:check` wykrywa dwa źle sformatowane pliki testowe.

### Domykać stan projektu

Po wdrożeniu Z12 nadal pozostaje otwarte, wszystkie milestone'y mają status
otwarty, a `PLAN.md` jest nieśledzony. Produkt działa, ale repozytorium i tracker
nie opisują jednoznacznie jego stanu. Zamknięcie wydania powinno obejmować także
porządek w Issues, milestone'ach i dokumentacji.

## 5. Praktyki, które warto dodać

### Niezależne review specyfikacji

Po przygotowaniu `SPEC.md` drugi agent powinien szukać luk, niejednoznaczności,
ukrytych założeń i brakujących decyzji. Specyfikację zatwierdza człowiek dopiero
po tej korekcie.

### Autonomiczna pętla wykonania

Docelowy przepływ to:

> implementacja → testy → niezależne review → poprawki → ponowne sprawdzenie →
> automatyczny merge

Człowiek wchodzi do pętli wyłącznie przy decyzjach produktowych, wizualnych,
architektonicznych o dużym wpływie, nieodwracalnych albo wymagających świadomej
akceptacji ryzyka.

### Review dopasowane do ryzyka

- Mała zmiana: kontrole podstawowe, bez obowiązkowego drugiego agenta.
- Funkcja lub istotna poprawka: pełne testy obszaru i niezależne review.
- Milestone lub wydanie: pełna bramka, ręczny scenariusz i audyt całości.

Druga para „oczu” jest ważniejsza niż użycie innego modelu. Kolejne niezależne
przejście może znaleźć problem pominięty przez równie dobrego pierwszego agenta.

### Jawne warunki powrotu do planowania

Agent powinien zatrzymać implementację, gdy trzeba zmienić specyfikację, wynik
zależy od niezweryfikowanej biblioteki, pojawia się ryzyko dla podstawowego
przepływu, rozwiązanie rośnie nieproporcjonalnie albo pierwsza wersja wizualna
nie spełnia oczekiwań.

### Zasady pracy równoległej

Równoległe agenty powinny otrzymywać zadania bez nierozwiązanych zależności i bez
nakładającej się własności plików. Każdy pracuje na osobnym branchu lub worktree,
a jeden wskazany agent odpowiada za integrację i końcowe review.

## 6. Co uprościć lub usunąć

### Usunąć wykorzystane spike'i

Spike powinien mieć plan wyjścia już w zadaniu: przenieść ustalenia do
dokumentacji, a kod usunąć po integracji. `src/dnd-spike/` pozostał mimo że Issue
Z2 jawnie ostrzegało przed drugim, równoległym modelem.

### Nie wymagać osobnego PR-a dla każdej drobnostki

Małe zmiany tekstu lub stylu można grupować. Osobny PR ma sens, gdy istnieje coś,
co reviewer może realnie ocenić lub gdy zmiana powinna być izolowana ze względu
na ryzyko.

### Ograniczyć ręczne obserwowanie agentów

Największym kosztem dla właściciela było oczekiwanie na zakończenie pracy.
Proces powinien pozwalać agentom samodzielnie przejść całą bezpieczną pętlę i
zgłaszać się dopiero z gotowym wynikiem albo rzeczywistą decyzją.

### Nie duplikować wymagań w każdym dokumencie

`AGENTS.md` powinien zawierać trwałe zasady współpracy. Reguły produktu należą do
`SPEC.md`, architektura do `STACK.md`, a zakres konkretnej zmiany do Issue lub
`PLAN.md`.

## 7. Zasady uniwersalne a specyfika projektu

### Uniwersalne

- dłuższe discovery przed specyfikacją;
- niezależne review specyfikacji i planu;
- szczegółowe, weryfikowalne zadania;
- najprostsze rozwiązanie spełniające wymagania;
- wizualna akceptacja człowieka dla decyzji UX;
- autonomiczna pętla implementer–reviewer;
- trzy poziomy weryfikacji zależne od ryzyka;
- zwięzłe raporty z widocznymi decyzjami dla człowieka;
- automatyczny merge tylko bez otwartych decyzji i ryzyk;
- porządek w dokumentacji i trackerze jako część definicji ukończenia.

### Wyłącznie dla tego projektu

- React, TypeScript, Vite, Context i `useReducer`;
- dnd-kit oraz rozdzielenie przejściowego i zatwierdzonego stanu DnD;
- Zod i klucz `organizer-tygodnia:v1`;
- siedem kolumn tygodnia i reguły formatowania czasu;
- natywne dialogi edycji i przenoszenia;
- publikacja statycznej aplikacji na Vercel;
- konkretne polecenia npm i zakres testów organizera;
- decyzja o wyłączeniu sensora klawiatury dnd-kit.

## 8. Bieżące punkty porządkowe projektu

Te punkty nie są częścią uniwersalnego workflow, ale pozostają widoczne po
retrospektywie:

- zamknąć Z12 po zakończeniu rozmowy i potwierdzeniu stanu wydania;
- zdecydować, które milestone'y formalnie zamknąć;
- przejrzeć i ewentualnie dodać do repozytorium `PLAN.md`;
- poprawić formatowanie dwóch testów zmienionych po wdrożeniu;
- osobno zdecydować o realizacji zadań post-MVP.
