'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BASE_URL, API_KEY } from '@/services/movieAPI';
import { Logo } from '@/components/Logo/Logo';
import { Footer } from '@/components/Footer/Footer';
import styles from './recommendations.module.css';

interface MovieInfo {
  imdbID: string;
  title: string;
  year: string;
  poster: string;
  imdbRating?: string;
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState<MovieInfo[]>([]);

  /* ─────────────────────────────── */
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        /* ── 1. извлекаем жанры пользователя ── */
        const userId = localStorage.getItem('userId');
        let userGenres: string[] = [];

        if (userId) {
          const users = await fetch('/api/users').then(r => r.json());
          const currentUser = users.find((u: any) => u.id === userId);
          userGenres = currentUser?.genres || [];
        }

        /* ── 2. если пусто – fallback на дефолт ── */
        const defaultGenres = [
          'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror',
          'Adventure', 'Romance', 'Thriller', 'Mystery', 'Fantasy',
        ];
        const searchTerms = userGenres.length ? userGenres : defaultGenres;

        /* ── 3. выбираем случайные фильмы по жанрам ── */
        const searchPromises = searchTerms.map(async term => {
          const page = Math.floor(Math.random() * 5) + 1;
          const r = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${term}&type=movie&page=${page}`);
          const d = await r.json();
          return d.Search || [];
        });

        const uniqueMovies = (await Promise.all(searchPromises))
            .flat()
            .filter((m, i, arr) => i === arr.findIndex(x => x.imdbID === m.imdbID));

        const random50 = uniqueMovies.sort(() => 0.5 - Math.random()).slice(0, 50);

        /* ── 4. получаем детальную инфу ── */
        const detailed = (
            await Promise.all(
                random50.map(async (m: any) => {
                  try {
                    const r = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${m.imdbID}`);
                    const d = await r.json();
                    return d.Response === 'True'
                        ? {
                          imdbID: d.imdbID,
                          title: d.Title,
                          year: d.Year,
                          poster: d.Poster,
                          imdbRating: d.imdbRating,
                        }
                        : null;
                  } catch {
                    return null;
                  }
                })
            )
        ).filter(Boolean) as MovieInfo[];

        setMovies(detailed);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch recommendations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);
  /* ─────────────────────────────── */

  const handleMovieClick = (id: string) => router.push(`/movie/${id}`);

  /* ── UI ─────────────────────────── */
  const Body = () => (
      <div className={styles.content}>
        {movies.length === 0 ? (
            <div className={styles.noRecommendations}>
              <p>No movies found. Please try again later.</p>
            </div>
        ) : (
            <div className={styles.recommendationSection}>
              <h2 className={styles.sectionTitle}>Recommended for You</h2>
              <div className={styles.moviesGrid}>
                {movies.map(movie => (
                    <div
                        key={movie.imdbID}
                        className={styles.movieCard}
                        onClick={() => handleMovieClick(movie.imdbID)}
                    >
                      {movie.poster !== 'N/A' ? (
                          <Image
                              src={movie.poster}
                              alt={movie.title}
                              width={200}
                              height={300}
                              className={styles.posterImage}
                          />
                      ) : (
                          <div className={styles.noPoster}>No poster</div>
                      )}
                      <div className={styles.movieInfo}>
                        <h3 className={styles.movieTitle}>
                          {movie.title} ({movie.year})
                        </h3>
                        {movie.imdbRating && (
                            <div className={styles.ratingBadge}>
                              <span className={styles.starIcon}>★</span>
                              <span>{movie.imdbRating}</span>
                            </div>
                        )}
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}
      </div>
  );

  return (
      <div className={styles.pageContainer}>
        <div className={styles.recommendationsPage}>
          <div className={styles.header}>
            <Logo />
            <h1 className={styles.pageTitle}>Movie Recommendations</h1>
          </div>

          {isLoading ? (
              <p className={styles.loading}>Loading movies...</p>
          ) : error ? (
              <p className={styles.error}>{error}</p>
          ) : (
              <Body />
          )}
        </div>
        <Footer defaultSelected="Recommendations" />
      </div>
  );
}
