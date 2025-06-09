'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BASE_URL, API_KEY } from '@/services/movieAPI';
import styles from './MoviesList.module.css';

interface Movie {
  imdbID: string;
  Poster: string;
  Title: string;
  Year: string;
}

interface MoviesListProps {
  onMovieClick: (imdbID: string) => void;
}

export default function MoviesList({ onMovieClick }: MoviesListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const topMoviesIds = [
    'tt3566834', 'tt12299608', 'tt31806037', 'tt2172954', 'tt29603959',
    'tt2085059', 'tt28443655', 'tt30988739', 'tt32221196', 'tt4772188'
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await Promise.all(
          topMoviesIds.map(id => 
            fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`)
              .then(res => res.json())
          )
        );
        setMovies(moviesData.filter(movie => movie.Response !== 'Error'));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const imagesPerPage = 6;
  const pagesCount = Math.ceil(movies.length / imagesPerPage);

  const goToNextPage = () => {
    if (currentPage < pagesCount - 1) setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const currentMovies = () => {
    const start = currentPage * imagesPerPage;
    return movies.slice(start, start + imagesPerPage);
  };

  if (isLoading) return <div className={styles.loading}>Loading top movies...</div>;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Top 10 movies this week</h2>
      <div className={styles.carouselWrapper}>
        <button 
          className={styles.carouselArrow} 
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          aria-label="Previous page"
        >
          &#8249;
        </button>
        
        <div className={styles.carouselContainer}>
          <div className={styles.carouselContent}>
            {currentMovies().map(movie => (
              <div 
                key={movie.imdbID} 
                className={styles.movieItem}
                onClick={() => onMovieClick(movie.imdbID)}
              >
                <Image
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg'}
                  alt={movie.Title}
                  className={styles.movieImage}
                  width={200}
                  height={300}
                  unoptimized // Remove if you configure image optimization
                />
                <h3 className={styles.movieTitle}>{movie.Title} ({movie.Year})</h3>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className={styles.carouselArrow} 
          onClick={goToNextPage}
          disabled={currentPage === pagesCount - 1}
          aria-label="Next page"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}