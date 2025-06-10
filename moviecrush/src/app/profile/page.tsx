'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Logo } from '@/components/Logo/Logo';
import { Footer } from '@/components/Footer/Footer';
import { ListButtons } from '@/components/ListButtons/ListButtons';
import styles from './profile.module.css';

interface MovieItem {
  imdbID: string;
  title: string;
  poster: string;
  dateAdded?: string;
  dateWatched?: string;
  userRating?: number;
}

interface UserProfile {
  id: string;
  nickname: string;
  photo: string;
  email: string;
  favorite: MovieItem[];
  watched: MovieItem[];
  watchlist: MovieItem[];
}

type ListType = 'Favorite' | 'Watchlist' | 'Watched';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeList, setActiveList] = useState<ListType>('Favorite');
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

        const res = await fetch(`/api/users/${userId}`);
        const user = await res.json();

        if (user) {
          setUserProfile(user);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [router]);

  const handleListChange = (selected: ListType) => {
    setActiveList(selected);
  };

  const goToMoviePage = (movieId: string) => {
    router.push(`/movie/${movieId}`);
  };

  const goToSettings = () => {
    router.push('/settings');
  };

  const renderActiveList = () => {
    if (!userProfile) return null;

    let movies: MovieItem[] = [];
    let dateLabel = '';

    switch (activeList) {
      case 'Favorite':
        movies = userProfile.favorite;
        dateLabel = 'Added';
        break;
      case 'Watchlist':
        movies = userProfile.watchlist;
        dateLabel = 'Added';
        break;
      case 'Watched':
        movies = userProfile.watched;
        dateLabel = 'Watched';
        break;
    }

    if (movies.length === 0) {
      return <div className={styles.emptyList}>No movies in this list yet</div>;
    }

    return (
        <div className={styles.moviesList}>
          {movies.map((movie) => (
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
            <div style={{ color: '#FFE566', textAlign: 'center', marginTop: '2rem' }}>Loading...</div>
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
            <div style={{ color: '#FFE566', textAlign: 'center', marginTop: '2rem' }}>User not found</div>
          </div>
          <Footer defaultSelected="Profile" />
        </div>
    );
  }

  const joinDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
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
                <span className={styles.watchCount}>{userProfile.watched.length}</span>
                <span className={styles.watchLabel}>Movies watched</span>
              </div>
            </div>

            <div className={styles.listsSection}>
              <ListButtons defaultSelected={activeList} onSelectionChange={handleListChange} />
              {renderActiveList()}
            </div>
          </div>
        </div>
        <Footer defaultSelected="Profile" />
      </div>
  );
}
