'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Movie, searchMovies } from '@/services/movieAPI';
import Search from '@/components/Search/Search';
import {Logo} from '@/components/Logo/Logo';
import {Footer} from '@/components/Footer/Footer';
import MoviesList from '@/components/MoviesList/MoviesList';
import styles from './search.module.css';

export default function SearchPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = useCallback(async (query: string) => {
    // Якщо запит порожній, очищаємо результати
    if (!query.trim()) {
      setMovies([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchMovies(query);
      setMovies(results);
      
      if (results.length === 0) {
        setError('No movies found');
      }
    } catch (err) {
      setError('Failed to fetch movies');
      console.error(err);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMovieClick = (imdbID: string) => {
    router.push(`/movie/${imdbID}`);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.searchPage}>
        <div className={styles.header}>
          <Logo />
          <div className={styles.searchContainer}>
            <Search onSearch={handleSearch} />
          </div>
        </div>

        {isLoading && <p className={styles.loading}>Loading search results...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {movies.length > 0 && !isLoading && (
          <>
            <h2 className={styles.resultsTitle}>Search Results</h2>
            <div className={styles.moviesGrid}>
              {movies.map(movie => (
                <div 
                  key={movie.imdbID} 
                  className={styles.movieCard}
                  onClick={() => handleMovieClick(movie.imdbID)}
                >
                  {movie.Poster !== 'N/A' ? (
                    <Image
                      src={movie.Poster}
                      alt={movie.Title}
                      width={200}
                      height={300}
                      className={styles.posterImage}
                    />
                  ) : (
                    <div className={styles.posterPlaceholder}>No poster</div>
                  )}
                  <h3 className={styles.movieTitle}>
                    {movie.Title} ({movie.Year})
                  </h3>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Показуємо MoviesList тільки якщо немає результатів пошуку */}
        {movies.length === 0 && !isLoading && !error && (
          <MoviesList onMovieClick={handleMovieClick} />
        )}
      </div>
      <Footer defaultSelected="Discover" />
    </div>
  );
}