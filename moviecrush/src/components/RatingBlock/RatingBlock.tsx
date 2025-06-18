'use client';
import React from 'react';
import styles from './RatingBlock.module.css';

interface RatingBlockProps {
    ratings: { Source: string; Value: string }[];
}

export default function RatingBlock({ ratings }: RatingBlockProps) {
    const sources = ['Internet Movie Database', 'Rotten Tomatoes', 'Metacritic'];

    const parseValue = (source: string, value: string) => {
        if (source === 'Internet Movie Database') {
            return parseFloat(value.split('/')[0]) * 10;
        }
        if (source === 'Metacritic') {
            return parseInt(value.split('/')[0]);
        }
        if (value.includes('%')) {
            return parseInt(value);
        }
        return 0;
    };

    const getShortLabel = (source: string) => {
        if (source === 'Internet Movie Database') return 'IMDb';
        if (source === 'Rotten Tomatoes') return 'RT';
        if (source === 'Metacritic') return 'MC';
        return source;
    };

    return (
        <section className={styles.ratingBlock}>
            <h2 className={styles.title}>Ratings</h2>
            {ratings
                .filter(r => sources.includes(r.Source))
                .map((rating) => {
                    const percent = parseValue(rating.Source, rating.Value);
                    const label = getShortLabel(rating.Source);

                    return (
                        <div key={rating.Source} className={styles.ratingRow}>
                            <div className={styles.label}>{label}</div>
                            <div className={styles.barWrapper}>
                                <div className={styles.barFill} style={{ width: `${percent}%` }} />
                            </div>
                            <div className={styles.value}>{rating.Value}</div>
                        </div>
                    );
                })}
        </section>
    );
}
