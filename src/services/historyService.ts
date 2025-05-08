
import { Movie } from './types';
import { HIST_KEY } from './config';

export const getWatchHistory = async (): Promise<Movie[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const histData = localStorage.getItem(HIST_KEY);
    return histData ? JSON.parse(histData) : [];
  } catch (error) {
    console.error('Error fetching watch history:', error);
    return [];
  }
};

export const addToWatchHistory = async (movie: Movie): Promise<Movie[]> => {
  try {
    // Get current history
    const histData = localStorage.getItem(HIST_KEY);
    let history: Movie[] = histData ? JSON.parse(histData) : [];
    
    // Remove if already in history (to move to top)
    history = history.filter((item) => item.id !== movie.id);
    
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
