# Prompt: najprostsze sensowne rozwiązanie techniczne

## Jak używać

Uruchom po zatwierdzeniu i niezależnym review `SPEC.md`. Agent może analizować
istniejące repozytorium, ale nie powinien jeszcze implementować rozwiązania.

## Prompt

```text
Zaprojektuj najprostsze rozwiązanie techniczne, które w pełni realizuje
zatwierdzony SPEC.md.

Materiały:
- SPEC.md: <ścieżka lub treść>
- Istniejące repozytorium: <ścieżka albo „brak”>
- Twarde ograniczenia technologiczne lub organizacyjne: <...>

Na tym etapie nie zmieniaj kodu i nie twórz planu zadań.

Zasady:
1. Najpierw przeczytaj SPEC.md i sprawdź, czy nie zawiera otwartych decyzji lub
   sprzeczności. Jeżeli zawiera bloker produktowy, zatrzymaj się i opisz go.
2. Jeżeli istnieje repozytorium, sprawdź używany stos i konwencje. Preferuj
   rozwiązania już obecne w projekcie.
3. Wybierz najmniejszą liczbę komponentów, usług, zależności i warstw potrzebną
   do bieżącego zakresu.
4. Nie projektuj funkcji „na przyszłość”, systemu pluginów, mikroserwisów,
   ogólnego frameworka ani warstwy abstrakcji bez wymagania w SPEC.md.
5. Nie dodawaj zależności, jeśli problem można czytelnie rozwiązać mechanizmem
   platformy lub małym fragmentem własnego kodu.
6. Porównuj warianty tylko wtedy, gdy wybór ma istotny wpływ na dane,
   bezpieczeństwo, koszt, utrzymanie albo możliwość późniejszej zmiany.
7. Decyzje trudne do odwrócenia przedstaw mi do akceptacji. Dla pozostałych
   wybierz rekomendowany najprostszy wariant i uzasadnij go krótko.
8. Oddziel wymagania bieżące od hipotetycznych rozszerzeń.
9. Jeżeli największe ryzyko zależy od nieznanej biblioteki lub integracji,
   zaproponuj ograniczony spike. Spike musi mieć pytanie badawcze, limit zakresu,
   kryterium zakończenia i plan usunięcia kodu eksperymentalnego.

Przygotuj dokument STACK.md albo TECHNICAL_DESIGN.md zawierający:
1. Podsumowanie rozwiązania w kilku zdaniach.
2. Granice systemu i elementy poza zakresem.
3. Główne komponenty oraz przepływ danych.
4. Model danych i własność danych, jeśli dotyczy.
5. Interfejsy między komponentami lub usługami.
6. Wybrane technologie i uzasadnienie każdej nowej zależności.
7. Obsługę błędów, bezpieczeństwo, prywatność i uprawnienia.
8. Strategię testowania proporcjonalną do ryzyka.
9. Sposób uruchomienia, budowania i wdrożenia.
10. Największe ryzyka oraz sposób ich wczesnej walidacji.
11. Odrzucone alternatywy — tylko te, które naprawdę rozważano.
12. Decyzje wymagające człowieka.
13. Elementy specyficzne dla projektu, których nie należy kopiować jako zasad
    uniwersalnych.

Na końcu wykonaj self-review:
- Czy rozwiązanie spełnia każde wymaganie MVP?
- Co można usunąć bez naruszenia SPEC.md?
- Czy jakaś abstrakcja istnieje wyłącznie dla przyszłego użycia?
- Czy nowa zależność ma wyraźną wartość?
- Czy planowany spike ma sposób zakończenia?
```
