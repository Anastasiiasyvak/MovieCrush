'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './ActorPage.module.css';
import { getIMDbIdByTMDB } from '@/services/tmdbAPI';

interface ActorPageProps {
    actorId: string;
}

/* ── типы ─────────────────────────── */
interface ActorDetails {
    name: string;
    birthday: string;
    biography: string;
    profile_path: string | null;
}

interface MovieCredit {
    tmdbId: number;
    imdbId: string;
    title: string;
    poster_path: string | null;
    character: string;
}

export default function ActorPage({ actorId }: ActorPageProps) {
    const router = useRouter();

    const [actor, setActor] = useState<ActorDetails | null>(null);
    const [credits, setCredits] = useState<MovieCredit[]>([]);

    /* ── загрузка данных ───────────────────────────── */
    useEffect(() => {
        const fetchActorData = async () => {
            const key = 'f02cc849d4e4b73d026faac76ced9f4d';

            /* 1. данные актёра */
            const actorRes = await fetch(
                `https://api.themoviedb.org/3/person/${actorId}?api_key=${key}&language=en-US`
            );
            setActor(await actorRes.json());

            /* 2. сырые кредиты (max 20) */
            const creditsRes = await fetch(
                `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${key}&language=en-US`
            );
            const raw = (await creditsRes.json()).cast.slice(0, 20);

            /* 3. обогащаем imdbId */
            const enriched = await Promise.all(
                raw.map(async (m: any) => {
                    const imdbId = await getIMDbIdByTMDB(m.id);
                    return imdbId
                        ? {
                            tmdbId: m.id,
                            imdbId,
                            title: m.title,
                            poster_path: m.poster_path,
                            character: m.character,
                        }
                        : null;
                })
            );

            setCredits(enriched.filter(Boolean) as MovieCredit[]);
        };

        fetchActorData();
    }, [actorId]);

    if (!actor) return <p className={styles.loading}>Loading...</p>;

    /* ── JSX ─────────────────────────── */
    return (
        <div className={styles.actorPage}>
            {/* back */}
            <div className={styles.backIconContainer} onClick={() => router.back()}>
                <Image src="/back.png" alt="Back" width={24} height={24} className={styles.backIcon} />
            </div>

            {/* header */}
            <div className={styles.header}>
                {actor.profile_path && (
                    <Image
                        src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                        alt={actor.name}
                        width={200}
                        height={300}
                        className={styles.actorImage}
                    />
                )}
                <div className={styles.info}>
                    <h1>{actor.name}</h1>
                    <p>
                        <strong>Birthday:</strong> {actor.birthday || '—'}
                    </p>
                    <p className={styles.bio}>{actor.biography || 'No biography available.'}</p>
                </div>
            </div>

            {/* фильмография */}
            <h2 className={styles.subheading}>Filmography</h2>
            <div className={styles.creditsGrid}>
                {credits.map((movie) => (
                    <div
                        key={movie.tmdbId}
                        className={styles.movieCard}
                        role="button"
                        tabIndex={0}
                        onClick={() => router.push(`/movie/${movie.imdbId}`)}
                    >
                        {movie.poster_path ? (
                            <Image
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                                width={200}
                                height={250}
                                className={styles.posterImage}
                            />
                        ) : (
                            <div className={styles.noPoster}>No poster</div>
                        )}

                        <div className={styles.movieInfo}>
                            <h3 className={styles.movieTitle}>{movie.title}</h3>
                            <p className={styles.movieRole}>{movie.character}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
