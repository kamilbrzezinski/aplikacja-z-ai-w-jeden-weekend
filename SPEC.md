# Organizer tygodnia — specyfikacja MVP

## 1. Cel produktu

Organizer tygodnia jest prostą aplikacją webową dla jednej osoby. Pomaga zamienić ogólną listę zadań w plan tygodnia poprzez przeciąganie zadań na wybrane dni.

Podstawowy przepływ:

1. Użytkownik dodaje zadanie do listy zadań do zaplanowania.
2. Użytkownik przypisuje zadanie do dnia od poniedziałku do niedzieli.
3. Użytkownik może zmieniać kolejność zadań, przenosić je pomiędzy dniami lub odkładać z powrotem na listę.
4. Użytkownik oznacza wykonane zadania.
5. Aplikacja pokazuje planowany i pozostały czas pracy w każdym dniu.

## 2. Użytkownik i problem

### Użytkownik

- jedna osoba korzystająca z aplikacji na komputerze;
- planuje zarówno zadania zawodowe, jak i prywatne;
- nie potrzebuje współdzielenia danych ani podziału zadań na projekty.

### Problem

Zwykła lista zadań pokazuje, co należy zrobić, ale nie pomaga zdecydować, kiedy to zrobić. Aplikacja pozwala świadomie rozłożyć zadania w tygodniu oraz od razu zobaczyć przewidywane obciążenie poszczególnych dni.

## 3. Zakres MVP

### Funkcje obowiązkowe

1. Dodawanie zadania.
2. Edytowanie zadania.
3. Usuwanie zadania.
4. Oznaczanie zadania jako wykonane lub niewykonane.
5. Lista zadań do zaplanowania.
6. Siedem stałych kolumn: poniedziałek–niedziela.
7. Przeciąganie zadania z listy na wybrany dzień.
8. Przenoszenie zadania pomiędzy dniami.
9. Przenoszenie zadania z dnia z powrotem na listę.
10. Zmiana kolejności zadań w liście i w obrębie dnia.
11. Wyświetlanie pod każdym dniem czasu zaplanowanego i pozostałego.
12. Automatyczny zapis stanu aplikacji w `localStorage`.

### Poza zakresem MVP

- konta, logowanie i wielu użytkowników;
- backend, baza danych i synchronizacja między urządzeniami;
- projekty, kategorie, etykiety i podzadania;
- terminy wykonania;
- zadania cykliczne;
- planowanie na konkretne godziny;
- konkretne daty i przechodzenie pomiędzy tygodniami;
- integracja z kalendarzem;
- powiadomienia;
- współdzielenie zadań;
- import i eksport danych;
- funkcje AI w aplikacji;
- automatyczne planowanie zadań;
- automatyczne przenoszenie niewykonanych zadań;
- pełna optymalizacja interfejsu dla telefonu.

## 4. Interfejs

### Główny widok

Interfejs ma jeden ekran podzielony na dwie części:

- po lewej znajduje się lista „Do zaplanowania”;
- po prawej znajduje się siedem kolumn: poniedziałek, wtorek, środa, czwartek, piątek, sobota i niedziela.

Kolumny nie reprezentują konkretnych dat. Aplikacja nie zna aktualnego tygodnia i nie wykonuje żadnych operacji automatycznie wraz z upływem czasu.

Interfejs jest projektowany przede wszystkim dla ekranu komputera. Jeżeli siedem kolumn nie mieści się w dostępnej szerokości, obszar tygodnia może przewijać się poziomo.

### Karta zadania

Każda karta pokazuje co najmniej:

- nazwę zadania;
- priorytet;
- szacowany czas;
- kontrolkę oznaczenia wykonania;
- dostęp do edycji i usunięcia.

Priorytet powinien być czytelny także bez polegania wyłącznie na kolorze, np. przez tekst albo ikonę.

Wykonane zadanie pozostaje w aktualnym miejscu i jest wizualnie przekreślone lub przygaszone. Można je ponownie oznaczyć jako niewykonane, edytować, przenieść albo usunąć.

### Formularz zadania

Formularz dodawania i edycji zawiera:

- nazwę — pole wymagane;
- priorytet — niski, średni albo wysoki;
- czas trwania — dodatnia wartość z dokładnością do 15 minut.

Rekomendowane wartości początkowe dla nowego zadania:

- priorytet: średni;
- czas: 30 minut.

Formularz nie może zostać zapisany bez nazwy ani z niepoprawnym czasem.

### Usuwanie

Usunięcie zadania jest trwałe. Przed usunięciem aplikacja powinna poprosić o potwierdzenie.

## 5. Przeciąganie i kolejność

Zadanie w danym momencie znajduje się dokładnie w jednym miejscu:

- na liście „Do zaplanowania” albo
- w jednym z siedmiu dni.

Użytkownik może:

- przeciągnąć zadanie do dowolnej kolumny;
- ustawić je w wybranym miejscu pomiędzy innymi zadaniami;
- zmienić jego pozycję w tej samej kolumnie;
- przenieść je z powrotem na listę.

Upuszczenie zadania w pustym miejscu kolumny umieszcza je na jej końcu. Każda poprawna operacja przeciągania jest od razu zapisywana lokalnie.

## 6. Czas i podsumowania

Czas zadania jest przechowywany jako liczba minut podzielna przez 15. Minimalny czas wynosi 15 minut.

Pod każdym dniem aplikacja pokazuje:

- **Zaplanowano** — sumę czasu wszystkich zadań w danym dniu, również wykonanych;
- **Pozostało** — sumę czasu tylko zadań niewykonanych.

Przykład:

> Zaplanowano: 5 godz. · Pozostało: 2 godz.

Zmiana czasu, statusu lub położenia zadania natychmiast aktualizuje oba podsumowania.

Lista „Do zaplanowania” nie musi wyświetlać łącznego czasu w MVP.

## 7. Zapis danych

Wszystkie dane pozostają w przeglądarce użytkownika i są zapisywane w `localStorage` po każdej zmianie.

Aplikacja:

- nie wysyła danych do serwera;
- nie wymaga połączenia z zewnętrznym API;
- odtwarza stan po odświeżeniu lub ponownym otwarciu strony w tej samej przeglądarce;
- rozpoczyna pracę z pustą tablicą, jeśli nie istnieją zapisane dane;
- nie powinna przestać działać, jeśli zapisane dane są uszkodzone — w takim przypadku może uruchomić pustą tablicę.

Wyczyszczenie danych przeglądarki oznacza utratę zadań. W MVP nie ma kopii zapasowej ani synchronizacji.

## 8. Model danych

Minimalny model zadania:

```ts
type Priority = "low" | "medium" | "high";

type TaskStatus = "active" | "completed";

type TaskLocation =
  | "backlog"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  durationMinutes: number;
  status: TaskStatus;
  location: TaskLocation;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

Implementacja może przechowywać kolejność w osobnych tablicach identyfikatorów zamiast pola `order`, jeśli uprości to obsługę przeciągania. Zachowanie widoczne dla użytkownika ma pozostać takie samo.

## 9. Reguły biznesowe

1. Nazwa po usunięciu białych znaków nie może być pusta.
2. Czas musi wynosić co najmniej 15 minut i być wielokrotnością 15 minut.
3. Każde zadanie ma dokładnie jeden z trzech priorytetów.
4. Każde zadanie znajduje się dokładnie w jednym miejscu.
5. Oznaczenie zadania jako wykonane nie zmienia jego miejsca ani kolejności.
6. Aplikacja nie przenosi samodzielnie zadań pomiędzy listą i dniami.
7. Aplikacja nie resetuje automatycznie tygodnia.
8. Wykonane zadania są uwzględniane w wartości „Zaplanowano”, ale nie w wartości „Pozostało”.

## 10. Stany szczególne

- Pusta lista „Do zaplanowania” wyświetla krótką informację zachęcającą do dodania zadania.
- Pusty dzień pozostaje aktywnym miejscem upuszczania zadań.
- Pod pustym dniem obie wartości czasu wynoszą `0 min`.
- Długi tytuł zadania nie może rozbić układu; może zawijać się do kilku wierszy.
- Aplikacja nie musi blokować bardzo dużej liczby godzin przypisanych do jednego dnia.

## 11. Kryteria akceptacji MVP

MVP jest gotowe, jeśli użytkownik może wykonać cały poniższy scenariusz:

1. Otwiera pustą aplikację.
2. Dodaje zadanie „Przygotować prezentację” z wysokim priorytetem i czasem 2 godziny.
3. Zadanie pojawia się na liście „Do zaplanowania”.
4. Edytuje nazwę, priorytet albo czas zadania i widzi zaktualizowane dane.
5. Przeciąga zadanie na środę.
6. Pod środą widzi „Zaplanowano: 2 godz. · Pozostało: 2 godz.”.
7. Dodaje kolejne zadania oraz zmienia ich kolejność.
8. Przenosi zadanie ze środy na piątek, a podsumowania obu dni aktualizują się poprawnie.
9. Oznacza zadanie jako wykonane; pozostaje ono na piątku, a czas „Pozostało” maleje.
10. Ponownie oznacza zadanie jako niewykonane i widzi ponowne zwiększenie pozostałego czasu.
11. Przenosi zadanie z powrotem na listę „Do zaplanowania”.
12. Odświeża stronę i widzi zachowany stan, kolejność oraz statusy zadań.
13. Usuwa zadanie po potwierdzeniu operacji.

## 12. Funkcja planowana po MVP

### Automatyczne planowanie tygodnia

Użytkownik określa dostępny czas dla poszczególnych dni, a następnie uruchamia akcję „Zaplanuj tydzień”. Aplikacja rozdziela aktywne zadania z listy „Do zaplanowania”, biorąc pod uwagę:

- priorytet;
- szacowany czas wykonania;
- dostępny czas w każdym dniu;
- możliwie równomierne obciążenie tygodnia.

Plan powinien być propozycją: użytkownik nadal może dowolnie zmieniać go ręcznie. Funkcja może działać jako deterministyczny algorytm lokalny i nie wymaga generatywnej AI, backendu ani zewnętrznego API.

Możliwe późniejsze rozszerzenie algorytmu to uwzględnienie terminów wykonania, jeśli terminy zostaną dodane do modelu zadania.

## 13. Definicja ukończenia

Pierwsza wersja jest ukończona, gdy:

- wszystkie kryteria akceptacji działają w docelowej przeglądarce desktopowej;
- dane nie są wysyłane poza przeglądarkę;
- aplikacja nie wymaga konfiguracji kluczy ani uruchamiania backendu;
- podstawowy scenariusz można przejść bez błędów;
- interfejs jasno rozróżnia listę zadań, dni, priorytety i zadania wykonane.
