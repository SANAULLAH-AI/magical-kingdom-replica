
import { toast } from 'sonner';
import { Movie } from './types';
import { FAV_KEY } from './config';

export const getFavorites = async (): Promise<Movie[]> => {
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

export const addToFavorites = async (movie: Movie): Promise<Movie[]> => {
  try {
    // Get current favorites
    const favData = localStorage.getItem(FAV_KEY);
    let favorites: Movie[] = favData ? JSON.parse(favData) : [];
    
    // Check if already in favorites
    if (!favorites.some((fav) => fav.id === movie.id)) {
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

export const removeFromFavorites = async (movieId: string | number): Promise<Movie[]> => {
  try {
    // Get current favorites
    const favData = localStorage.getItem(FAV_KEY);
    if (!favData) return [];
    
    let favorites: Movie[] = JSON.parse(favData);
    let removedMovie: Movie | undefined;
    
    // Remove movie from favorites
    const updatedFavorites = favorites.filter((movie) => {
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
