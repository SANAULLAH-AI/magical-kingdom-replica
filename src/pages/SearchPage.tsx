
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useVideoSearch } from '@/data/videos';
import { toast } from '@/hooks/use-toast';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [debouncedQuery, setDebouncedQuery] = useState(queryParam);
  
  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      // Update URL with search query
      if (searchQuery && searchQuery !== queryParam) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`, { replace: true });
      }
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, navigate, queryParam]);
  
  // Get search results
  const { data, isLoading, error } = useVideoSearch(debouncedQuery);
  
  // Show error toast if API request fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error searching content",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }, [error]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  
  return (
    <div className="min-h-screen bg-disney-dark-blue pb-20">
      <Header />
      
      <main className="pt-24 px-4 md:px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-disney-white mb-6">Search</h1>
        
        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input 
              type="text"
              placeholder="Search for movies, shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-disney-secondary-blue text-disney-white placeholder:text-disney-gray-300 border-none focus-visible:ring-disney-accent-blue"
            />
            <Button type="submit" variant="default" className="bg-disney-accent-blue hover:bg-disney-accent-blue/90">
              <Search size={20} />
            </Button>
          </form>
        </div>
        
        {/* Search Results */}
        {debouncedQuery ? (
          <>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="w-full h-52 md:h-64" />
                    <Skeleton className="w-3/4 h-4" />
                  </div>
                ))}
              </div>
            ) : data && data.videos && data.videos.length > 0 ? (
              <>
                <p className="text-disney-gray-300 mb-4">
                  Found {data.total_results} results for "{debouncedQuery}"
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {data.videos.map((movie) => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                      showInfo={true} 
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-disney-gray-300">
                <p className="text-xl mb-2">No results found for "{debouncedQuery}"</p>
                <p>Try different keywords or check your spelling.</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-disney-gray-300">
            <p className="text-xl mb-2">Search for movies and TV shows</p>
            <p>Enter keywords to find content.</p>
          </div>
        )}
      </main>
      
      {/* Placeholder for bottom padding on mobile (because of the mobile navigation) */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
};

export default SearchPage;
