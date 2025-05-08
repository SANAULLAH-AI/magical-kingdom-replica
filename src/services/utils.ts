
import { TMDBMovie, Movie } from './types';
import { IMAGE_BASE_URL, BACKDROP_BASE_URL } from './config';

// Fetch helper function
export const fetchData = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

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
