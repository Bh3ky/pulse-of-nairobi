import ScrollyStory from '@/components/ScrollyStory';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.intro}>
        <div className={styles.introContent}>
          <h1 className={styles.title}>
            What if a city <span className={styles.highlight}>breathed</span>?
          </h1>
          <p className={styles.subtitle}>
            An exploration of Nairobi's urban stress through the lens of human physiology
          </p>
          <div className={styles.scrollIndicator}>
            <span>Scroll to begin</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      <ScrollyStory />
    </main>
  );
}
