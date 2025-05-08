
import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MovieCarousel from '@/components/MovieCarousel';
import CategoryTabs from '@/components/CategoryTabs';
import { getMoviesByCategory, getFeaturedMovies } from '@/data/movies';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const featuredMovies = getFeaturedMovies();
  const categoryMovies = getMoviesByCategory(selectedCategory);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  return (
    <div className="min-h-screen bg-disney-dark-blue pb-20">
      <Header />
      
      <main className="pt-16">
        {/* Hero section with featured movie */}
        <HeroSection featuredMovies={featuredMovies} />
        
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
          movies={categoryMovies} 
        />
        
        {/* Additional categories */}
        <MovieCarousel 
          title="Disney Originals" 
          movies={getMoviesByCategory('popular').slice(0, 8)} 
        />
        
        <MovieCarousel 
          title="New to Disney+" 
          movies={getMoviesByCategory('trending').slice(0, 8)} 
        />
        
        <MovieCarousel 
          title="Animation" 
          movies={getMoviesByCategory('animation')} 
        />
        
        <MovieCarousel 
          title="Family Favorites" 
          movies={getMoviesByCategory('family')} 
        />
      </main>
      
      {/* Placeholder for bottom padding on mobile (because of the mobile navigation) */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
};

export default Index;
