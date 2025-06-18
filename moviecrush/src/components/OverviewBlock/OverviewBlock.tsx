'use client';
import React, { useEffect, useState } from 'react';
import styles from './OverviewBlock.module.css';

interface OverviewBlockProps {
    tmdbId: number;
    fallbackPlot?: string;
}

export default function OverviewBlock({ tmdbId, fallbackPlot }: OverviewBlockProps) {
    const [overview, setOverview] = useState<string | null>(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=f02cc849d4e4b73d026faac76ced9f4d`);
                const data = await res.json();
                setOverview(data.overview || fallbackPlot || null);
            } catch (error) {
                setOverview(fallbackPlot || null);
            }
        };

        fetchOverview();
    }, [tmdbId, fallbackPlot]);

    if (!overview) return null;

    return (
        <section className={styles.overview}>
            <h2 className={styles.title}>Overview</h2>
            <p className={styles.text}>{overview}</p>
        </section>
    );
}
