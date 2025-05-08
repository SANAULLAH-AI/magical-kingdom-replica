
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, User, History, Heart, Download, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import { getUserProfile, getFavorites, getWatchHistory, getDownloads, logout } from '@/services/api';
import { Movie } from '@/data/movies';
import MovieCarousel from '@/components/MovieCarousel';
import { toast } from 'sonner';

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [watchHistory, setWatchHistory] = useState<Movie[]>([]);
  const [downloads, setDownloads] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        // Load all profile data in parallel
        const [profileData, favoritesData, historyData, downloadsData] = await Promise.all([
          getUserProfile(),
          getFavorites(),
          getWatchHistory(),
          getDownloads(),
        ]);
        
        setProfile(profileData);
        setFavorites(favoritesData);
        setWatchHistory(historyData);
        setDownloads(downloadsData);
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      // Redirect to login page would happen automatically via the API
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-disney-dark-blue">
        <Header />
        <div className="h-screen flex items-center justify-center">
          <div className="text-disney-white">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-disney-dark-blue pb-20">
      <Header />
      
      <main className="pt-24 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-disney-accent-blue">
            <AvatarImage src={profile?.avatar || ''} alt={profile?.name} />
            <AvatarFallback className="bg-disney-secondary-blue text-disney-white text-2xl">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-disney-white">{profile?.name || 'Disney+ User'}</h1>
            <p className="text-disney-gray-300 mt-1">{profile?.email || 'user@example.com'}</p>
            <p className="text-disney-gray-300 mt-1">Member since: {profile?.memberSince || 'January 2022'}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <Button variant="outline" size="sm" className="border-disney-gray-700 text-disney-white" asChild>
                <Link to="/settings">
                  <Settings size={16} className="mr-2" /> Account Settings
                </Link>
              </Button>
              
              <Button variant="outline" size="sm" className="border-disney-gray-700 text-disney-white" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="bg-disney-gray-700 mb-8" />
        
        {/* Watchlist/Favorites */}
        {favorites.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center mb-4">
              <Heart size={20} className="text-disney-white mr-2" />
              <h2 className="text-xl md:text-2xl font-bold text-disney-white">My Favorites</h2>
            </div>
            <MovieCarousel title="" movies={favorites} />
          </section>
        )}
        
        {/* Watch History */}
        {watchHistory.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center mb-4">
              <History size={20} className="text-disney-white mr-2" />
              <h2 className="text-xl md:text-2xl font-bold text-disney-white">Continue Watching</h2>
            </div>
            <MovieCarousel title="" movies={watchHistory} />
          </section>
        )}
        
        {/* Downloads */}
        {downloads.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center mb-4">
              <Download size={20} className="text-disney-white mr-2" />
              <h2 className="text-xl md:text-2xl font-bold text-disney-white">Downloads</h2>
            </div>
            <MovieCarousel title="" movies={downloads} />
          </section>
        )}
        
        {/* Empty State */}
        {favorites.length === 0 && watchHistory.length === 0 && downloads.length === 0 && (
          <Card className="bg-disney-secondary-blue border-disney-gray-700 text-center p-8">
            <CardContent className="pt-6">
              <User size={48} className="mx-auto text-disney-gray-500 mb-4" />
              <h2 className="text-xl text-disney-white mb-2">Your profile is empty</h2>
              <p className="text-disney-gray-300 mb-4">
                Start watching movies and shows to build your profile
              </p>
              <Button className="bg-disney-accent-blue hover:bg-blue-700" asChild>
                <Link to="/">Browse Content</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
