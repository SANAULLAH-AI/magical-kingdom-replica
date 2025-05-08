
// Pexels Video API Integration
const API_KEY = 'TzjKcxC0sJaPzugL884nUaS1H0mybHWMqX75UKd6GSFgOYXIyPhch7BZ';
const BASE_URL = 'https://api.pexels.com/videos';

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  image: string;
  url: string;
  video_files: {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }[];
  user: {
    id: number;
    name: string;
    url: string;
  };
}

export interface PexelsSearchResult {
  page: number;
  per_page: number;
  total_results: number;
  videos: PexelsVideo[];
}

// Search Videos
export async function searchVideos(query: string, perPage = 15): Promise<PexelsSearchResult> {
  try {
    const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
      headers: {
        Authorization: API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching videos:', error);
    return { page: 0, per_page: 0, total_results: 0, videos: [] };
  }
}

// Get Popular Videos
export async function getPopularVideos(perPage = 15): Promise<PexelsSearchResult> {
  try {
    const response = await fetch(`${BASE_URL}/popular?per_page=${perPage}`, {
      headers: {
        Authorization: API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting popular videos:', error);
    return { page: 0, per_page: 0, total_results: 0, videos: [] };
  }
}

// Get a Specific Video
export async function getVideoById(videoId: number): Promise<PexelsVideo | null> {
  try {
    const response = await fetch(`${BASE_URL}/videos/${videoId}`, {
      headers: {
        Authorization: API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting video by ID:', error);
    return null;
  }
}

// Find a relevant video for a movie
export async function findMovieTrailer(movieTitle: string): Promise<PexelsVideo | null> {
  try {
    // Search for trailer + movie title
    const searchQuery = `${movieTitle} trailer`;
    const results = await searchVideos(searchQuery, 5);
    
    // Return first result if available
    if (results.videos && results.videos.length > 0) {
      return results.videos[0];
    }
    
    // Fallback to just the movie title if no results
    if (results.videos.length === 0) {
      const fallbackResults = await searchVideos(movieTitle, 5);
      if (fallbackResults.videos && fallbackResults.videos.length > 0) {
        return fallbackResults.videos[0];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding movie trailer:', error);
    return null;
  }
}

export default {
  searchVideos,
  getPopularVideos,
  getVideoById,
  findMovieTrailer
};
