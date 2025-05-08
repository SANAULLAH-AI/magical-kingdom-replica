
import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MovieCarousel from '@/components/MovieCarousel';
import CategoryTabs from '@/components/CategoryTabs';
import { useMoviesByCategory, useFeaturedMovies } from '@/data/movies';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const { data: featuredMovies, isLoading: isFeaturedLoading } = useFeaturedMovies();
  const { data: categoryMovies, isLoading: isCategoryLoading } = useMoviesByCategory(selectedCategory);
  
  // Additional category data for carousel sections
  const { data: disneyOriginals } = useMoviesByCategory('disney');
  const { data: newReleases } = useMoviesByCategory('trending');
  const { data: animationMovies } = useMoviesByCategory('animation');
  const { data: familyMovies } = useMoviesByCategory('family');

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  return (
    <div className="min-h-screen bg-disney-dark-blue pb-20">
      <Header />
      
      <main className="pt-16">
        {/* Hero section with featured movie */}
        {isFeaturedLoading ? (
          <Skeleton className="h-[70vh] min-h-[500px] w-full" />
        ) : (
          <HeroSection featuredMovies={featuredMovies || []} />
        )}
        
        {/* Category selection */}
        <div className="mt-8">
          <CategoryTabs 
            onSelectCategory={handleCategoryChange}
            selectedCategory={selectedCategory}
          />
        </div>
        
        {/* Movies by category */}
        <MovieCarousel 
          title={selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} 
          movies={categoryMovies || []} 
          isLoading={isCategoryLoading}
        />
        
        {/* Additional categories */}
        <MovieCarousel 
          title="Disney Originals" 
          movies={disneyOriginals || []} 
          isLoading={!disneyOriginals}
        />
        
        <MovieCarousel 
          title="New to Disney+" 
          movies={newReleases || []} 
          isLoading={!newReleases}
        />
        
        <MovieCarousel 
          title="Animation" 
          movies={animationMovies || []} 
          isLoading={!animationMovies}
        />
        
        <MovieCarousel 
          title="Family Favorites" 
          movies={familyMovies || []} 
          isLoading={!familyMovies}
        />
      </main>
      
      {/* Placeholder for bottom padding on mobile (because of the mobile navigation) */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
};

export default Index;
