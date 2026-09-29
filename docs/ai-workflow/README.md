# Workflow pracy nad projektem z agentami AI

Ten katalog zawiera wynik retrospektywy projektu „Organizer tygodnia” oraz
uniwersalny zestaw materiałów do kolejnych projektów programistycznych.

## Najkrótsza wersja procesu

1. Przeprowadź pogłębione discovery i przygotuj `SPEC.md`.
2. Zleć niezależnemu agentowi krytyczne review specyfikacji.
3. Zaprojektuj najprostsze rozwiązanie techniczne i zapisz je w `STACK.md`.
4. Zamień zatwierdzoną specyfikację na `PLAN.md` i wykonywalne zadania.
5. Zleć niezależne review planu pod kątem scope creep i overengineeringu.
6. Realizuj zadania w autonomicznej pętli:
   implementacja → testy → niezależne review → poprawki → merge.
7. Angażuj człowieka tylko w decyzje produktowe, wizualne, trudne do odwrócenia
   oraz w świadome akceptowanie ryzyka.
8. Na końcu milestone'u lub wydania wykonaj pełną weryfikację, ręczny scenariusz
   akceptacyjny i niezależny audyt całości.

## Zawartość

### Materiał specyficzny dla tego projektu

- [`RETROSPECTIVE.md`](./RETROSPECTIVE.md) — przebieg projektu, dowody oraz
  praktyki do zachowania, zmiany, dodania i usunięcia.

Wniosków z tego pliku nie należy automatycznie kopiować do innych projektów.
Przykładowo React, dnd-kit, `localStorage`, Vercel oraz szczegółowe reguły
organizera tygodnia nie są zasadami uniwersalnymi.

### Materiały uniwersalne

- [`WORKFLOW.md`](./WORKFLOW.md) — kompletny, powtarzalny proces od pomysłu do
  zamkniętego wydania;
- [`prompts/01-discovery-to-spec.md`](./prompts/01-discovery-to-spec.md) — prompt
  prowadzący od pomysłu do `SPEC.md`;
- [`prompts/02-simple-technical-design.md`](./prompts/02-simple-technical-design.md)
  — prompt do zaprojektowania najprostszego sensownego rozwiązania;
- [`prompts/03-spec-to-plan.md`](./prompts/03-spec-to-plan.md) — prompt prowadzący
  od specyfikacji do planu i zadań;
- [`prompts/04-critical-plan-review.md`](./prompts/04-critical-plan-review.md) —
  krytyczne review planu;
- [`templates/AGENTS.md`](./templates/AGENTS.md) — bazowy szablon współpracy z
  agentami;
- [`checklists/implementation.md`](./checklists/implementation.md) — krótka
  checklista dla pojedynczej zmiany;
- [`checklists/final-review.md`](./checklists/final-review.md) — checklista
  zamknięcia milestone'u lub wydania.

## Jak używać materiałów

1. Skopiuj katalog do nowego repozytorium albo korzystaj bezpośrednio z
   poszczególnych promptów.
2. Uzupełnij pola zapisane jako `<...>`.
3. Po discovery usuń z `SPEC.md` nierozstrzygnięte decyzje albo jawnie oznacz je
   jako blokery.
4. Dostosuj sekcję poleceń w szablonie `AGENTS.md` do faktycznych narzędzi
   projektu.
5. Nie kopiuj do nowego `AGENTS.md` wszystkich szczegółów ze specyfikacji.
   Dokument ma zawierać trwałe zasady pracy oraz kierować agenta do właściwych
   źródeł prawdy.
6. Po każdym projekcie wykonaj krótką retrospektywę i usuń zasady, które nie dały
   realnej wartości.

## Zasada rozdzielenia

Uniwersalne są: jasny kontrakt zadania, najprostsze wystarczające rozwiązanie,
niezależne review, weryfikacja zależna od ryzyka, jawne granice decyzji człowieka
oraz porządek po zakończeniu pracy.

Specyficzne dla projektu są: stos technologiczny, polecenia, architektura, model
danych, reguły domenowe, sposób publikacji i szczegółowe przypadki akceptacyjne.

Szablon `AGENTS.md` jest celowo zwięzły. Oficjalne wskazówki OpenAI zalecają
utrzymywanie instrukcji kontekstowych i okresowe usuwanie zbędnych reguł zamiast
wymuszania czytania całej dokumentacji przy każdej zmianie:
<https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra>
