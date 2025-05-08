
import { useState, useEffect } from 'react';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Movie } from '@/data/movies';

interface HeroSectionProps {
  featuredMovies: Movie[];
}

const HeroSection = ({ featuredMovies }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMovie = featuredMovies[currentIndex];
  
  // Auto-rotate featured movies
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [featuredMovies.length]);
  
  if (!currentMovie) return null;
  
  return (
    <div className="relative h-[70vh] min-h-[500px]">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={currentMovie.backdropPath} 
          alt={currentMovie.title}
          className="w-full h-full object-cover object-top animate-fade-in"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-end sm:items-center pb-16 px-6 md:px-16">
        <div className="max-w-2xl">
          {/* Movie logo if available, otherwise title */}
          {currentMovie.logo ? (
            <img 
              src={currentMovie.logo} 
              alt={currentMovie.title}
              className="w-48 md:w-64 mb-4 animate-fade-in" 
            />
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">{currentMovie.title}</h1>
          )}
          
          <p className="text-white text-sm md:text-base mb-6 line-clamp-3 animate-fade-in">
            {currentMovie.description}
          </p>
          
          <div className="flex space-x-4 animate-fade-in">
            <Button className="bg-disney-white hover:bg-disney-gray-100 text-disney-dark-blue font-bold">
              <Play className="mr-2 h-4 w-4" />
              Play
            </Button>
            
            <Link to={`/movie/${currentMovie.id}`}>
              <Button variant="outline" className="border-disney-gray-300 text-disney-white hover:bg-disney-secondary-blue">
                <Info className="mr-2 h-4 w-4" />
                Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Indicator dots for featured movies */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-disney-white' : 'bg-disney-gray-500'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
