
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Home, Film, Tv, Grid, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Handle scroll events to make header transparent or solid
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        'fixed top-0 z-50 w-full px-6 py-3 flex items-center transition-all duration-300',
        isScrolled ? 'bg-disney-dark-blue/95 shadow-md' : 'bg-transparent'
      )}
    >
      {/* Logo */}
      <Link to="/" className="mr-8">
        <span className="text-2xl font-bold text-disney-white">Disney+</span>
      </Link>
      
      {/* Navigation Links - Desktop */}
      <nav className="hidden md:flex flex-1 space-x-8">
        <NavLink to="/" icon={<Home size={18} />} label="Home" />
        <NavLink to="/movies" icon={<Film size={18} />} label="Movies" />
        <NavLink to="/series" icon={<Tv size={18} />} label="Series" />
        <NavLink to="/originals" icon={<Grid size={18} />} label="Originals" />
      </nav>
      
      {/* Right side controls */}
      <div className="flex items-center space-x-5 ml-auto">
        <button className="nav-link">
          <Search size={20} />
        </button>
        <button className="nav-link">
          <User size={20} />
        </button>
      </div>
      
      {/* Mobile Navigation - Bottom Tab */}
      <div className="fixed bottom-0 left-0 right-0 bg-disney-secondary-blue md:hidden flex justify-around py-3 z-50">
        <NavLink to="/" icon={<Home size={20} />} mobileOnly />
        <NavLink to="/movies" icon={<Film size={20} />} mobileOnly />
        <NavLink to="/search" icon={<Search size={20} />} mobileOnly />
        <NavLink to="/profile" icon={<User size={20} />} mobileOnly />
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  icon?: React.ReactNode;
  label?: string;
  mobileOnly?: boolean;
}

const NavLink = ({ to, icon, label, mobileOnly = false }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center nav-link", 
        isActive ? "active" : "",
        mobileOnly ? "flex-col" : ""
      )}
    >
      {icon}
      {!mobileOnly && label && <span className="ml-2">{label}</span>}
      {mobileOnly && label && <span className="text-xs mt-1">{label}</span>}
    </Link>
  );
};

export default Header;
