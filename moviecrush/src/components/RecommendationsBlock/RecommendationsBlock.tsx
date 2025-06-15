'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './RecommendationsBlock.module.css';
import {
    getTMDBRecommendations,
    getIMDbIdByTMDB,
} from '@/services/tmdbAPI';

interface RecommendationsBlockProps {
    tmdbId: number;
}

type RecMovie = {
    tmdbId: number;
    imdbId: string;
    title: string;
    poster: string;
};

export default function RecommendationsBlock({ tmdbId }: RecommendationsBlockProps) {
    const [recs, setRecs] = useState<RecMovie[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchRecs = async () => {
            const raw = await getTMDBRecommendations(tmdbId);
            const enhanced = await Promise.all(
                raw.map(async (m) => {
                    const imdb = await getIMDbIdByTMDB(m.id);
                    return imdb
                        ? { tmdbId: m.id, imdbId: imdb, title: m.title, poster: m.poster }
                        : null;
                })
            );
            setRecs(enhanced.filter(Boolean) as RecMovie[]);
        };
        fetchRecs();
    }, [tmdbId]);

    if (!recs.length) return null;

    return (
        <section className={styles.recs}>
            <h2 className={styles.title}>Recommended</h2>
            <div className={styles.scroller}>
                {recs.map((movie) => (
                    <div
                        key={movie.tmdbId}
                        className={styles.card}
                        onClick={() => router.push(`/movie/${movie.imdbId}`)}
                    >
                        {movie.poster ? (
                            <Image
                                src={movie.poster}
                                alt={movie.title}
                                fill
                                className={styles.image}
                                sizes="(max-width:768px) 50vw, 20vw"
                            />
                        ) : (
                            <div className={styles.noPoster}>No poster</div>
                        )}
                        <div className={styles.caption}>{movie.title}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
