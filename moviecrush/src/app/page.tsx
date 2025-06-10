import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { Logo } from '@/components/Logo/Logo';

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <Logo />
        </div>
        
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Welcome to <span className={styles.brandName}>MovieCrush!</span>
          </h1>
          <p className={styles.welcomeSubtitle}>
            Discover your next favorite movie and share your passion with the world
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <Link href="/register" className={styles.primaryButton}>
            Get Started
          </Link>
          <Link href="/login" className={styles.secondaryButton}>
            Sign In
          </Link>
        </div>

        <div className={styles.featuresPreview}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🎬</div>
            <span>Discover Movies</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>⭐</div>
            <span>Rate & Review</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>💝</div>
            <span>Get Recommendations</span>
          </div>
        </div>
      </div>
    </div>
  );
}