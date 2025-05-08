
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Home, Film, Tv, Grid, User, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserProfile, logout } from '@/services/api';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
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

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };
    
    checkUser();
  }, [location.pathname]); // Re-check when route changes

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

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
        <Link to="/search" className="nav-link">
          <Search size={20} />
        </Link>
        
        {/* User Profile */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 focus:outline-none">
                <Avatar className="h-8 w-8 border-2 border-disney-accent-blue">
                  <AvatarImage src={user.avatar || ''} alt={user.name} />
                  <AvatarFallback className="bg-disney-secondary-blue text-disney-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-disney-secondary-blue border-disney-gray-700 text-disney-white">
              <DropdownMenuLabel className="text-disney-gray-300">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-disney-gray-700" />
              <DropdownMenuItem 
                className="focus:bg-disney-gray-900 focus:text-disney-white cursor-pointer"
                onClick={() => navigate('/profile')}
              >
                <User size={16} className="mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="focus:bg-disney-gray-900 focus:text-disney-white cursor-pointer"
                onClick={() => navigate('/settings')}
              >
                <Settings size={16} className="mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-disney-gray-700" />
              <DropdownMenuItem 
                className="focus:bg-disney-gray-900 focus:text-disney-white cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login" className="nav-link flex items-center space-x-2">
            <User size={20} />
            <span className="hidden md:inline">Sign In</span>
          </Link>
        )}
      </div>
      
      {/* Mobile Navigation - Bottom Tab */}
      <div className="fixed bottom-0 left-0 right-0 bg-disney-secondary-blue md:hidden flex justify-around py-3 z-50">
        <NavLink to="/" icon={<Home size={20} />} mobileOnly />
        <NavLink to="/movies" icon={<Film size={20} />} mobileOnly />
        <NavLink to="/search" icon={<Search size={20} />} mobileOnly />
        <NavLink 
          to={user ? "/profile" : "/login"} 
          icon={<User size={20} />} 
          mobileOnly 
        />
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
