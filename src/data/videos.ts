
import { useQuery } from '@tanstack/react-query';
import { fetchData, endpoints, TMDBMovie, convertTMDBToMovie } from '@/services/api';

// Search for videos using TMDB API
const searchVideos = async (query: string) => {
  if (!query || query.length < 2) {
    return {
      page: 0,
      per_page: 0,
      total_results: 0,
      videos: []
    };
  }

  try {
    const data = await fetchData<{ results: TMDBMovie[], page: number, total_results: number }>
      (endpoints.searchMovies(query));
    
    return {
      page: data.page,
      per_page: 20,
      total_results: data.total_results,
      videos: data.results.map(convertTMDBToMovie)
    };
  } catch (error) {
    console.error('Error searching videos:', error);
    return {
      page: 0,
      per_page: 0,
      total_results: 0,
      videos: []
    };
  }
};

// Get a specific video by ID
const getVideoById = async (videoId: number) => {
  if (!videoId) return null;
  
  try {
    const data = await fetchData<TMDBMovie>(endpoints.movieDetails(videoId.toString()));
    return convertTMDBToMovie(data);
  } catch (error) {
    console.error('Error getting video by ID:', error);
    return null;
  }
};

// Find a movie trailer by title
const findMovieTrailer = async (movieTitle: string) => {
  if (!movieTitle) return null;
  
  try {
    const searchResults = await fetchData<{ results: TMDBMovie[] }>(endpoints.searchMovies(movieTitle));
    if (searchResults.results && searchResults.results.length > 0) {
      const movieId = searchResults.results[0].id;
      const movieDetails = await fetchData<TMDBMovie>(endpoints.movieDetails(movieId.toString()));
      return convertTMDBToMovie(movieDetails);
    }
    return null;
  } catch (error) {
    console.error('Error finding movie trailer:', error);
    return null;
  }
};

// Hook to search for videos
export const useVideoSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['videos', 'search', query],
    queryFn: () => searchVideos(query),
    enabled: enabled && !!query && query.length > 2
  });
};

// Hook to get popular videos
export const usePopularVideos = (perPage: number = 15) => {
  return useQuery({
    queryKey: ['videos', 'popular', perPage],
    queryFn: async () => {
      try {
        const data = await fetchData<{ results: TMDBMovie[] }>(endpoints.popular);
        return {
          page: 1,
          per_page: perPage,
          total_results: data.results.length,
          videos: data.results.slice(0, perPage).map(convertTMDBToMovie)
        };
      } catch (error) {
        console.error('Error getting popular videos:', error);
        return {
          page: 0,
          per_page: 0,
          total_results: 0,
          videos: []
        };
      }
    }
  });
};

// Hook to get a specific video by ID
export const useVideoById = (videoId: number | null) => {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: () => getVideoById(videoId as number),
    enabled: !!videoId
  });
};

// Hook to find a movie trailer
export const useMovieTrailer = (movieTitle: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['movieTrailer', movieTitle],
    queryFn: () => findMovieTrailer(movieTitle),
    enabled: enabled && !!movieTitle
  });
};
