# Organizer tygodnia

Jednoekranowa aplikacja React do rozkładania zadań na siedem dni tygodnia. Projekt jest realizowany zgodnie z zakresem MVP opisanym w [`SPEC.md`](./SPEC.md) i decyzjami technicznymi z [`STACK.md`](./STACK.md).

## Wymagania

- Node.js 24 LTS (dokładna wersja robocza znajduje się w `.nvmrc`),
- npm 11 lub nowszy.

Jeśli używasz `nvm`, wybierz właściwą wersję poleceniem:

```bash
nvm use
```

## Instalacja i uruchomienie

```bash
npm install
npm run dev
```

Serwer deweloperski wyświetli lokalny adres aplikacji w terminalu.

## Dostępne polecenia

```bash
npm run dev          # lokalny serwer deweloperski
npm test             # testy Vitest i React Testing Library
npm run test:e2e     # produkcyjny build i testy Playwright w Chromium
npm run lint         # statyczna analiza ESLint
npm run typecheck    # sprawdzanie typów TypeScript
npm run build        # sprawdzanie typów i produkcyjny build Vite
npm run preview      # lokalny podgląd istniejącego buildu
npm run format       # formatowanie kodu przez Prettier
npm run format:check # kontrola formatowania bez zmian w plikach
```

Przed pierwszym uruchomieniem testów E2E może być potrzebna instalacja Chromium:

```bash
npx playwright install chromium
```

## Założenia techniczne

- React i TypeScript w trybie `strict`,
- stan docelowo zarządzany przez `useReducer` i Context,
- `@dnd-kit/react` oraz `@dnd-kit/helpers` do przeciągania,
- Zod do walidacji danych z `localStorage`,
- CSS Modules i wspólne zmienne CSS,
- brak backendu, routingu i zewnętrznego API w MVP.
