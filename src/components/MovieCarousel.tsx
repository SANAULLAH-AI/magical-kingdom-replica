
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '@/data/movies';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
}

const MovieCarousel = ({ title, movies }: MovieCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = direction === 'left' 
        ? -current.clientWidth * 0.75 
        : current.clientWidth * 0.75;
      
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="my-8 px-4 md:px-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-disney-white">{title}</h2>
      
      <div className="relative group">
        {/* Scroll buttons */}
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-disney-gray-900/80 rounded-full p-2 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="text-white" size={24} />
        </button>
        
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-disney-gray-900/80 rounded-full p-2 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="text-white" size={24} />
        </button>
        
        {/* Movie cards */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto space-x-4 pb-6 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;
