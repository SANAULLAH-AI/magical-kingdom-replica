
import { useState } from 'react';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import MovieCard from '@/components/MovieCard';
import { getMoviesByCategory } from '@/data/movies';

const MoviesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const movies = getMoviesByCategory(selectedCategory);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  return (
    <div className="min-h-screen bg-disney-dark-blue pb-20">
      <Header />
      
      <main className="pt-24 px-4 md:px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-disney-white mb-6">Movies</h1>
        
        <CategoryTabs 
          onSelectCategory={handleCategoryChange} 
          selectedCategory={selectedCategory}
        />
        
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              showInfo={true} 
            />
          ))}
        </div>
        
        {movies.length === 0 && (
          <div className="flex justify-center items-center h-64 text-disney-gray-300">
            No movies found in this category.
          </div>
        )}
      </main>
      
      {/* Placeholder for bottom padding on mobile (because of the mobile navigation) */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
};

export default MoviesPage;
