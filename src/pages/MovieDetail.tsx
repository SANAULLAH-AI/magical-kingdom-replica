
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Share2, ChevronLeft, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MovieCarousel from '@/components/MovieCarousel';
import { useMovieDetails, useFavorites } from '@/data/movies';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { addToDownloads } from '@/services/api';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading, error } = useMovieDetails(id || '');
  const [isScrolled, setIsScrolled] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
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

  // Handle error state
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading movie details",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleToggleFavorite = () => {
    if (!movie) return;
    
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
      toast({
        title: "Removed from Watchlist",
        description: `${movie.title} has been removed from your watchlist`,
      });
    } else {
      addFavorite(movie);
      toast({
        title: "Added to Watchlist",
        description: `${movie.title} has been added to your watchlist`,
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && movie) {
      navigator.share({
        title: movie.title,
        text: `Check out ${movie.title} on Disney+`,
        url: window.location.href,
      }).catch((err) => {
        toast({
          title: "Sharing failed",
          description: "Could not share this content",
        });
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link copied",
          description: "Movie link copied to clipboard",
        });
      });
    }
  };

  const handleDownload = async () => {
    if (!movie) return;
    
    try {
      await addToDownloads(movie);
      toast({
        title: "Download started",
        description: `${movie.title} has been added to your downloads`,
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Could not download this content",
        variant: "destructive",
      });
    }
  };

  const handlePlay = () => {
    if (!movie) return;
    
    if (movie.videoUrl) {
      window.open(movie.videoUrl, '_blank');
    } else {
      toast({
        title: "Video unavailable",
        description: "No video available for this title",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-disney-dark-blue pb-20">
        <Header />
        <div className="relative h-[60vh] min-h-[400px]">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Skeleton className="w-64 h-10 mb-2" />
          <Skeleton className="w-full h-24 mb-8" />
          <Skeleton className="w-32 h-6 mb-4" />
          <div className="flex flex-wrap gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-36 h-52" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return <div className="flex items-center justify-center h-screen text-disney-white">Movie not found</div>;
  }

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
              <Button 
                className="bg-disney-white hover:bg-disney-gray-100 text-disney-dark-blue font-bold"
                onClick={handlePlay}
              >
                <Play className="mr-2 h-4 w-4" />
                Play
              </Button>
              
              <Button 
                variant="outline" 
                className="border-disney-gray-300 text-disney-white hover:bg-disney-secondary-blue"
                onClick={handleToggleFavorite}
              >
                {isFavorite(movie.id) ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Watchlist
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                className="border-disney-gray-300 text-disney-white hover:bg-disney-secondary-blue"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              
              <Button 
                variant="outline" 
                className="border-disney-gray-300 text-disney-white hover:bg-disney-secondary-blue"
                onClick={handleShare}
              >
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
        
        {/* Related carousels will be loaded dynamically by the MovieCarousel component */}
        <MovieCarousel 
          title="More Like This" 
          categoryId="similar" 
          movieId={movie.id} 
        />
        
        {/* Suggested by category */}
        {movie.category.slice(0, 3).map((category, index) => (
          <MovieCarousel 
            key={index}
            title={`More ${category.charAt(0).toUpperCase() + category.slice(1)}`} 
            categoryId={category}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieDetail;
