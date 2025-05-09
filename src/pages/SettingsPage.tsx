
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Eye, 
  EyeOff,
  Shield, 
  Download
} from 'lucide-react';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import { getUserProfile, updateUserProfile, updateUserPassword, updateUserNotifications, updateUserPreferences } from '@/services/api';

// Form validation schemas
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const SettingsPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    newContent: true,
    watchlist: true,
    specialOffers: false,
    newsletters: false,
  });
  
  // Preference settings
  const [preferences, setPreferences] = useState({
    autoplay: true,
    playbackQuality: 'auto', // 'auto', 'low', 'medium', 'high'
    downloads: {
      wifiOnly: true,
      autoDelete: false,
      videoQuality: 'medium', // 'low', 'medium', 'high'
    }
  });

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });
  
  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
        
        // Update form values
        profileForm.reset({
          name: profileData?.name || '',
          email: profileData?.email || '',
        });

        // Update notifications state from profile data
        if (profileData?.notifications) {
          setNotifications(profileData.notifications);
        }
        
        // Update preferences state from profile data
        if (profileData?.preferences) {
          setPreferences(profileData.preferences);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);
    try {
      await updateUserProfile(data);
      setProfile({...profile, ...data});
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsUpdating(true);
    try {
      await updateUserPassword(data.currentPassword, data.newPassword);
      toast.success('Password updated successfully');
      passwordForm.reset();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    const updatedNotifications = { ...notifications, [key]: value };
    setNotifications(updatedNotifications);
    
    try {
      await updateUserNotifications(updatedNotifications);
      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update notification settings');
      // Revert change on error
      setNotifications(notifications);
    }
  };

  const handlePreferenceChange = async (path: string[], value: any) => {
    // Create a deep copy of preferences
    const updatedPreferences = JSON.parse(JSON.stringify(preferences));
    
    // Update the specific preference
    let current = updatedPreferences;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    
    setPreferences(updatedPreferences);
    
    try {
      await updateUserPreferences(updatedPreferences);
      toast.success('Preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
      // Revert change on error
      setPreferences(preferences);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-disney-dark-blue">
        <Header />
        <div className="h-screen flex items-center justify-center">
          <div className="text-disney-white">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-disney-dark-blue pb-20">
      <Header />
      
      <main className="pt-24 px-4 md:px-6 max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-disney-white mb-6">Account Settings</h1>
        
        {/* Profile Information */}
        <section className="mb-8">
          <Collapsible
            open={openSection === 'profile'}
            onOpenChange={() => setOpenSection(openSection === 'profile' ? null : 'profile')}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full mb-4 text-left">
              <div className="flex items-center">
                <User size={20} className="text-disney-white mr-2" />
                <h2 className="text-xl font-bold text-disney-white">Profile Information</h2>
              </div>
              <div className={`transform transition-transform ${openSection === 'profile' ? 'rotate-180' : ''}`}>
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L7 7L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <Card className="bg-disney-secondary-blue border-disney-gray-700">
                <CardContent className="pt-6">
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-disney-white">Full Name</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Your name" 
                                  className="bg-disney-gray-900 border-disney-gray-700 text-disney-white pl-10" 
                                  {...field} 
                                />
                              </FormControl>
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-disney-gray-500" />
                            </div>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-disney-white">Email Address</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Your email" 
                                  className="bg-disney-gray-900 border-disney-gray-700 text-disney-white pl-10" 
                                  {...field} 
                                />
                              </FormControl>
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-disney-gray-500" />
                            </div>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        disabled={isUpdating} 
                        className="bg-disney-accent-blue hover:bg-blue-700"
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </section>
        
        {/* Password Update */}
        <section className="mb-8">
          <Collapsible
            open={openSection === 'password'}
            onOpenChange={() => setOpenSection(openSection === 'password' ? null : 'password')}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full mb-4 text-left">
              <div className="flex items-center">
                <Lock size={20} className="text-disney-white mr-2" />
                <h2 className="text-xl font-bold text-disney-white">Change Password</h2>
              </div>
              <div className={`transform transition-transform ${openSection === 'password' ? 'rotate-180' : ''}`}>
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L7 7L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <Card className="bg-disney-secondary-blue border-disney-gray-700">
                <CardContent className="pt-6">
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-disney-white">Current Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  className="bg-disney-gray-900 border-disney-gray-700 text-disney-white pl-10"
                                  {...field}
                                />
                              </FormControl>
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-disney-gray-500" />
                            </div>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-disney-white">New Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={isPasswordVisible ? "text" : "password"}
                                  placeholder="••••••••"
                                  className="bg-disney-gray-900 border-disney-gray-700 text-disney-white pl-10"
                                  {...field}
                                />
                              </FormControl>
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-disney-gray-500" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-10 w-10 text-disney-gray-500 hover:text-disney-white"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                              >
                                {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-disney-white">Confirm New Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={isConfirmPasswordVisible ? "text" : "password"}
                                  placeholder="••••••••"
                                  className="bg-disney-gray-900 border-disney-gray-700 text-disney-white pl-10"
                                  {...field}
                                />
                              </FormControl>
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-disney-gray-500" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-10 w-10 text-disney-gray-500 hover:text-disney-white"
                                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                              >
                                {isConfirmPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        disabled={isUpdating} 
                        className="bg-disney-accent-blue hover:bg-blue-700"
                      >
                        {isUpdating ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </section>
        
        {/* Notification Settings */}
        <section className="mb-8">
          <Collapsible
            open={openSection === 'notifications'}
            onOpenChange={() => setOpenSection(openSection === 'notifications' ? null : 'notifications')}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full mb-4 text-left">
              <div className="flex items-center">
                <Bell size={20} className="text-disney-white mr-2" />
                <h2 className="text-xl font-bold text-disney-white">Notifications</h2>
              </div>
              <div className={`transform transition-transform ${openSection === 'notifications' ? 'rotate-180' : ''}`}>
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L7 7L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <Card className="bg-disney-secondary-blue border-disney-gray-700">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-disney-white font-medium">New Content Alerts</p>
                        <p className="text-sm text-disney-gray-300">Get notified when new content is available</p>
                      </div>
                      <Switch 
                        checked={notifications.newContent} 
                        onCheckedChange={(checked) => handleNotificationChange('newContent', checked)}
                      />
                    </div>
                    
                    <Separator className="bg-disney-gray-700" />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-disney-white font-medium">Watchlist Updates</p>
                        <p className="text-sm text-disney-gray-300">Get notified about changes to your watchlist</p>
                      </div>
                      <Switch 
                        checked={notifications.watchlist} 
                        onCheckedChange={(checked) => handleNotificationChange('watchlist', checked)}
                      />
                    </div>
                    
                    <Separator className="bg-disney-gray-700" />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-disney-white font-medium">Special Offers</p>
                        <p className="text-sm text-disney-gray-300">Receive notifications about special offers and promotions</p>
                      </div>
                      <Switch 
                        checked={notifications.specialOffers} 
                        onCheckedChange={(checked) => handleNotificationChange('specialOffers', checked)}
                      />
                    </div>
                    
                    <Separator className="bg-disney-gray-700" />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-disney-white font-medium">Email Newsletters</p>
                        <p className="text-sm text-disney-gray-300">Receive Disney+ newsletters</p>
                      </div>
                      <Switch 
                        checked={notifications.newsletters} 
                        onCheckedChange={(checked) => handleNotificationChange('newsletters', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </section>
        
        {/* Playback & Downloads */}
        <section className="mb-8">
          <Collapsible
            open={openSection === 'playback'}
            onOpenChange={() => setOpenSection(openSection === 'playback' ? null : 'playback')}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full mb-4 text-left">
              <div className="flex items-center">
                <Download size={20} className="text-disney-white mr-2" />
                <h2 className="text-xl font-bold text-disney-white">Playback & Downloads</h2>
              </div>
              <div className={`transform transition-transform ${openSection === 'playback' ? 'rotate-180' : ''}`}>
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L7 7L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <Card className="bg-disney-secondary-blue border-disney-gray-700">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-disney-white font-medium">Autoplay Next Episode</p>
                        <p className="text-sm text-disney-gray-300">Automatically play the next episode in a series</p>
                      </div>
                      <Switch 
                        checked={preferences.autoplay} 
                        onCheckedChange={(checked) => handlePreferenceChange(['autoplay'], checked)}
                      />
                    </div>
                    
                    <Separator className="bg-disney-gray-700" />
                    
                    <div className="space-y-2">
                      <p className="text-disney-white font-medium">Preferred Playback Quality</p>
                      <p className="text-sm text-disney-gray-300">Select your preferred streaming quality</p>
                      <div className="grid grid-cols-1 gap-2 pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="quality-auto" 
                            checked={preferences.playbackQuality === 'auto'} 
                            onCheckedChange={() => handlePreferenceChange(['playbackQuality'], 'auto')}
                          />
                          <label htmlFor="quality-auto" className="text-sm text-disney-white cursor-pointer">
                            Auto (Recommended)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="quality-low" 
                            checked={preferences.playbackQuality === 'low'} 
                            onCheckedChange={() => handlePreferenceChange(['playbackQuality'], 'low')}
                          />
                          <label htmlFor="quality-low" className="text-sm text-disney-white cursor-pointer">
                            Low (Data Saver)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="quality-medium" 
                            checked={preferences.playbackQuality === 'medium'} 
                            onCheckedChange={() => handlePreferenceChange(['playbackQuality'], 'medium')}
                          />
                          <label htmlFor="quality-medium" className="text-sm text-disney-white cursor-pointer">
                            Medium
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="quality-high" 
                            checked={preferences.playbackQuality === 'high'} 
                            onCheckedChange={() => handlePreferenceChange(['playbackQuality'], 'high')}
                          />
                          <label htmlFor="quality-high" className="text-sm text-disney-white cursor-pointer">
                            High
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="bg-disney-gray-700" />
                    
                    <div>
                      <p className="text-disney-white font-medium mb-3">Download Settings</p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-disney-white">Download on Wi-Fi Only</p>
                            <p className="text-xs text-disney-gray-300">Save mobile data by downloading only on Wi-Fi</p>
                          </div>
                          <Switch 
                            checked={preferences.downloads.wifiOnly} 
                            onCheckedChange={(checked) => handlePreferenceChange(['downloads', 'wifiOnly'], checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-disney-white">Auto-Delete Watched Downloads</p>
                            <p className="text-xs text-disney-gray-300">Remove downloaded content after you've watched it</p>
                          </div>
                          <Switch 
                            checked={preferences.downloads.autoDelete} 
                            onCheckedChange={(checked) => handlePreferenceChange(['downloads', 'autoDelete'], checked)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-disney-white">Download Video Quality</p>
                          <div className="grid grid-cols-1 gap-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="download-quality-low" 
                                checked={preferences.downloads.videoQuality === 'low'} 
                                onCheckedChange={() => handlePreferenceChange(['downloads', 'videoQuality'], 'low')}
                              />
                              <label htmlFor="download-quality-low" className="text-xs text-disney-white cursor-pointer">
                                Standard Definition (Smaller file size)
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="download-quality-medium" 
                                checked={preferences.downloads.videoQuality === 'medium'} 
                                onCheckedChange={() => handlePreferenceChange(['downloads', 'videoQuality'], 'medium')}
                              />
                              <label htmlFor="download-quality-medium" className="text-xs text-disney-white cursor-pointer">
                                High Definition
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="download-quality-high" 
                                checked={preferences.downloads.videoQuality === 'high'} 
                                onCheckedChange={() => handlePreferenceChange(['downloads', 'videoQuality'], 'high')}
                              />
                              <label htmlFor="download-quality-high" className="text-xs text-disney-white cursor-pointer">
                                Ultra HD (Largest file size)
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </section>
        
        {/* Privacy & Security */}
        <section className="mb-8">
          <Collapsible
            open={openSection === 'privacy'}
            onOpenChange={() => setOpenSection(openSection === 'privacy' ? null : 'privacy')}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full mb-4 text-left">
              <div className="flex items-center">
                <Shield size={20} className="text-disney-white mr-2" />
                <h2 className="text-xl font-bold text-disney-white">Privacy & Security</h2>
              </div>
              <div className={`transform transition-transform ${openSection === 'privacy' ? 'rotate-180' : ''}`}>
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L7 7L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <Card className="bg-disney-secondary-blue border-disney-gray-700">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-disney-white font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-disney-gray-300">Add an extra layer of security to your account</p>
                      </div>
                      <Button className="text-disney-white bg-disney-accent-blue hover:bg-blue-700" size="sm">
                        Enable
                      </Button>
                    </div>
                    
                    <Separator className="bg-disney-gray-700" />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-disney-white font-medium">Data Usage & Privacy</p>
                        <p className="text-sm text-disney-gray-300">Manage how your data is used and collected</p>
                      </div>
                      <Button variant="outline" className="text-disney-white border-disney-gray-700" size="sm">
                        Manage
                      </Button>
                    </div>
                    
                    <Separator className="bg-disney-gray-700" />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-disney-white font-medium">Device Management</p>
                        <p className="text-sm text-disney-gray-300">See and manage devices signed into your account</p>
                      </div>
                      <Button variant="outline" className="text-disney-white border-disney-gray-700" size="sm">
                        View Devices
                      </Button>
                    </div>
                    
                    <Separator className="bg-disney-gray-700" />
                    
                    <div>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                      <p className="text-xs text-disney-gray-300 mt-2 text-center">
                        This action is irreversible and will delete all your data.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;
