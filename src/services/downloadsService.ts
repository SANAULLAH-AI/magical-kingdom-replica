
import { toast } from 'sonner';
import { Movie } from './types';
import { DOWN_KEY } from './config';

export const getDownloads = async (): Promise<Movie[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const downData = localStorage.getItem(DOWN_KEY);
    return downData ? JSON.parse(downData) : [];
  } catch (error) {
    console.error('Error fetching downloads:', error);
    return [];
  }
};

export const addToDownloads = async (movie: Movie): Promise<Movie[]> => {
  try {
    // Get current downloads
    const downData = localStorage.getItem(DOWN_KEY);
    let downloads: Movie[] = downData ? JSON.parse(downData) : [];
    
    // Check if already downloaded
    if (!downloads.some((item) => item.id === movie.id)) {
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

export const removeFromDownloads = async (movieId: string | number): Promise<Movie[]> => {
  try {
    // Get current downloads
    const downData = localStorage.getItem(DOWN_KEY);
    if (!downData) return [];
    
    let downloads: Movie[] = JSON.parse(downData);
    let removedMovie: Movie | undefined;
    
    // Remove movie from downloads
    const updatedDownloads = downloads.filter((movie) => {
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
