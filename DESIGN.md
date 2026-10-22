---
name: Organizer tygodnia
description: Tydzień jako precyzyjny rozkład w świecie Skillweb — slate, jedna amber, linie zamiast kafelków.
colors:
  accent: "#b45309"
  accent-fill: "#f59f0a"
  accent-fill-hover: "#fbbf24"
  accent-soft: "rgb(245 159 10 / 10%)"
  on-accent: "#0f172a"
  focus: "#b45309"
  page: "#ffffff"
  board: "#f8fafc"
  surface: "#ffffff"
  surface-muted: "#f1f5f9"
  text: "#0f172a"
  text-muted: "#475569"
  text-faint: "#64748b"
  border: "#e2e8f0"
  border-soft: "#edf1f5"
  border-strong: "#cbd5e1"
  danger: "#b91c1c"
  danger-soft: "#fee2e2"
  backdrop: "rgb(15 23 42 / 58%)"
  accent-dark: "#e3a75e"
  accent-fill-dark: "#e3a75e"
  accent-fill-hover-dark: "#f0c48d"
  accent-soft-dark: "rgb(227 167 94 / 10%)"
  on-accent-dark: "#16130e"
  focus-dark: "#e3a75e"
  page-dark: "#12151a"
  board-dark: "#171b22"
  surface-dark: "#1c212a"
  surface-muted-dark: "#232935"
  text-dark: "#dee3e9"
  text-muted-dark: "#9aa3af"
  text-faint-dark: "#868f9c"
  border-dark: "#2b323e"
  border-soft-dark: "#222833"
  border-strong-dark: "#3d4553"
  danger-dark: "#f87171"
  danger-soft-dark: "#3a2328"
  backdrop-dark: "rgb(0 0 0 / 65%)"
typography:
  headline:
    fontFamily: "'Space Grotesk Variable', 'Inter Variable', ui-sans-serif, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    letterSpacing: "-0.025em"
  title-app:
    fontFamily: "'Space Grotesk Variable', 'Inter Variable', ui-sans-serif, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Space Grotesk Variable', 'Inter Variable', ui-sans-serif, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  body-task:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 450
    lineHeight: "1.375rem"
    letterSpacing: "0"
  body-task-day:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 450
    lineHeight: "1.375rem"
    letterSpacing: "0"
  body:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  field:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  caption:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
  button:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
  mono:
    fontFamily: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
rounded:
  control: "3px"
  panel: "5px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.accent-fill}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.9rem"
    height: "2.5rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-fill-hover}"
    textColor: "{colors.on-accent}"
  button-neutral:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.9rem"
    height: "2.5rem"
  button-neutral-hover:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.text}"
  icon-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    size: "2.5rem"
  icon-button-hover:
    backgroundColor: "{colors.surface-muted}"
  row-menu-trigger:
    backgroundColor: "transparent"
    textColor: "{colors.text-faint}"
    rounded: "{rounded.control}"
    size: "1.5rem"
  row-menu-trigger-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.field}"
    rounded: "{rounded.control}"
    padding: "0.65rem 0.75rem"
    height: "2.5rem"
  menu:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "0.25rem"
  menu-item:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0.4rem 0.6rem"
    height: "2.25rem"
  menu-item-hover:
    backgroundColor: "{colors.surface-muted}"
  menu-item-danger:
    textColor: "{colors.danger}"
  menu-item-danger-hover:
    backgroundColor: "{colors.danger-soft}"
  task-row:
    backgroundColor: "{colors.page}"
    textColor: "{colors.text}"
    typography: "{typography.body-task}"
    rounded: "{rounded.control}"
    padding: "0.55rem 0.3rem 0.35rem"
  task-row-hover:
    backgroundColor: "{colors.board}"
  day-footer:
    textColor: "{colors.text-muted}"
    typography: "{typography.mono}"
    padding: "0.65rem 0.75rem 0.8rem"
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "clamp(1.25rem, 4vw, 2rem)"
---

# Design System: Organizer tygodnia

## Overview

**Creative North Star: "Notatnik Skillweb"**

Ekran to rozkład tygodnia zapisany w notatniku, a nie tablica kafelków. Świat jest przypięty do marki Skillweb: białe (w ciemnym motywie grafitowe) tło, skala slate i jedna amber. Strukturę budują linie 1 px i typografia, nie wypełnienia, cienie ani kolor kolumn. Siedem dni to równe kolumny rozdzielone pionowymi liniami; zadania są wierszami, nie kartami; każdy dzień kończy stopka jak w rozkładzie jazdy — mono z linią postępu.

Gęstość jest robocza (tryb Operate): tekst zadań 14–15 px, metadane mono 12 px, kontrolki 2.5 rem. Amber pojawia się tylko tam, gdzie coś jest do zrobienia albo coś się dzieje: akcja główna, fokus, cel upuszczenia, postęp dnia i znak ◆. Wszystko inne jest slate. Oba motywy (jasny i ciemny) są równorzędne i przełączane przez `data-theme` na `:root`.

Odrzucony punkt wyjścia to domyślny kanban: kolorowe kolumny dni, zaokrąglone karty z cieniem, pigułki-liczniki i rzędy ikon na każdej karcie.

**Key Characteristics:**
- Slate + jedna amber; kolor niesie stan, nie dekorację.
- Linie 1 px zamiast paneli; zero cieni elewacji i rozmyć.
- Promienie 3 px dla kontrolek i 5 px dla paneli — nic bardziej okrągłego.
- Trzy kroje o rozdzielonych rolach: Space Grotesk dla nagłówków, Inter dla treści, JetBrains Mono dla liczb i czasu.
- Zadanie jako wiersz: pole wyboru, tytuł, czas mono, menu „…”.

## Colors

Chłodna skala slate (Tailwind slate) z jednym ciepłym akcentem bursztynowym w dwóch wartościach: ciemniejszej do tekstu i fokusu, jaśniejszej do wypełnień. Tokeny z sufiksem `-dark` to wartości `:root[data-theme='dark']` tego samego zmiennego `--color-*`.

### Primary
- **Bursztyn Skillweb, wypełnienie** (`--color-accent-fill`): tło przycisku „Dodaj zadanie” i akcji głównej w dialogach, znak ◆ przy tytule, linia postępu dnia, obrys celu upuszczenia, zaznaczenie tekstu. Hover przechodzi w `--color-accent-fill-hover`. Tekst na nim zawsze w `--color-on-accent` (ciemny slate), nigdy biały.
- **Bursztyn Skillweb, atrament** (`--color-accent`, `--color-focus`): kontur fokusu 2 px, kursor tekstowy, aktywny znacznik w menu motywu, tekst pustej kolumny podczas upuszczania. Ciemniejszy od wypełnienia, by trzymać kontrast AA na białym.
- **Bursztynowa mgiełka** (`--color-accent-soft`, 10% krycia): wyłącznie tło strefy, nad którą trwa upuszczanie.

### Neutral
- **Strona** (`--color-page`): tło aplikacji i spoczynkowe tło wiersza zadania.
- **Plansza** (`--color-board`): ledwie zauważalne podświetlenie wiersza przy hover i fokusie.
- **Powierzchnia** (`--color-surface`) i **powierzchnia przygaszona** (`--color-surface-muted`): dialogi, menu, pola formularzy; przygaszona to hover neutralnych przycisków i pozycji menu.
- **Tekst** (`--color-text`), **tekst przygaszony** (`--color-text-muted`), **tekst najsłabszy** (`--color-text-faint`): trzy stopnie hierarchii. Najsłabszy to wciąż tekst czytelny (AA) — etykiety stopki, liczniki pustych dni, ukończone metadane, spoczynkowy „…”.
- **Linia** (`--color-border`): podziały strukturalne — pod nagłówkiem, między strefami, między dniami, nad stopką.
- **Linia miękka** (`--color-border-soft`): podział między wierszami zadań.
- **Linia mocna** (`--color-border-strong`): obrys pól, neutralnych przycisków i menu wyskakujących.
- **Zasłona** (`--color-backdrop`): tło za natywnym `<dialog>`.

### Semantic
- **Błąd** (`--color-danger`, `--color-danger-soft`): komunikaty walidacji, obrys pola z `aria-invalid`, pozycja „Usuń” w menu i jej hover. Nie jest drugim akcentem.

### Named Rules
**The One Amber Rule.** Jest jeden odcień akcentu: `accent-fill` do wypełnień i linii, `accent` do tekstu i fokusu; w ciemnym motywie oba zbiegają się w jedną wartość. Żadnego drugiego koloru marki, żadnych barw per dzień ani per priorytet.

**The Amber Means Action Rule.** Amber oznacza akcję główną, fokus, upuszczanie albo postęp. Jeśli element niczego z tych rzeczy nie robi, jest slate.

**The Three Lines Rule.** Podziały i spoczynkowe obrysy mają grubość 1 px i trzy kolory: `border` dla struktury, `border-soft` między wierszami, `border-strong` dla obrysów kontrolek w spoczynku. Wyjątki są stanowe lub funkcjonalne: obrys przycisku głównego w kolorze jego wypełnienia, `text-faint` na hover neutralnego przycisku, `danger` przy błędzie, 1.5 px obrysu pola wyboru i 2 px linii postępu.

## Typography

**Display Font:** Space Grotesk Variable (z Inter Variable, ui-sans-serif)
**Body Font:** Inter Variable (z ui-sans-serif, system-ui)
**Label/Mono Font:** JetBrains Mono Variable (z ui-monospace, SFMono-Regular)

**Character:** Geometryczny Space Grotesk z lekko ściśniętym światłem (-0.025em) nazywa miejsca — tydzień, dni, dialogi. Inter niesie treść zadań spokojnie i równo, a JetBrains Mono z cyframi tabelarycznymi zamienia czas i liczniki w kolumnę rozkładu.

### Hierarchy
- **Headline** (600, 1.375rem): tytuł dialogu edycji i „Przenieś do…”.
- **Title App** (600, 1.25rem, 1.2; 1.125rem poniżej 30rem): H1 „Mój tydzień” w pasku nagłówka, poprzedzony znakiem ◆.
- **Title** (600, 1rem, 1.3): nazwy dni, „Do zaplanowania”, nagłówek panelu dodawania.
- **Body Task** (450, 0.9375rem, 1.375rem): tytuł zadania na liście „Do zaplanowania” i na wąskim ekranie. W kolumnach dni na szerokim ekranie **Body Task Day** (450, 0.875rem). Łamanie z dzieleniem wyrazów (`hyphens: auto`) i `text-wrap: pretty`. Waga 450 jest decyzją buildu (kontrakt zakładał 400) — zostaje.
- **Field** (400, 1rem): tekst wpisywany w polach formularza (dziedziczony rozmiar bazowy).
- **Body** (400, 0.875rem): pozycje menu i ich opisy.
- **Caption** (400, 0.8125rem, 1.5): tekst pustej kolumny.
- **Label** (500, 0.875rem): etykiety pól formularza.
- **Button** (600, 0.9375rem): przyciski akcji.
- **Mono** (400, 0.75rem, 1.5, cyfry tabelaryczne): czas zadania, liczniki kolumn, stopka dnia.

### Named Rules
**The Three Voices Rule.** Każdy krój ma jedną rolę: Space Grotesk nazywa, Inter opowiada, JetBrains Mono liczy. Liczba czasu lub ilości zawsze w mono z `font-variant-numeric: tabular-nums`.

**The No Heavy Type Rule.** Najcięższa waga to 600, wyłącznie dla nagłówków i przycisków. Tekst zadań nie przekracza 450; nic nie schodzi poniżej 0.75rem.

## Layout

Pasek nagłówka (min. 4rem, linia `border` na dole): ◆ + H1 po lewej, „Dodaj zadanie” i przełącznik motywu po prawej. Pod nim siatka dwóch stref: lewa kolumna planowania `clamp(13rem, 18vw, 16rem)` z panelem dodawania nad listą „Do zaplanowania”, prawa — siedem kolumn dni `repeat(7, minmax(8.5rem, 1fr))`, rozdzielonych pionową linią 1 px; przy braku miejsca kolumny dni przewijają się poziomo. Kontener `min(100%, 112rem)`, boczny margines `clamp(1rem, 2.5vw, 2.5rem)`. Strefy wypełniają wysokość okna, więc stopki dni wyrównują się w jednej linii u dołu.

Poniżej 59.99rem układ staje się jedną kolumną: planowanie nad tygodniem, dni ułożone pionowo i rozdzielone poziomą linią, stopka dnia w jednym rzędzie. Poniżej 44rem formularz dodawania układa pola jedno pod drugim; poniżej 30rem nagłówek się zagęszcza. Przy `pointer: coarse` cele dotykowe rosną do 2.75rem.

Rytm odstępów opiera się na krokach 0.25 / 0.5 / 0.75 / 1rem; nagłówek kolumny ma `1rem 0.75rem 0.6rem`.

## Elevation & Depth

System jest płaski. Głębię i grupowanie dają linie 1 px oraz tonalna zmiana tła (`page` → `board` → `surface-muted`). Menu wyskakujące i dialogi odróżnia od tła wyłącznie obrys (`border-strong` / `border`) i, dla dialogu, zasłona `backdrop`. Jedyny `box-shadow` w buildzie to wewnętrzny pierścień 1 px w kolorze `accent-fill` na strefie upuszczania — pełni rolę obrysu, nie elewacji.

### Named Rules
**The Hairline Not Shadow Rule.** Żadnych cieni elewacji ani rozmyć (`backdrop-filter`). Dozwolony jest tylko pierścień `inset 0 0 0 1px` zastępujący obrys, gdy obrys zmieniałby wymiary.

## Shapes

Dwa promienie, bez wyjątków poza okręgami: `control` (3px) dla przycisków, pól, wierszy zadań, pól wyboru, pozycji menu i celu upuszczenia na wierszu; `panel` (5px) dla dialogów, menu wyskakujących, pustych stanów dni i podświetlonej strefy upuszczania. Pusty dzień ma przerywany obrys 1 px w kolorze `border`. Pole wyboru to kwadrat 1rem z obrysem 1.5 px. Jedyne okrągłe formy to kropki uchwytu przeciągania (3 px) i kropki ikony „…”.

## Components

### Buttons
Rzeczowe, płaskie, z obrysem w kolorze własnego tła.
- **Shape:** `control` (3px), min. wysokość 2.5rem.
- **Primary:** tło `accent-fill`, tekst `on-accent`, 600 / 0.9375rem, padding `0.5rem 0.9rem`, opcjonalna ikona plus 18px przed etykietą. Jedna akcja główna na widok („Dodaj zadanie”, „Zapisz”, „Przenieś”).
- **Hover / Focus:** tło i obrys `accent-fill-hover`; fokus to kontur 2 px `focus` z odsunięciem 2 px.
- **Neutralny:** tło `surface`, obrys `border-strong`, tekst `text`, 600; hover tło `surface-muted` i obrys `text-faint`. Pełny rozmiar (2.5rem, 0.9375rem) ma „Dodaj zadanie” w stanie rozwiniętym (`aria-expanded`); wariant kompaktowy (2.25rem, 0.875rem, padding `0.4rem 0.75rem`) — przycisk w pustym stanie.
- **Ikona:** kwadrat 2.5rem (przełącznik motywu), obrys `border`, ikona 20px.

### Cards / Containers
Nie ma kart. Kontenerami są strefy rozdzielone liniami oraz natywny `<dialog>`.
- **Dialog:** tło `surface`, obrys `border`, promień `panel`, wewnętrzny odstęp `clamp(1.25rem, 4vw, 2rem)`, zasłona `backdrop`. Szerokość 46rem (edycja) lub 34rem (przeniesienie).
- **Shadow Strategy:** brak (patrz Elevation & Depth).

### Inputs / Fields
- **Style:** tło `surface`, obrys 1 px `border-strong`, promień `control`, min. wysokość 2.5rem, padding `0.65rem 0.75rem`; etykieta nad polem (Label), odstęp 0.45rem. Kursor tekstowy `accent`.
- **Focus:** kontur 2 px `focus`, odsunięcie 2 px.
- **Error:** obrys `danger` i komunikat w `danger` pod polem.

### Navigation
Brak nawigacji — jeden ekran. Pasek nagłówka niesie tylko tytuł, akcję główną i motyw.

### Menu (akcje zadania i motyw)
- **Menu:** tło `surface`, obrys `border-strong`, promień `panel`, padding 0.25rem (akcje) lub 0.5rem (motyw).
- **Pozycja:** min. 2.25rem, ikona SVG 18px w `text-faint` + etykieta Body; hover `surface-muted`. Pozycja „Usuń” w `danger`, hover `danger-soft`. W menu motywu aktywna pozycja ma wagę 600 i znacznik w `accent`.
- **Wyzwalacz „…”:** 1.5rem, bez obrysu w spoczynku, ikona `text-faint`; hover i stan otwarty dodają obrys `border` i tło `surface`.

### Wiersz zadania (Signature Component)
Zadanie to wiersz w notatniku. Siatka dwóch linii: pole wyboru + tytuł (Body Task), pod nimi uchwyt przeciągania (sześć kropek 3 px), metadane mono i wyzwalacz „…”. W spoczynku brak obrysu i tła odróżniającego od strony; wiersze dzieli linia `border-soft` (pierwszy bez linii). Hover i `focus-within` podnoszą tło do `board`. Priorytet oznaczany tylko na krańcach: wysoki — wypełniony trójkąt 10px w kolorze `text`, niski — obrysowany odwrócony trójkąt w `text-faint`, średni — nic. Ukończone: tytuł przekreślony 1 px, tekst `text-muted`, metadane `text-faint`, pole wyboru wypełnione `text-faint` (nie amber). Przeciągany wiersz ma krycie 0.5; cel upuszczenia na wierszu to obrys 1 px `accent-fill`.

### Stopka dnia (Signature Component)
Rozkład jazdy pod każdym dniem: mono 0.75rem z cyframi tabelarycznymi, dwie pary „Zaplanowano:” / „Pozostało:”, pierwsza linia pary w `text-faint`, wartość w `text-muted`. Nad stopką linia `border`, a na niej (`top: -1px`) linia postępu 2 px w `accent-fill`, której szerokość to udział ukończonego czasu. Dzień bez planu ma całą stopkę w `text-faint`.

### Strefa upuszczania
Podczas przeciągania strefa docelowa dostaje tło `accent-soft`, wewnętrzny pierścień 1 px `accent-fill` i promień `panel`; przerywany obrys pustego dnia znika, a jego tekst przechodzi w `accent`.

## Do's and Don'ts

### Do:
- **Do** buduj podziały i spoczynkowe obrysy liniami 1 px w trzech kolorach: `border`, `border-soft`, `border-strong`; inne kolory obrysu tylko dla stanu (hover, błąd, akcja główna).
- **Do** rezerwuj amber dla akcji głównej, fokusu, upuszczania, postępu i znaku ◆; tekst na wypełnieniu amber zawsze w `on-accent`.
- **Do** zapisuj każdą liczbę czasu i ilości w JetBrains Mono z cyframi tabelarycznymi.
- **Do** używaj wyłącznie promieni `control` (3px) i `panel` (5px).
- **Do** rysuj ikony jako inline SVG na siatce 24, obrys 1.8, `currentColor`, rozmiar 18–20px; znaczniki priorytetu jako trójkąty 10px.
- **Do** dawaj każdej interaktywnej kontrolce kontur fokusu 2 px w `focus` z odsunięciem 2 px; kontrolki wiersza zadania i pozycje menu rosną do 2.75rem przy `pointer: coarse`.
- **Do** definiuj każdy kolor jako zmienną `--color-*` z wartością dla obu motywów.

### Don't:
- **Don't** dodawaj cieni elewacji ani rozmyć; jedyny dopuszczalny `box-shadow` to pierścień `inset 0 0 0 1px` zamiast obrysu.
- **Don't** barw kolumn dni, pustych stanów ani priorytetów osobnymi kolorami.
- **Don't** zamieniaj wierszy zadań w zaokrąglone karty z tłem i obrysem w spoczynku.
- **Don't** układaj rzędów przycisków-ikon na wierszu zadania; akcje zadania mieszkają w menu „…”.
- **Don't** używaj znaków Unicode jako ikon akcji; ◆ jest jedynym znakiem typograficznym w interfejsie i pozostaje znakiem marki, nie ikoną.
- **Don't** używaj pigułek ani plakietek jako liczników; licznik to sama cyfra mono w `text-muted`.
- **Don't** przekraczaj wagi 600 ani nie schodź z tekstem poniżej 0.75rem.
