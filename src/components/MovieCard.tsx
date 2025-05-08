
import { Link } from 'react-router-dom';
import { Movie } from '@/data/movies';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showInfo?: boolean;
}

const MovieCard = ({ 
  movie, 
  className, 
  size = 'medium',
  showInfo = false 
}: MovieCardProps) => {
  const sizeClasses = {
    small: "w-28 h-40 md:w-32 md:h-48",
    medium: "w-36 h-52 md:w-44 md:h-64",
    large: "w-full h-64 md:h-80"
  };
  
  return (
    <Link to={`/movie/${movie.id}`} className="block outline-none focus:ring-2 focus:ring-disney-accent-blue">
      <div 
        className={cn(
          "movie-card relative",
          sizeClasses[size],
          className
        )}
      >
        <img 
          src={movie.posterPath} 
          alt={movie.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-end transition-opacity duration-300">
          <div className="p-3 w-full">
            {showInfo && (
              <>
                <h3 className="font-bold text-white truncate">{movie.title}</h3>
                <p className="text-xs text-gray-300">{movie.year} • {movie.duration}</p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Title (if not in hover overlay) */}
      {(!showInfo && size !== 'small') && (
        <h3 className="text-sm mt-2 font-medium text-disney-white truncate">{movie.title}</h3>
      )}
    </Link>
  );
};

export default MovieCard;
