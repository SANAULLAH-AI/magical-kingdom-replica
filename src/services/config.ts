
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
