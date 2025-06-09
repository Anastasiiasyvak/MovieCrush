'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Logo } from '@/components/Logo/Logo';
import { Footer } from '@/components/Footer/Footer';
import { ListButtons } from '@/components/ListButtons/ListButtons';
import styles from './profile.module.css';

interface UserProfile {
  id: string;
  nickname: string;
  photo: string;
  email: string;
  favorite: string[];
  watched: string[];
  watchlist: string[];
}

interface MovieItem {
  imdbID: string;
  title: string;
  poster: string;
  dateAdded?: string;
  dateWatched?: string;
  userRating?: number;
}

type ListType = 'Favorite' | 'Watchlist' | 'Watched';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeList, setActiveList] = useState<ListType>('Favorite');
  const [favoriteMovies, setFavoriteMovies] = useState<MovieItem[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<MovieItem[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/login');
          return;
        }

        // Завантажуємо дані користувача
        const response = await fetch('/api/users');
        const users = await response.json();
        const user = users.find((u: UserProfile) => u.id === userId);

        if (user) {
          setUserProfile(user);
          
          // Завантажуємо деталі фільмів для кожного списку
          await loadMovieDetails(user.favorite, setFavoriteMovies);
          await loadMovieDetails(user.watchlist, setWatchlistMovies);
          await loadMovieDetails(user.watched, setWatchedMovies);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [router]);

  const loadMovieDetails = async (movieIds: string[], setMovies: React.Dispatch<React.SetStateAction<MovieItem[]>>) => {
    if (movieIds.length === 0) {
      setMovies([]);
      return;
    }

    try {
      const movieDetails = await Promise.all(
        movieIds.map(async (id) => {
          const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=YOUR_API_KEY`);
          const movie = await response.json();
          return {
            imdbID: movie.imdbID,
            title: movie.Title,
            poster: movie.Poster,
            dateAdded: new Date().toLocaleDateString(), // Можна зберігати реальну дату
          };
        })
      );
      setMovies(movieDetails.filter(movie => movie.title));
    } catch (error) {
      console.error('Error loading movie details:', error);
      setMovies([]);
    }
  };

  const goToSettings = () => {
    router.push('/settings');
  };

  const handleListChange = (selected: ListType) => {
    setActiveList(selected);
  };

  const goToMoviePage = (movieId: string) => {
    router.push(`/movie/${movieId}`);
  };

  const renderActiveList = () => {
    let movies: MovieItem[] = [];
    let dateLabel = '';
    
    switch (activeList) {
      case 'Favorite':
        movies = favoriteMovies;
        dateLabel = 'Added';
        break;
      case 'Watchlist':
        movies = watchlistMovies;
        dateLabel = 'Added';
        break;
      case 'Watched':
        movies = watchedMovies;
        dateLabel = 'Watched';
        break;
    }
    
    if (movies.length === 0) {
      return (
        <div className={styles.emptyList}>
          No movies in this list yet
        </div>
      );
    }
    
    return (
      <div className={styles.moviesList}>
        {movies.map(movie => (
          <div 
            key={movie.imdbID} 
            className={styles.movieItem}
            onClick={() => goToMoviePage(movie.imdbID)}
          >
            <span className={styles.movieTitle}>{movie.title}</span>
            <span className={styles.movieDate}>
              {dateLabel}: {activeList === 'Watched' ? movie.dateWatched : movie.dateAdded}
              {movie.userRating ? ` • Rating: ${movie.userRating}/10` : ''}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.profilePage}>
          <div className={styles.header}>
            <Logo />
          </div>
          <div style={{ color: '#FFE566', textAlign: 'center', marginTop: '2rem' }}>
            Loading...
          </div>
        </div>
        <Footer defaultSelected="Profile" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.profilePage}>
          <div className={styles.header}>
            <Logo />
          </div>
          <div style={{ color: '#FFE566', textAlign: 'center', marginTop: '2rem' }}>
            User not found
          </div>
        </div>
        <Footer defaultSelected="Profile" />
      </div>
    );
  }

  const joinDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profilePage}>
        <div className={styles.header}>
          <Logo />
          <div className={styles.settingsIconContainer}>
            <Image
              src="/settings.png"
              alt="Settings"
              width={24}
              height={24}
              className={styles.settingsIcon}
              onClick={goToSettings}
            />
          </div>
        </div>

        <div className={styles.profileContent}>
          <div className={styles.userInfo}>
            <div className={styles.avatarContainer}>
              {userProfile.photo ? (
                <Image
                  src={userProfile.photo}
                  alt="User avatar"
                  width={150}
                  height={150}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder}></div>
              )}
            </div>
            <h2 className={styles.username}>{userProfile.nickname}</h2>
            <p className={styles.userMeta}>Member since {joinDate}</p>
            <div className={styles.watchStatsContainer}>
              <span className={styles.watchCount}>{watchedMovies.length}</span>
              <span className={styles.watchLabel}>Movies watched</span>
            </div>
          </div>

          <div className={styles.listsSection}>
            <ListButtons 
              defaultSelected={activeList} 
              onSelectionChange={handleListChange} 
            />
            {renderActiveList()}
          </div>
        </div>
      </div>
      <Footer defaultSelected="Profile" />
    </div>
  );
}