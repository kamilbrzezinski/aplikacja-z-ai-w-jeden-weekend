import styles from './App.module.css';

export function App() {
  return (
    <main className={styles.shell}>
      <section className={styles.intro} aria-labelledby="app-title">
        <p className={styles.eyebrow}>Organizer tygodnia</p>
        <h1 id="app-title">Zaplanuj tydzień po swojemu</h1>
        <p>
          Fundament aplikacji jest gotowy. W kolejnych krokach pojawią się tutaj
          zadania do zaplanowania i siedem dni tygodnia.
        </p>
      </section>
    </main>
  );
}
