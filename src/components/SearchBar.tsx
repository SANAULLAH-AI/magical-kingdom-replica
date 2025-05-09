import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { endpoints, fetchData, TMDBMovie, convertTMDBToMovie } from '@/services/api';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const { data, isLoading } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return { results: [] };
      const data = await fetchData<{ results: TMDBMovie[] }>(endpoints.searchMovies(searchTerm));
      return data;
    },
    enabled: searchTerm.length > 2,
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    // Close search and navigate to search results page
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
  };
  
  const handleMovieClick = (movieId: number) => {
    setIsOpen(false);
    setSearchTerm('');
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="relative">
      {isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
      ) : null}
      
      <button 
        onClick={() => setIsOpen(true)}
        className="text-disney-gray-300 hover:text-disney-white p-2"
        aria-label="Search"
      >
        <Search size={24} />
      </button>
      
      <div 
        className={cn(
          "fixed top-0 right-0 w-full md:w-96 h-full bg-disney-dark-blue z-50 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-disney-white">Search</h2>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-disney-gray-300 hover:text-disney-white p-2"
              aria-label="Close search"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input 
                type="text"
                placeholder="Search for movies, shows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-disney-secondary-blue text-disney-white placeholder:text-disney-gray-300 border-none focus-visible:ring-disney-accent-blue"
                autoFocus
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-disney-gray-300 hover:text-disney-white"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
          
          {/* Search results */}
          <div className="mt-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            {isLoading ? (
              <div className="text-disney-gray-300 text-center py-4">Searching...</div>
            ) : data?.results && data.results.length > 0 ? (
              <div className="space-y-4">
                {data.results.slice(0, 10).map((movie) => (
                  <div 
                    key={movie.id} 
                    className="flex items-center gap-3 cursor-pointer hover:bg-disney-secondary-blue p-2 rounded"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    {movie.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-disney-secondary-blue rounded flex items-center justify-center text-disney-gray-300">
                        No img
                      </div>
                    )}
                    <div>
                      <h3 className="text-disney-white font-medium">{movie.title}</h3>
                      <p className="text-disney-gray-300 text-sm">
                        {movie.release_date ? movie.release_date.substring(0, 4) : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm.length > 2 ? (
              <div className="text-disney-gray-300 text-center py-4">No results found</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
