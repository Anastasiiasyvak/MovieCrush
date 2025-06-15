'use client';
import React from 'react';
import styles from './ShareBar.module.css';

interface ShareBarProps {
    movieTitle: string;
    movieId: string;
}

export default function ShareBar({ movieTitle, movieId }: ShareBarProps) {
    const url = `http://localhost:3000/movie/${movieId}`;
    const encodedURL = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(`You HAVE to see this movie! 🍿 "${movieTitle}" totally got me. Check it out!!`);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            alert('🔗 Link copied!');
        } catch (err) {
            alert('Failed to copy link');
        }
    };

    return (
        <div className={styles.shareBar}>
            <a
                href={`mailto:?subject=${encodedTitle}&body=${encodedURL}`}
                className={styles.shareButton}
                title="Email"
            >
                📩
                <span className={styles.shareLabel}>Email</span>
            </a>
            <a
                href={`https://t.me/share/url?url=${encodedURL}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareButton}
                title="Telegram"
            >
                💬
                <span className={styles.shareLabel}>Telegram</span>
            </a>
            <a
                href={`https://wa.me/?text=${encodedTitle}%20${encodedURL}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareButton}
                title="WhatsApp"
            >
                📱
                <span className={styles.shareLabel}>WhatsApp</span>
            </a>
            <button
                onClick={handleCopy}
                className={styles.shareButton}
                title="Copy"
            >
                🔗
                <span className={styles.shareLabel}>Copy</span>
            </button>
        </div>
    );
}
