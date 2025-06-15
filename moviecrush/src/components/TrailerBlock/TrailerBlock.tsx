'use client';
import React, { useEffect, useState } from 'react';
import styles from './TrailerBlock.module.css';
import { getTMDBTrailer } from '@/services/tmdbAPI';

export default function TrailerBlock({ tmdbId }: { tmdbId: number }) {
    const [trailerId, setTrailerId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrailer = async () => {
            const id = await getTMDBTrailer(tmdbId);
            setTrailerId(id);
        };
        fetchTrailer();
    }, [tmdbId]);

    if (!trailerId) return null;

    return (
        <div className={styles.trailerBlock}>
            <h2 className={styles.title}>Trailer</h2>
            <div className={styles.videoWrapper}>
                <iframe
                    src={`https://www.youtube.com/embed/${trailerId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
