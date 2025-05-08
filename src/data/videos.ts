
import { useQuery } from '@tanstack/react-query';
import { findMovieTrailer, getPopularVideos, getVideoById, searchVideos, PexelsVideo } from '@/services/pexelsApi';

// Hook to search for videos
export const useVideoSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['videos', 'search', query],
    queryFn: () => searchVideos(query),
    enabled: enabled && !!query
  });
};

// Hook to get popular videos
export const usePopularVideos = (perPage: number = 15) => {
  return useQuery({
    queryKey: ['videos', 'popular', perPage],
    queryFn: () => getPopularVideos(perPage)
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
