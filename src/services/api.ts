
// API Configuration
export const API_KEY = '0f012c42b77a742b6b060aa933188a9c';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
export const DISNEY_API_URL = 'https://api.disneyapi.dev';

// Local Storage Keys
export const STORAGE_KEY = '@disney_movies';
export const USER_KEY = '@disney_user';
export const FAV_KEY = '@disney_favorites';
export const HIST_KEY = '@disney_history';
export const DOWN_KEY = '@disney_downloads';

// TMDB API endpoints
export const endpoints = {
  trending: `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
  popular: `${BASE_URL}/movie/popular?api_key=${API_KEY}`,
  topRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`,
  disneyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=2`,
  pixarMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=3`,
  marvelMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=420`,
  starWarsMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_keywords=4270`,
  animation: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=16`,
  family: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10751`,
  documentary: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99`,
  movieDetails: (id: string) => `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits,similar`,
  disneyCharacters: `${DISNEY_API_URL}/characters`,
  searchMovies: (query: string) => `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
};

// Interfaces for API responses
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
  videos?: { results: { key: string; type: string }[] };
  credits?: {
    cast: { name: string; character: string; profile_path: string | null }[];
    crew: { name: string; job: string }[];
  };
  similar?: { results: TMDBMovie[] };
}

export interface DisneyCharacter {
  _id: number;
  name: string;
  imageUrl: string;
  films: string[];
  shortFilms: string[];
  tvShows: string[];
  parkAttractions: string[];
  allies: string[];
  enemies: string[];
}

// Convert TMDB movie to our app's Movie format
export const convertTMDBToMovie = (tmdbMovie: TMDBMovie): Movie => {
  // Extract year from release date
  const year = tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : '';
  
  // Format runtime
  const runtime = tmdbMovie.runtime 
    ? `${Math.floor(tmdbMovie.runtime / 60)}h ${tmdbMovie.runtime % 60}m` 
    : '';
  
  // Extract categories from genres
  const category = tmdbMovie.genres 
    ? tmdbMovie.genres.map(genre => genre.name.toLowerCase()) 
    : [];
  
  // Special handling for Disney content - add additional categories
  if (tmdbMovie.backdrop_path?.includes('disney') || 
      tmdbMovie.title?.includes('Disney') || 
      category.includes('animation')) {
    if (!category.includes('disney')) {
      category.push('disney');
    }
    if (!category.includes('family')) {
      category.push('family');
    }
  }
  
  // Add popular and trending for featured content
  if (tmdbMovie.vote_average > 7) {
    if (!category.includes('popular')) {
      category.push('popular');
    }
    if (!category.includes('trending')) {
      category.push('trending');
    }
  }
  
  return {
    id: tmdbMovie.id.toString(),
    title: tmdbMovie.title,
    description: tmdbMovie.overview,
    posterPath: tmdbMovie.poster_path 
      ? `${IMAGE_BASE_URL}${tmdbMovie.poster_path}` 
      : 'https://via.placeholder.com/500x750?text=No+Image',
    backdropPath: tmdbMovie.backdrop_path 
      ? `${BACKDROP_BASE_URL}${tmdbMovie.backdrop_path}` 
      : 'https://via.placeholder.com/1920x1080?text=No+Backdrop',
    year,
    rating: tmdbMovie.vote_average > 7 ? 'PG' : 'PG-13',
    duration: runtime || '1h 45m', // Default if runtime not available
    category,
    videoUrl: tmdbMovie.videos?.results?.find(v => v.type === 'Trailer')?.key 
      ? `https://www.youtube.com/watch?v=${tmdbMovie.videos.results.find(v => v.type === 'Trailer')?.key}` 
      : undefined,
    logo: undefined // TMDB doesn't provide logos directly
  };
};

// Fetch helper function
export const fetchData = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};
