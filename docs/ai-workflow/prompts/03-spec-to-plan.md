# Prompt: od specyfikacji do `PLAN.md`

## Jak używać

Uruchom po zatwierdzeniu `SPEC.md` oraz dokumentu technicznego. Wynikiem ma być
plan pracy dla agentów, a nie implementacja.

## Prompt

```text
Zamień zatwierdzone SPEC.md i STACK.md/TECHNICAL_DESIGN.md na prosty,
wykonywalny plan implementacji dla agentów AI.

Materiały:
- SPEC.md: <ścieżka lub treść>
- Dokument techniczny: <ścieżka lub treść>
- Stan istniejącego repozytorium: <...>
- Ograniczenia czasu lub wydania: <...>

Nie implementuj kodu, nie twórz branchy i nie zakładaj jeszcze Issues.

Zasady planowania:
1. Każde zadanie ma prowadzić do jednego spójnego, możliwego do zweryfikowania
   rezultatu.
2. Zadanie nie może być tak szerokie, żeby mieszało kilka niezależnych funkcji,
   ani tak drobne, żeby PR nie miał realnej wartości.
3. Najpierw zaplanuj redukcję największych ryzyk i ustalenie stabilnych
   kontraktów, później implementację zależnych funkcji.
4. Preferuj działające przyrosty produktu zamiast długich etapów infrastruktury.
5. Nie dodawaj zadań, które nie wynikają ze SPEC.md, dokumentu technicznego albo
   koniecznej jakości wydania.
6. Dla każdego spike'u dodaj zadanie usunięcia kodu eksperymentalnego lub
   świadomego przekształcenia go w kod produkcyjny.
7. Wskaż zadania możliwe do wykonania równolegle. Zaznacz ryzyko nakładania się
   plików, danych lub kontraktów.
8. Dla projektów z UI dodaj bramkę makiety, prototypu lub wariantów przed
   kosztowną implementacją docelowego wyglądu.
9. Dobierz poziom weryfikacji do ryzyka: mała zmiana, funkcja, milestone/wydanie.
10. Aktualizacja dokumentacji i trackera jest częścią zadania, nie osobnym
    rytuałem na końcu całego projektu.

Przygotuj PLAN.md z sekcjami:
1. Cel planu i definicja ukończenia projektu.
2. Założenia oraz źródła prawdy.
3. Mapa zależności.
4. Milestone'y opisujące działający rezultat.
5. Lista zadań w rekomendowanej kolejności.
6. Zadania możliwe do wykonania równolegle.
7. Ryzyka przekrojowe i decyzje wymagające człowieka.
8. Bramka końcowa i sposób zamknięcia wydania.

Każde zadanie opisz według formatu:

## <ID i krótki tytuł>

Cel:
<jaki problem rozwiązuje>

Rezultat:
<co będzie działać po zakończeniu>

Zakres:
- <elementy wymagane>

Poza zakresem:
- <rzeczy podobne, których zadanie nie obejmuje>

Kryteria akceptacji:
- <obserwowalne i testowalne zachowania>

Weryfikacja:
- <testy automatyczne, ręczne i poziom bramki>

Zależności:
- <zadania lub decyzje blokujące>

Ryzyka i punkt zatrzymania:
- <co może wymagać powrotu do planowania>

Równoległość:
- <czy można wykonywać równolegle i z czym>

Na końcu sprawdź pokrycie:
- każde wymaganie MVP wskazuje co najmniej jedno zadanie;
- każde zadanie wskazuje wymaganie lub konieczną kontrolę jakości;
- żadna funkcja po MVP nie trafiła przypadkiem do planu;
- krytyczne ryzyka są sprawdzane przed kosztowną implementacją;
- plan nie wymaga od człowieka ręcznego sterowania każdym krokiem.
```
