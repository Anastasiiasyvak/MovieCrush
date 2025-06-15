'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './CastBlock.module.css';
import { getTMDBCast } from '@/services/tmdbAPI';

interface Actor {
    id: number;                     // ← новый ключ
    name: string;
    character: string;
    photo: string;
}

interface CastBlockProps {
    tmdbId: number;
}

export default function CastBlock({ tmdbId }: CastBlockProps) {
    const [cast, setCast] = useState<Actor[]>([]);
    const router = useRouter();

    useEffect(() => {
        getTMDBCast(tmdbId).then(setCast); // функция должна отдавать id!
    }, [tmdbId]);

    if (!cast.length) return null;

    return (
        <section className={styles.cast}>
            <h2 className={styles.title}>Cast</h2>
            <div className={styles.scroller}>
                {cast.map((actor) => (
                    <div
                        key={actor.id}
                        className={styles.card}
                        onClick={() => router.push(`/actor/${actor.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
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
