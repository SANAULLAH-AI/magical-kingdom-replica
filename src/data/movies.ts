import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  endpoints, 
  fetchData, 
  TMDBMovie, 
  convertTMDBToMovie, 
  STORAGE_KEY,
  FAV_KEY
} from '../services/api';

export interface Movie {
  id: string;
  title: string;
  description: string;
  posterPath: string;
  backdropPath: string;
  year: string;
  rating: string;
  duration: string;
  category: string[];
  videoUrl?: string;
  logo?: string;
}

export interface Category {
  id: string;
  name: string;
}

export const categories: Category[] = [
  { id: "popular", name: "Popular" },
  { id: "trending", name: "Trending" },
  { id: "animation", name: "Animation" },
  { id: "action", name: "Action" },
  { id: "adventure", name: "Adventure" },
  { id: "comedy", name: "Comedy" },
  { id: "documentary", name: "Documentary" },
  { id: "drama", name: "Drama" },
  { id: "family", name: "Family" },
  { id: "fantasy", name: "Fantasy" },
  { id: "sci-fi", name: "Science Fiction" },
  { id: "disney", name: "Disney" },
  { id: "pixar", name: "Pixar" },
  { id: "marvel", name: "Marvel" },
  { id: "star-wars", name: "Star Wars" },
];

// Fetch movies by category using the API
export const useMoviesByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['movies', categoryId],
    queryFn: async () => {
      // Map the category to the appropriate endpoint
      let url;
      switch(categoryId) {
        case 'popular':
          url = endpoints.popular;
          break;
        case 'trending':
          url = endpoints.trending;
          break;
        case 'animation':
          url = endpoints.animation;
          break;
        case 'family':
          url = endpoints.family;
          break;
        case 'documentary':
          url = endpoints.documentary;
          break;
        case 'disney':
          url = endpoints.disneyMovies;
          break;
        case 'pixar':
          url = endpoints.pixarMovies;
          break;
        case 'marvel':
          url = endpoints.marvelMovies;
          break;
        case 'star-wars':
          url = endpoints.starWarsMovies;
          break;
        default:
          url = endpoints.popular;
      }
      
      const data = await fetchData<{ results: TMDBMovie[] }>(url);
      return data.results.map(convertTMDBToMovie);
    }
  });
};

// Fetch movie details by ID
export const useMovieDetails = (id: string) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const data = await fetchData<TMDBMovie>(endpoints.movieDetails(id));
      return convertTMDBToMovie(data);
    },
    enabled: !!id // Only run if ID exists
  });
};

// Fetch featured movies for the homepage
export const useFeaturedMovies = () => {
  return useQuery({
    queryKey: ['featured'],
    queryFn: async () => {
      const data = await fetchData<{ results: TMDBMovie[] }>(endpoints.trending);
      return data.results.slice(0, 5).map(convertTMDBToMovie);
    }
  });
};

// Legacy functions for backward compatibility
// These will be deprecated but keep existing code working during transition
export const getMoviesByCategory = (categoryId: string): Movie[] => {
  // This is a synchronous function that will return an empty array
  // It will be replaced by the useMoviesByCategory hook
  console.warn('getMoviesByCategory is deprecated, use useMoviesByCategory hook instead');
  return [];
};

export const getMovieById = (id: string): Movie | undefined => {
  console.warn('getMovieById is deprecated, use useMovieDetails hook instead');
  return undefined;
};

export const getFeaturedMovies = (): Movie[] => {
  console.warn('getFeaturedMovies is deprecated, use useFeaturedMovies hook instead');
  return [];
};

// Local storage functions for favorites, history, downloads
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = localStorage.getItem(FAV_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };
    
    loadFavorites();
  }, []);
  
  const addFavorite = (movie: Movie) => {
    const updatedFavorites = [...favorites, movie];
    setFavorites(updatedFavorites);
    localStorage.setItem(FAV_KEY, JSON.stringify(updatedFavorites));
  };
  
  const removeFavorite = (movieId: string) => {
    const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
    setFavorites(updatedFavorites);
    localStorage.setItem(FAV_KEY, JSON.stringify(updatedFavorites));
  };
  
  const isFavorite = (movieId: string) => {
    return favorites.some(movie => movie.id === movieId);
  };
  
  return { favorites, addFavorite, removeFavorite, isFavorite };
};
