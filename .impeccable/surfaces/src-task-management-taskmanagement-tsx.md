---
version: 1
slug: "src-task-management-taskmanagement-tsx"
primary_target: "src/task-management/TaskManagement.tsx"
related_targets: ["src/task-management/TaskColumn.tsx","src/task-management/TaskCard.tsx"]
---

# Organizer tygodnia — główny ekran

Mode: Operate. Jedna osoba planuje tydzień (sesja przeciągania) i w ciągu tygodnia odhacza zadania. Kierunek przypięty przez użytkownika po krytyce 23/40: „Notatnik Skillweb” + backlog jako lewa kolumna; akcje karty w menu „…”; priorytet oznaczany tylko dla wysokiego/niskiego; na wąskim ekranie dni pionowo.

## Direction contract

THESIS: Tydzień jako precyzyjny rozkład, nie tablica kafelków. Odrzucamy domyślny kanban: kolorowe kolumny, zaokrąglone karty z cieniem, pigułki i rzędy ikon.

OWN-WORLD: Skillweb bez dodatków. Białe tło (#fff / #12151a), slate, jedna amber dla akcji głównej, fokusu, celu upuszczenia i znaku ◆. Linie 1 px (`line-soft` dla wierszy), promienie 3 px kontrolki / 5 px panele, bez cieni i rozmyć. Space Grotesk 600 dla dni, Inter 400 dla zadań, JetBrains Mono dla czasu i liczników.

STORY: Użytkownik od razu widzi listę do zaplanowania po lewej i obciążenie każdego dnia; przeciąga lub używa „Przenieś do…”; odhacza wykonane.

FIRST VIEWPORT: Pasek nagłówka: ◆ + H1 „Mój tydzień”, po prawej „Dodaj zadanie” (amber) i motyw. Pod nim dwie strefy: lewa kolumna ~15rem (formularz nad listą „Do zaplanowania”), prawa — siedem kolumn dni rozdzielonych liniami 1 px. Zadania to wiersze: checkbox, tytuł, czas mono, „…”.

FORM: Ekran roboczy w świecie Skillweb, kierunek przypięty (pozycja 1 z 1). Ruch charakterystyczny: stopka dnia jak rozkład jazdy — mono „Zaplanowano / Pozostało” z linią postępu 2 px. seed:e07a10ea4ce0dae5 (kierunek przypięty przez użytkownika; losowanie nie zmieniło wyboru)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
