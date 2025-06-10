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
  const [randomMovies, setRandomMovies] = useState<MovieInfo[]>([]);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const searchTerms = [
          'action', 'comedy', 'drama', 'sci-fi', 'horror', 
          'adventure', 'romance', 'thriller', 'mystery', 'fantasy'
        ];
        
        const searchPromises = searchTerms.map(async (term) => {
          const response = await fetch(
            `${BASE_URL}?apikey=${API_KEY}&s=${term}&type=movie&page=${Math.floor(Math.random() * 5) + 1}`
          );
          const data = await response.json();
          return data.Search || [];
        });

        const searchResults = (await Promise.all(searchPromises)).flat();
        
        const uniqueMovies = searchResults.filter(
          (movie, index, self) => 
            index === self.findIndex(m => m.imdbID === movie.imdbID)
        );

        const shuffled = [...uniqueMovies].sort(() => 0.5 - Math.random());
        const selectedMovies = shuffled.slice(0, 50);

        const detailedMoviesPromises = selectedMovies.map(async (movie: any) => {
          try {
            const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${movie.imdbID}`);
            const data = await response.json();
            
            if (data.Response === 'True') {
              return {
                imdbID: data.imdbID,
                title: data.Title,
                year: data.Year,
                poster: data.Poster,
                imdbRating: data.imdbRating
              };
            }
            return null;
          } catch {
            return null;
          }
        });

        const detailedMovies = (await Promise.all(detailedMoviesPromises))
          .filter(movie => movie !== null) as MovieInfo[];

        setRandomMovies(detailedMovies);
      } catch (err) {
        console.error('Error fetching random movies:', err);
        setError('Failed to fetch recommendations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomMovies();
  }, []);

  const handleMovieClick = (id: string) => {
    router.push(`/movie/${id}`);
  };

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.recommendationsPage}>
          <div className={styles.header}>
            <Logo />
            <h1 className={styles.pageTitle}>Random Movie Recommendations</h1>
          </div>
          <div className={styles.loading}>Loading movies...</div>
        </div>
        <Footer defaultSelected="Recommendations" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.recommendationsPage}>
          <div className={styles.header}>
            <Logo />
            <h1 className={styles.pageTitle}>Random Movie Recommendations</h1>
          </div>
          <div className={styles.error}>{error}</div>
        </div>
        <Footer defaultSelected="Recommendations" />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.recommendationsPage}>
        <div className={styles.header}>
          <Logo />
          <h1 className={styles.pageTitle}>Random Movie Recommendations</h1>
        </div>

        <div className={styles.content}>
          {randomMovies.length === 0 ? (
            <div className={styles.noRecommendations}>
              <p>No movies found. Please try again later.</p>
            </div>
          ) : (
            <div className={styles.recommendationSection}>
              <h2 className={styles.sectionTitle}>50 Random Movies</h2>
              <div className={styles.moviesGrid}>
                {randomMovies.map(movie => (
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
                      <div className={styles.noPoster}>No poster available</div>
                    )}
                    <div className={styles.movieInfo}>
                      <h3 className={styles.movieTitle}>{movie.title} ({movie.year})</h3>
                      <div className={styles.movieMeta}>
                        {movie.imdbRating && (
                          <div className={styles.ratingBadge}>
                            <span className={styles.starIcon}>★</span>
                            <span>{movie.imdbRating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer defaultSelected="Recommendations" />
    </div>
  );
}