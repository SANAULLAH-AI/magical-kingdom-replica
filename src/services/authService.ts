import { User } from './types';
import { USER_KEY, FAV_KEY, HIST_KEY } from './config';

export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulating API call with localStorage
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo, we'll just create a mock user
    const user: User = {
      id: '123456',
      name: 'Disney Fan',
      email: email,
      avatar: 'https://i.pravatar.cc/150?img=3',
      memberSince: 'January 2022',
      notifications: {
        newContent: true,
        watchlist: true,
        specialOffers: false,
        newsletters: false,
      },
      preferences: {
        autoplay: true,
        playbackQuality: 'auto',
        downloads: {
          wifiOnly: true,
          autoDelete: false,
          videoQuality: 'medium',
        }
      }
    };
    
    // Save to local storage
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid email or password');
  }
};

export const logout = async (): Promise<void> => {
  // In a real app, this would be an API call to invalidate the session
  await new Promise(resolve => setTimeout(resolve, 500));
  localStorage.removeItem(USER_KEY);
  
  // Optionally, you might want to keep favorites and history
  // localStorage.removeItem(FAV_KEY);
  // localStorage.removeItem(HIST_KEY);
};

export const getUserProfile = async (): Promise<User | null> => {
  // In a real app, this would fetch the profile from an API
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (data: { name?: string; email?: string }): Promise<User> => {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) throw new Error('User not found');
    
    const user = JSON.parse(userData);
    const updatedUser = { ...user, ...data };
    
    // Save updated user
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    // In a real app, this would be an API call to validate current password and update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we just simulate success
    // No need to update anything in localStorage for password
    return;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const updateUserNotifications = async (notifications: Record<string, boolean>): Promise<User> => {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) throw new Error('User not found');
    
    const user = JSON.parse(userData);
    const updatedUser = { ...user, notifications };
    
    // Save updated user
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating notifications:', error);
    throw error;
  }
};

export const updateUserPreferences = async (preferences: any): Promise<User> => {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) throw new Error('User not found');
    
    const user = JSON.parse(userData);
    const updatedUser = { ...user, preferences };
    
    // Save updated user
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};
