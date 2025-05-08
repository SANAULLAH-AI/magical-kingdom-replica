
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Share2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MovieCarousel from '@/components/MovieCarousel';
import { getMovieById, getMoviesByCategory } from '@/data/movies';
import { cn } from '@/lib/utils';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movie = getMovieById(id || '');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll events for the animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!movie) {
    return <div className="flex items-center justify-center h-screen">Movie not found</div>;
  }

  const relatedMovies = movie.category.length > 0
    ? getMoviesByCategory(movie.category[0]).filter(m => m.id !== movie.id)
    : [];

  return (
    <div className="min-h-screen bg-disney-dark-blue pb-20">
      <Header />
      
      {/* Back button */}
      <Link 
        to="/" 
        className="fixed top-20 left-4 z-40 bg-disney-secondary-blue/80 p-2 rounded-full"
      >
        <ChevronLeft className="text-white" size={24} />
      </Link>
      
      {/* Hero backdrop */}
      <div className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <img 
            src={movie.backdropPath} 
            alt={movie.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        {/* Content overlay */}
        <div 
          className={cn(
            "absolute inset-0 flex items-end transition-all duration-500",
            isScrolled ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="w-full max-w-5xl mx-auto px-6 pb-8">
            {movie.logo ? (
              <img 
                src={movie.logo} 
                alt={movie.title}
                className="w-64 mb-6" 
              />
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
            )}
            
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-disney-gray-300">
              <span>{movie.year}</span>
              <span>{movie.rating}</span>
              <span>{movie.duration}</span>
              <div className="flex gap-2">
                {movie.category.slice(0, 3).map((cat, index) => (
                  <span key={index} className="capitalize">{cat}</span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button className="bg-disney-white hover:bg-disney-gray-100 text-disney-dark-blue font-bold">
                <Play className="mr-2 h-4 w-4" />
                Play
              </Button>
              
              <Button variant="outline" className="border-disney-gray-300 text-disney-white hover:bg-disney-secondary-blue">
                <Plus className="mr-2 h-4 w-4" />
                Add to Watchlist
              </Button>
              
              <Button variant="outline" className="border-disney-gray-300 text-disney-white hover:bg-disney-secondary-blue">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Movie details */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-disney-white mb-2">About this movie</h2>
        <p className="text-disney-gray-300 mb-8">{movie.description}</p>
        
        {/* Related content */}
        {relatedMovies.length > 0 && (
          <MovieCarousel title="More Like This" movies={relatedMovies} />
        )}
        
        {/* Suggested by category */}
        {movie.category.map((category, index) => {
          const categoryMovies = getMoviesByCategory(category).filter(m => m.id !== movie.id);
          if (categoryMovies.length === 0) return null;
          
          return (
            <MovieCarousel 
              key={index}
              title={`More ${category.charAt(0).toUpperCase() + category.slice(1)}`} 
              movies={categoryMovies.slice(0, 8)} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default MovieDetail;
