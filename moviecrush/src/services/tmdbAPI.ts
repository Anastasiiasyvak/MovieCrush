const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = 'f02cc849d4e4b73d026faac76ced9f4d';

export const getTMDBId = async (imdbID: string): Promise<number | null> => {
    const res = await fetch(`${TMDB_BASE}/find/${imdbID}?api_key=${TMDB_API_KEY}&external_source=imdb_id`);
    const data = await res.json();
    return data.movie_results?.[0]?.id || null;
};

export const getTMDBTrailer = async (tmdbId: number): Promise<string | null> => {
    const res = await fetch(`${TMDB_BASE}/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    const trailer = data.results.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
    return trailer?.key || null;
};

export const getTMDBImages = async (tmdbId: number): Promise<string[]> => {
    const res = await fetch(`${TMDB_BASE}/movie/${tmdbId}/images?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return data.backdrops?.slice(0, 5).map((img: any) => `https://image.tmdb.org/t/p/w780${img.file_path}`) || [];
};

export const getTMDBCast = async (tmdbId: number): Promise<{ name: string; character: string; photo: string }[]> => {
    const res = await fetch(`${TMDB_BASE}/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return data.cast?.slice(0, 10).map((actor: any) => ({
        name: actor.name,
        character: actor.character,
        photo: actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '',
    })) || [];
};

export const getTMDBRecommendations = async (tmdbId: number): Promise<{ title: string; poster: string; id: number }[]> => {
    const res = await fetch(`${TMDB_BASE}/movie/${tmdbId}/recommendations?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return data.results?.slice(0, 6).map((movie: any) => ({
        title: movie.title,
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : '',
        id: movie.id,
    })) || [];
};
