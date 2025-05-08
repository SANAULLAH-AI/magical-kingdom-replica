
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import MovieCard from '@/components/MovieCard';
import { useMoviesByCategory } from '@/data/movies';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const MoviesPage = () => {
  const location = useLocation();
  
  // Determine initial category based on route
  const getInitialCategory = () => {
    const path = location.pathname;
    if (path === '/series') return 'trending';
    if (path === '/originals') return 'disney';
    return 'popular';
  };
  
  const [selectedCategory, setSelectedCategory] = useState(getInitialCategory());
  const { data: movies, isLoading, error } = useMoviesByCategory(selectedCategory);

  // Update page title based on route
  useEffect(() => {
    let pageTitle = "Movies";
    if (location.pathname === '/series') {
      pageTitle = "Series";
    } else if (location.pathname === '/originals') {
      pageTitle = "Originals";
    }
    
    // Show error toast if API request fails
    if (error) {
      toast({
        title: "Error loading content",
        description: "Please try again later",
        variant: "destructive",
      });
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [location.pathname, error]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/series':
        return 'Series';
      case '/originals':
        return 'Disney Originals';
      default:
        return 'Movies';
    }
  };
  
  return (
    <div className="min-h-screen bg-disney-dark-blue pb-20">
      <Header />
      
      <main className="pt-24 px-4 md:px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-disney-white mb-6">{getPageTitle()}</h1>
        
        <CategoryTabs 
          onSelectCategory={handleCategoryChange} 
          selectedCategory={selectedCategory}
        />
        
        {isLoading ? (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton className="w-full h-52 md:h-64" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {movies && movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                showInfo={true} 
              />
            ))}
          </div>
        )}
        
        {movies && movies.length === 0 && !isLoading && (
          <div className="flex justify-center items-center h-64 text-disney-gray-300">
            No content found in this category.
          </div>
        )}
      </main>
      
      {/* Placeholder for bottom padding on mobile (because of the mobile navigation) */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
};

export default MoviesPage;
