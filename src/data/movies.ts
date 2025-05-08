
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
];

export const movies: Movie[] = [
  {
    id: "1",
    title: "The Lion Adventure",
    description: "A young lion prince flees his kingdom after the murder of his father. His path is marked by self-discovery and romance as he works to reclaim his throne.",
    posterPath: "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    backdropPath: "https://images.unsplash.com/photo-1611499385333-59c61e69a600?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    year: "2023",
    rating: "PG",
    duration: "1h 58m",
    category: ["animation", "adventure", "family", "popular", "trending"],
    logo: "https://images.unsplash.com/photo-1562767332-12ef2b681245?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "2",
    title: "Ocean Explorers",
    description: "Follow the journey of marine researchers as they discover new species in the deepest parts of the ocean, facing challenges and forging new scientific frontiers.",
    posterPath: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    backdropPath: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", 
    year: "2022",
    rating: "PG",
    duration: "1h 42m",
    category: ["documentary", "adventure", "family"]
  },
  {
    id: "3",
    title: "Space Adventures",
    description: "A team of astronauts embarks on a dangerous mission to save Earth from an incoming asteroid, discovering incredible secrets about our universe.",
    posterPath: "https://images.unsplash.com/photo-1539662297303-594fbc1ea83a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    backdropPath: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    year: "2022",
    rating: "PG-13",
    duration: "2h 10m",
    category: ["sci-fi", "action", "adventure", "trending"]
  },
  {
    id: "4",
    title: "Magic Kingdom",
    description: "In a world where magic exists alongside technology, a young wizard discovers her powers and must use them to prevent a global catastrophe.",
    posterPath: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    backdropPath: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    year: "2021",
    rating: "PG",
    duration: "1h 52m",
    category: ["fantasy", "adventure", "family", "popular"]
  },
  {
    id: "5",
    title: "Wild Nature",
    description: "Experience the untamed wilderness through the eyes of wildlife photographers who dedicate their lives to capturing the beauty of nature.",
    posterPath: "https://images.unsplash.com/photo-1504173010664-32509eeaab79?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    backdropPath: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    year: "2023",
    rating: "G",
    duration: "1h 30m",
    category: ["documentary", "family"]
  },
  {
    id: "6",
    title: "Time Quest",
    description: "A brilliant scientist invents a time machine and accidentally transports her family back to the prehistoric era where they must find a way home.",
    posterPath: "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    backdropPath: "https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    year: "2020",
    rating: "PG-13",
    duration: "1h 45m",
    category: ["sci-fi", "adventure", "family", "popular"]
  },
  {
    id: "7",
    title: "Underwater Kingdom",
    description: "An animated tale of a mermaid princess who dreams of exploring the human world above the surface, risking everything for love and adventure.",
    posterPath: "https://images.unsplash.com/photo-1582845512747-e42001c95638?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    backdropPath: "https://images.unsplash.com/photo-1560776355-2c8c92c7dbac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    year: "2023",
    rating: "G",
    duration: "1h 38m",
    category: ["animation", "family", "fantasy", "popular", "trending"]
  },
  {
    id: "8",
    title: "Hero's Journey",
    description: "A reluctant hero must embrace their destiny and embark on an epic quest to save their homeland from an ancient evil that has awakened.",
    posterPath: "https://images.unsplash.com/photo-1535443274868-756b0f070b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    backdropPath: "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    year: "2021",
    rating: "PG-13",
    duration: "2h 20m",
    category: ["fantasy", "action", "adventure", "trending"]
  },
  {
    id: "9",
    title: "Cosmic Tales",
    description: "A collection of animated short stories that explore the wonders and mysteries of our universe, from distant galaxies to quantum realms.",
    posterPath: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    backdropPath: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    year: "2022",
    rating: "G",
    duration: "1h 25m",
    category: ["animation", "sci-fi", "family"]
  },
  {
    id: "10",
    title: "Comedy Hour",
    description: "A hilarious look at the daily life of a dysfunctional family trying to run a small business while dealing with their own personal quirks.",
    posterPath: "https://images.unsplash.com/photo-1543584756-31dc7ed3ba2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    backdropPath: "https://images.unsplash.com/photo-1559009340-58b5ae7b764f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    year: "2023",
    rating: "PG-13",
    duration: "1h 30m",
    category: ["comedy", "family"]
  },
  {
    id: "11",
    title: "Mountain Quest",
    description: "A group of friends attempt to climb the world's highest peak, facing extreme weather, personal conflicts, and the limits of human endurance.",
    posterPath: "https://images.unsplash.com/photo-1508184964240-ee96c419cb3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    backdropPath: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    year: "2020",
    rating: "PG-13",
    duration: "2h 5m",
    category: ["adventure", "drama", "documentary"]
  },
  {
    id: "12",
    title: "Jungle Safari",
    description: "An animated adventure following a group of animals who must work together to save their rainforest home from destruction.",
    posterPath: "https://images.unsplash.com/photo-1559643111-19d1e56179e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    backdropPath: "https://images.unsplash.com/photo-1478549055366-1e064aed4693?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    year: "2021",
    rating: "G",
    duration: "1h 42m",
    category: ["animation", "adventure", "family", "popular"]
  }
];

export const getMoviesByCategory = (categoryId: string): Movie[] => {
  return movies.filter(movie => movie.category.includes(categoryId));
};

export const getMovieById = (id: string): Movie | undefined => {
  return movies.find(movie => movie.id === id);
};

export const getFeaturedMovies = (): Movie[] => {
  return movies.filter(movie => movie.category.includes('popular') || movie.category.includes('trending')).slice(0, 5);
};
