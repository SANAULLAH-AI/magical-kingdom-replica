import axios from 'axios';
import { toast } from 'sonner';

// API Configuration
const API_KEY = '0f012c42b77a742b6b060aa933188a9c'; // Replace with your TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
const DISNEY_API_URL = 'https://api.disneyapi.dev';

// Local Storage Keys
const STORAGE_KEY = '@disney_movies';
const USER_KEY = '@disney_user';
const FAV_KEY = '@disney_favorites';
const HIST_KEY = '@disney_history';
const DOWN_KEY = '@disney_downloads';

// TMDB API endpoints
const endpoints = {
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

// API client with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY
  },
});

// Movie-related API functions
// ... keep existing code

// Auth and User API functions
export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulating API call with localStorage
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo, we'll just create a mock user
    const user: User = {
      id: '123456',
      name: 'Disney Fan',
      email: email,
      avatar: 'https://i.pravatar.cc/150?img=3',
      memberSince: 'January 2022',
      notifications: {
        newContent: true,
        watchlist: true,
        specialOffers: false,
        newsletters: false,
      },
      preferences: {
        autoplay: true,
        playbackQuality: 'auto',
        downloads: {
          wifiOnly: true,
          autoDelete: false,
          videoQuality: 'medium',
        }
      }
    };
    
    // Save to local storage
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid email or password');
  }
};

export const logout = async (): Promise<void> => {
  // In a real app, this would be an API call to invalidate the session
  await new Promise(resolve => setTimeout(resolve, 500));
  localStorage.removeItem(USER_KEY);
  
  // Optionally, you might want to keep favorites and history
  // localStorage.removeItem(FAV_KEY);
  // localStorage.removeItem(HIST_KEY);
};

export const getUserProfile = async (): Promise<User | null> => {
  // In a real app, this would fetch the profile from an API
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (data: { name?: string; email?: string }): Promise<User> => {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) throw new Error('User not found');
    
    const user = JSON.parse(userData);
    const updatedUser = { ...user, ...data };
    
    // Save updated user
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    // In a real app, this would be an API call to validate current password and update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we just simulate success
    // No need to update anything in localStorage for password
    return;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const updateUserNotifications = async (notifications: Record<string, boolean>): Promise<User> => {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) throw new Error('User not found');
    
    const user = JSON.parse(userData);
    const updatedUser = { ...user, notifications };
    
    // Save updated user
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating notifications:', error);
    throw error;
  }
};

export const updateUserPreferences = async (preferences: any): Promise<User> => {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) throw new Error('User not found');
    
    const user = JSON.parse(userData);
    const updatedUser = { ...user, preferences };
    
    // Save updated user
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

// Favorites management
export const getFavorites = async () => {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const favData = localStorage.getItem(FAV_KEY);
    return favData ? JSON.parse(favData) : [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

export const addToFavorites = async (movie: any) => {
  try {
    // Get current favorites
    const favData = localStorage.getItem(FAV_KEY);
    let favorites = favData ? JSON.parse(favData) : [];
    
    // Check if already in favorites
    if (!favorites.some((fav: any) => fav.id === movie.id)) {
      favorites.push(movie);
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
      toast.success(`${movie.title} added to favorites`);
    }
    
    return favorites;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (movieId: string | number) => {
  try {
    // Get current favorites
    const favData = localStorage.getItem(FAV_KEY);
    if (!favData) return [];
    
    let favorites = JSON.parse(favData);
    let removedMovie;
    
    // Remove movie from favorites
    const updatedFavorites = favorites.filter((movie: any) => {
      if (movie.id !== movieId) return true;
      removedMovie = movie;
      return false;
    });
    
    localStorage.setItem(FAV_KEY, JSON.stringify(updatedFavorites));
    if (removedMovie) {
      toast.success(`${removedMovie.title} removed from favorites`);
    }
    
    return updatedFavorites;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Watch history management
export const getWatchHistory = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const histData = localStorage.getItem(HIST_KEY);
    return histData ? JSON.parse(histData) : [];
  } catch (error) {
    console.error('Error fetching watch history:', error);
    return [];
  }
};

export const addToWatchHistory = async (movie: any) => {
  try {
    // Get current history
    const histData = localStorage.getItem(HIST_KEY);
    let history = histData ? JSON.parse(histData) : [];
    
    // Remove if already in history (to move to top)
    history = history.filter((item: any) => item.id !== movie.id);
    
    // Add to top of history with timestamp
    movie.lastWatched = new Date().toISOString();
    history.unshift(movie);
    
    // Limit history to 20 items
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    
    localStorage.setItem(HIST_KEY, JSON.stringify(history));
    return history;
  } catch (error) {
    console.error('Error adding to watch history:', error);
    throw error;
  }
};

// Downloads management
export const getDownloads = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const downData = localStorage.getItem(DOWN_KEY);
    return downData ? JSON.parse(downData) : [];
  } catch (error) {
    console.error('Error fetching downloads:', error);
    return [];
  }
};

export const addToDownloads = async (movie: any) => {
  try {
    // Get current downloads
    const downData = localStorage.getItem(DOWN_KEY);
    let downloads = downData ? JSON.parse(downData) : [];
    
    // Check if already downloaded
    if (!downloads.some((item: any) => item.id === movie.id)) {
      // Add download details
      movie.downloadDate = new Date().toISOString();
      movie.downloadSize = Math.floor(Math.random() * 2000) + 500; // Random size in MB
      downloads.push(movie);
      localStorage.setItem(DOWN_KEY, JSON.stringify(downloads));
      toast.success(`${movie.title} added to downloads`);
    }
    
    return downloads;
  } catch (error) {
    console.error('Error adding to downloads:', error);
    throw error;
  }
};

export const removeFromDownloads = async (movieId: string | number) => {
  try {
    // Get current downloads
    const downData = localStorage.getItem(DOWN_KEY);
    if (!downData) return [];
    
    let downloads = JSON.parse(downData);
    let removedMovie;
    
    // Remove movie from downloads
    const updatedDownloads = downloads.filter((movie: any) => {
      if (movie.id !== movieId) return true;
      removedMovie = movie;
      return false;
    });
    
    localStorage.setItem(DOWN_KEY, JSON.stringify(updatedDownloads));
    if (removedMovie) {
      toast.success(`${removedMovie.title} removed from downloads`);
    }
    
    return updatedDownloads;
  } catch (error) {
    console.error('Error removing from downloads:', error);
    throw error;
  }
};

// Export all the functions and constants
export default {
  // ... keep existing exports
  loginUser,
  logout,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  updateUserNotifications,
  updateUserPreferences,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getWatchHistory,
  addToWatchHistory,
  getDownloads,
  addToDownloads,
  removeFromDownloads,
};
