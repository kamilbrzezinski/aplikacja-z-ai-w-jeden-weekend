# Organizer tygodnia — stos technologiczny

Dokument opisuje decyzje techniczne dotyczące realizacji wymagań zapisanych w `SPEC.md`.

## 1. Podstawowy stos

- **React** — budowa interfejsu z kart, kolumn i formularzy.
- **TypeScript w trybie `strict`** — kontrola modelu danych i ograniczenie błędów związanych m.in. z priorytetami, lokalizacjami i czasem zadań.
- **Vite** — uruchamianie projektu podczas pracy oraz tworzenie statycznej wersji produkcyjnej.
- **Node.js LTS i npm** — środowisko uruchomieniowe i zarządzanie zależnościami.

Aplikacja pozostaje jednostronicową aplikacją frontendową. W MVP nie korzysta z backendu, bazy danych, routingu ani zewnętrznego API.

## 2. Stan i model danych

Stan aplikacji będzie zarządzany za pomocą wbudowanych mechanizmów React: `useReducer` i Context. Na etapie MVP nie jest potrzebna zewnętrzna biblioteka stanu, taka jak Redux lub Zustand.

Rekomendowana struktura stanu:

```ts
type StoredTask = Omit<Task, "location" | "order">;

interface AppState {
  schemaVersion: 1;
  tasks: Record<string, StoredTask>;
  columns: Record<TaskLocation, string[]>;
}
```

Obiekt `tasks` przechowuje dane zadań, a każda pozycja w `columns` zawiera uporządkowaną listę identyfikatorów. Dzięki temu przenoszenie i zmiana kolejności zadań nie wymagają aktualizowania pola `order` w wielu rekordach. Każdy identyfikator zadania może wystąpić w dokładnie jednej kolumnie.

Logika operacji na zadaniach oraz obliczania podsumowań powinna być oddzielona od komponentów interfejsu i możliwa do testowania jako zwykłe funkcje TypeScript.

## 3. Przeciąganie zadań

Do obsługi przeciągania i zmiany kolejności zostanie użyty **dnd-kit**, w szczególności aktualne pakiety `@dnd-kit/react` oraz `@dnd-kit/helpers`.

Implementacja musi obsługiwać:

- zmianę kolejności w tej samej kolumnie;
- przenoszenie pomiędzy różnymi kolumnami;
- upuszczanie w pustej kolumnie;
- anulowanie rozpoczętego przeciągania bez zmiany stanu.

Spike z `Z2` potwierdził następujący kontrakt integracyjny dla przypiętych wersji
pakietów: `onDragStart` zapisuje migawkę zatwierdzonych kolumn, a `onDragOver`
aktualizuje wyłącznie lokalny układ przejściowy przez `move()`. Poprawne
`onDragEnd` wylicza identyfikator zadania, docelową lokalizację i indeks, po czym
wysyła jedną semantyczną akcję do reducera. Anulowanie albo upuszczenie poza
poprawnym celem przywraca migawkę bez akcji.

Reducer z `Z4` rozszerzy tę akcję o wygenerowany poza reducerem `updatedAt`.
Warstwa zapisu z `Z5`, podłączona docelowo do planszy w `Z9`, będzie obserwować
wyłącznie zatwierdzony stan domenowy, dlatego przejściowe aktualizacje
`onDragOver` nie trafią do `localStorage`.

## 4. Formularze i style

- Formularz zadania będzie zwykłym kontrolowanym formularzem React. Ze względu na małą liczbę pól nie będzie używana osobna biblioteka formularzy.
- Reguły formularza pozostają zgodne z sekcją 9 w `SPEC.md`.
- Style zostaną napisane za pomocą **CSS Modules** i zmiennych CSS.
- Nie będzie używany Tailwind ani rozbudowana biblioteka komponentów UI.
- Interfejs powinien korzystać z semantycznego HTML oraz czytelnych etykiet kontrolek.

## 5. Zapis i walidacja danych

Stan będzie zapisywany w `localStorage` po każdej poprawnej zmianie. Dostęp do pamięci przeglądarki powinien znajdować się w oddzielnym module, aby logika zapisu nie była rozproszona po komponentach.

Do sprawdzania danych odczytanych z `localStorage` zostanie użyty **Zod**. Zapis zawiera pole `schemaVersion`, które pozwoli w przyszłości migrować format danych.

Odczyt i zapis muszą obsługiwać błędy. Jeśli dane są uszkodzone lub niedostępne, aplikacja nie może się zatrzymać i powinna uruchomić się z pustym stanem. Problemy z zapisem nie mogą powodować utraty bieżącego stanu widocznego na ekranie.

## 6. Testy

- **Vitest** — testy reguł biznesowych, reducera, podsumowań czasu i obsługi zapisu.
- **React Testing Library** — testy formularza oraz zachowania najważniejszych komponentów z perspektywy użytkownika.
- **Playwright** — mały zestaw testów uruchamianych w Chromium. Na etapie MVP nie testujemy automatycznie Firefoksa ani WebKit.

Minimalny zakres Playwrighta obejmuje 2–3 najważniejsze scenariusze:

1. Dodanie zadania, przeniesienie go do dnia i sprawdzenie podsumowania czasu.
2. Zmianę kolejności lub położenia, odświeżenie strony i sprawdzenie zachowanego stanu.
3. Uruchomienie aplikacji z uszkodzonym wpisem w `localStorage` i sprawdzenie bezpiecznego pustego stanu.

Pełny scenariusz akceptacyjny z sekcji 11 w `SPEC.md` powinien być dodatkowo wykonany ręcznie przed publikacją MVP.

## 7. Jakość kodu

- **ESLint** — statyczna kontrola kodu.
- **Prettier** — jednolite formatowanie.
- Sprawdzanie typów TypeScript, testy i produkcyjny build muszą przechodzić przed publikacją.

## 8. Publikacja

Produkcyjna wersja aplikacji będzie publikowana jako statyczna strona na **Vercel**. Wdrożenie nie dodaje warstwy serwerowej ani trwałej bazy danych. Dane użytkownika nadal pozostają wyłącznie w `localStorage` przeglądarki i są związane z adresem wdrożonej aplikacji.
