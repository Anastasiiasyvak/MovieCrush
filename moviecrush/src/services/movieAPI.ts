export const API_KEY = '7a0efd92';
export const BASE_URL = 'https://www.omdbapi.com/';

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface ApiResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) return [];

  try {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    if (data.Response === 'True' && data.Search) {
      return data.Search;
    }
    
    console.error(data.Error || 'No movies found');
    return [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};