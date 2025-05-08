
// Interface definitions for API responses and data types
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
  lastWatched?: string;
  downloadDate?: string;
  downloadSize?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
  notifications: {
    newContent: boolean;
    watchlist: boolean;
    specialOffers: boolean;
    newsletters: boolean;
  };
  preferences: {
    autoplay: boolean;
    playbackQuality: string;
    downloads: {
      wifiOnly: boolean;
      autoDelete: boolean;
      videoQuality: string;
    };
  };
}
