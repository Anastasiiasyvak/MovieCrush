'use client';

import React, {use, useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BASE_URL, API_KEY } from '@/services/movieAPI';
import ButtonWatch from '@/components/ButtonWatch/ButtonWatch';
import ButtonHeart from '@/components/ButtonHeart/ButtonHeart';
import Score from '@/components/Score/Score';
import ShareBar from '@/components/ShareBar/ShareBar';
import TrailerBlock from '@/components/TrailerBlock/TrailerBlock';
import styles from './movie.module.css';
import {getTMDBId} from "@/services/tmdbAPI";
import GalleryBlock from '@/components/GalleryBlock/GalleryBlock';
import CastBlock from '@/components/CastBlock/CastBlock';
import OverviewBlock from '@/components/OverviewBlock/OverviewBlock';
import RatingBlock from '@/components/RatingBlock/RatingBlock';
import RecommendationsBlock from '@/components/RecommendationsBlock/RecommendationsBlock';




interface MovieDetails {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: { Source: string; Value: string }[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
}

interface MovieUserData {
    isFavorite: boolean;
    isWatched: boolean;
    isWatchlist: boolean;
    userRating: number;
    dateAdded: string;
    dateWatched?: string;
}

export default function MoviePage(props: { params: Promise<{ id: string }> }){
    const router = useRouter();
    const { id } = use(props.params);

    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [movieUserData, setMovieUserData] = useState<MovieUserData>({
        isFavorite: false,
        isWatched: false,
        isWatchlist: false,
        userRating: 0,
        dateAdded: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
                const data = await response.json();

                if (data.Response === 'True') {
                    setMovie(data);
                } else {
                    setError(data.Error || 'Movie not found');
                }
            } catch (error) {
                setError('Failed to fetch movie details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const res = await fetch(`/api/users/${userId}`);
            const user = await res.json();

            const movieFromFav = user.favorite.find((m: any) => m.imdbID === id);
            const movieFromWatched = user.watched.find((m: any) => m.imdbID === id);
            const movieFromWatchlist = user.watchlist.find((m: any) => m.imdbID === id);

            setMovieUserData({
                isFavorite: !!movieFromFav,
                isWatched: !!movieFromWatched,
                isWatchlist: !!movieFromWatchlist,
                userRating: movieFromWatched?.userRating || 0,
                dateAdded: new Date().toISOString().split('T')[0],
                dateWatched: movieFromWatched?.dateWatched
            });
        };

        fetchUserData();
    }, [id]);

    const updateMovieLists = async (data: MovieUserData) => {
        if (!movie) return;
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const movieData = {
            imdbID: movie.imdbID,
            title: movie.Title,
            poster: movie.Poster,
            year: movie.Year,
            director: movie.Director,
            imdbRating: movie.imdbRating,
            ...data
        };

        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) {
            console.error('Failed to fetch user:', await res.text());
            return;
        }
        const user = await res.json();

        const listUpdate = (list: any[], key: keyof MovieUserData) => {
            const index = list.findIndex((m) => m.imdbID === movie.imdbID);
            if (data[key]) {
                if (index === -1) list.push(movieData);
                else list[index] = { ...list[index], ...movieData };
            } else {
                if (index !== -1) list.splice(index, 1);
            }
        };
        listUpdate(user.favorite, 'isFavorite');
        listUpdate(user.watched, 'isWatched');
        listUpdate(user.watchlist, 'isWatchlist');

        await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        setMovieUserData(data);
    };

    const [tmdbId, setTmdbId] = useState<number | null>(null);

    useEffect(() => {
        if (!movie?.imdbID) return;
        getTMDBId(movie.imdbID).then(setTmdbId);
    }, [movie]);


    const toggleFavorite = () => updateMovieLists({ ...movieUserData, isFavorite: !movieUserData.isFavorite });
    const toggleWatched = () => updateMovieLists({
        ...movieUserData,
        isWatched: !movieUserData.isWatched,
        dateWatched: !movieUserData.isWatched ? new Date().toLocaleDateString('en-US') : undefined
    });
    const toggleWatchlist = () => updateMovieLists({ ...movieUserData, isWatchlist: !movieUserData.isWatchlist });
    const handleRatingChange = (rating: number) => updateMovieLists({ ...movieUserData, userRating: rating });

    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!movie) return <div className={styles.error}>No movie data available</div>;

    return (
        <div className={styles.moviePage}>
            <div className={styles.backIconContainer}>
                <Image
                    src="/back.png"
                    alt="Back"
                    width={24}
                    height={24}
                    className={styles.backIcon}
                    onClick={() => router.back()}
                />
            </div>

            <div className={styles.movieHeader}>
                <h1 className={styles.movieTitle}>{movie.Title}</h1>
                <div className={styles.ratingRow}>
                    <div className={styles.ratingContainer}>
                        <svg width="20" height="20" viewBox="0 0 24 24" className={styles.ratingStar}>
                            <path fill="#FFE566" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span className={styles.generalRating}>{movie.imdbRating}</span>
                    </div>
                    <div className={styles.buttonsContainer}>
                        <ButtonHeart initialState={movieUserData.isFavorite} onClick={toggleFavorite} />
                        <ButtonWatch initialState={movieUserData.isWatched} onClick={toggleWatched} />
                        <button
                            className={`${styles.bookmarkButton} ${movieUserData.isWatchlist ? styles.active : ''}`}
                            onClick={toggleWatchlist}
                            aria-label="Add to watchlist"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 stroke={movieUserData.isWatchlist ? '#FFE566' : '#A7A7A7'}
                                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                 className={styles.bookmarkIcon}>
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.movieContent}>
                <div className={styles.posterContainer}>
                    {movie.Poster !== 'N/A' ? (
                        <Image src={movie.Poster} alt={movie.Title} width={200} height={300} className={styles.poster} />
                    ) : (
                        <div className={styles.posterPlaceholder}>No poster available</div>
                    )}
                </div>

                <div className={styles.movieDetails}>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Your score</span>
                        <span className={styles.detailValue}>
                            <Score initialRating={movieUserData.userRating} maxRating={10} onChange={handleRatingChange} />
                        </span>
                    </div>
                    <div className={styles.detailRow}><span className={styles.detailLabel}>Time:</span><span className={styles.detailValue}>{movie.Runtime}</span></div>
                    <div className={styles.detailRow}><span className={styles.detailLabel}>Directed by:</span><span className={styles.detailValue}>{movie.Director}</span></div>
                    <div className={styles.detailRow}><span className={styles.detailLabel}>Writers:</span><span className={styles.detailValue}>{movie.Writer}</span></div>
                    <div className={styles.detailRow}><span className={styles.detailLabel}>Year:</span><span className={styles.detailValue}>{movie.Year}</span></div>
                    <div className={styles.detailRow}><span className={styles.detailLabel}>Genre:</span><span className={styles.detailValue}>{movie.Genre}</span></div>
                    <div className={styles.detailRow}><span className={styles.detailLabel}>Actors:</span><span className={styles.detailValue}>{movie.Actors}</span></div>
                    <div className={styles.detailRow}><span className={styles.detailLabel}>Country:</span><span className={styles.detailValue}>{movie.Country}</span></div>
                    <div className={styles.detailRow}><span className={styles.detailLabel}>Awards:</span><span className={styles.detailValue}>{movie.Awards}</span></div>
                    <ShareBar movieTitle={movie.Title} movieId={movie.imdbID} />
                </div>
            </div>
            {tmdbId && <GalleryBlock tmdbId={tmdbId} />}
            {tmdbId && <TrailerBlock tmdbId={tmdbId} />}
            {tmdbId && <CastBlock tmdbId={tmdbId} />}
            {tmdbId && <OverviewBlock tmdbId={tmdbId} fallbackPlot={movie.Plot} />}
            {movie.Ratings && <RatingBlock ratings={movie.Ratings} />}
            {tmdbId && <RecommendationsBlock tmdbId={tmdbId} />}
        </div>
    );
}
