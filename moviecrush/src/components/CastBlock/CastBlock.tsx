'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './CastBlock.module.css';
import { getTMDBCast } from '@/services/tmdbAPI';

interface CastBlockProps {
    tmdbId: number;
}

export default function CastBlock({ tmdbId }: CastBlockProps) {
    const [cast, setCast] = useState<{ name: string; character: string; photo: string }[]>([]);

    useEffect(() => {
        getTMDBCast(tmdbId).then(setCast);
    }, [tmdbId]);

    if (!cast.length) return null;

    return (
        <section className={styles.cast}>
            <h2 className={styles.title}>Cast</h2>
            <div className={styles.scroller}>
                {cast.map((actor, index) => (
                    <div key={index} className={styles.card}>
                        {actor.photo ? (
                            <Image
                                src={actor.photo}
                                alt={actor.name}
                                fill
                                className={styles.image}
                                sizes="(max-width: 768px) 40vw, 20vw"
                            />
                        ) : (
                            <div className={styles.placeholder}>No image</div>
                        )}
                        <div className={styles.caption}>
                            <div className={styles.name}>{actor.name}</div>
                            <div className={styles.role}>{actor.character}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
