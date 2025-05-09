
import { useQuery } from '@tanstack/react-query';

// Placeholder function that returns empty data
const getEmptyVideoResults = () => ({
  page: 0,
  per_page: 0,
  total_results: 0,
  videos: []
});

// Placeholder function for getting a video
const getEmptyVideo = () => null;

// Hook to search for videos (now returns empty results)
export const useVideoSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['videos', 'search', query],
    queryFn: () => getEmptyVideoResults(),
    enabled: enabled && !!query
  });
};

// Hook to get popular videos (now returns empty results)
export const usePopularVideos = (perPage: number = 15) => {
  return useQuery({
    queryKey: ['videos', 'popular', perPage],
    queryFn: () => getEmptyVideoResults()
  });
};

// Hook to get a specific video by ID (now returns null)
export const useVideoById = (videoId: number | null) => {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: () => getEmptyVideo(),
    enabled: !!videoId
  });
};

// Hook to find a movie trailer (now returns null)
export const useMovieTrailer = (movieTitle: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['movieTrailer', movieTitle],
    queryFn: () => getEmptyVideo(),
    enabled: enabled && !!movieTitle
  });
};
