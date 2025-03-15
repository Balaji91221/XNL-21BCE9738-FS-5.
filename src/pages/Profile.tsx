
import React, { useState, useEffect } from 'react';
import { Settings, Camera, Grid3X3, Bookmark, MessageSquare } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import Button from '@/components/ui-custom/Button';
import VideoRecorder from '@/components/ui-custom/VideoRecorder';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileTab = ({ 
  children, 
  isActive, 
  icon, 
  onClick 
}: { 
  children: React.ReactNode; 
  isActive: boolean; 
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    className={cn(
      'flex items-center gap-2 p-4 border-b-2 font-medium transition-colors',
      isActive 
        ? 'border-primary text-primary' 
        : 'border-transparent text-foreground/60 hover:text-foreground hover:border-border'
    )}
    onClick={onClick}
  >
    {icon}
    {children}
  </button>
);

const Profile = () => {
  const [activeTab, setActiveTab] = React.useState('videos');
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [videos, setVideos] = useState<Blob[]>([]);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      toast({
        title: 'Authentication required',
        description: 'Please log in to view your profile',
      });
    }
  }, [isAuthenticated, navigate, toast]);
  
  // Load saved videos from localStorage
  useEffect(() => {
    if (user) {
      const savedVideosString = localStorage.getItem(`videos_${user.id}`);
      if (savedVideosString) {
        try {
          const videoUrls = JSON.parse(savedVideosString);
          const loadVideos = async () => {
            const loadedVideos: Blob[] = [];
            for (const url of videoUrls) {
              try {
                const response = await fetch(url);
                const blob = await response.blob();
                loadedVideos.push(blob);
              } catch (error) {
                console.error('Failed to load video:', error);
              }
            }
            setVideos(loadedVideos);
          };
          loadVideos();
        } catch (error) {
          console.error('Failed to parse saved videos:', error);
        }
      }
    }
  }, [user]);
  
  // If not authenticated yet, show loading or nothing
  if (!user) {
    return null;
  }
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleSaveVideo = (videoBlob: Blob) => {
    const newVideos = [...videos, videoBlob];
    setVideos(newVideos);
    setIsRecorderOpen(false);
    
    // Save to "database" (localStorage)
    if (user) {
      // Create URLs for all videos
      const videoUrls = newVideos.map(blob => URL.createObjectURL(blob));
      localStorage.setItem(`videos_${user.id}`, JSON.stringify(videoUrls));
    }
    
    toast({
      title: "Video Created",
      description: "Your video has been added to your profile",
    });
  };

  return (
    <AppLayout fullWidth className="pb-16">
      {/* Cover Photo */}
      <div 
        className="h-64 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${user.coverUrl || 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      </div>
      
      {/* Profile Info */}
      <div className="container mx-auto px-4">
        <div className="relative flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-20 gap-6 md:gap-10 mb-6 md:mb-10">
          {/* Avatar */}
          <div className="relative z-10">
            <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80'} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-foreground/60 mb-2">@{user.email.split('@')[0]}</p>
            <p className="text-foreground/80 max-w-lg mb-4">{user.bio || 'No bio yet'}</p>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-semibold">{formatNumber(user.followers || 0)}</div>
                <div className="text-sm text-foreground/60">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{formatNumber(user.following || 0)}</div>
                <div className="text-sm text-foreground/60">Following</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{formatNumber(user.likes || 0)}</div>
                <div className="text-sm text-foreground/60">Likes</div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="primary">Follow</Button>
            <Button variant="outline" leftIcon={<MessageSquare className="w-4 h-4" />}>
              Message
            </Button>
            <Button 
              variant="ghost" 
              className="p-2 aspect-square rounded-full"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <div className="flex overflow-x-auto no-scrollbar">
            <ProfileTab 
              isActive={activeTab === 'videos'} 
              icon={<Grid3X3 className="w-5 h-5" />}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </ProfileTab>
            <ProfileTab 
              isActive={activeTab === 'saved'} 
              icon={<Bookmark className="w-5 h-5" />}
              onClick={() => setActiveTab('saved')}
            >
              Saved
            </ProfileTab>
            <ProfileTab 
              isActive={activeTab === 'photos'} 
              icon={<Camera className="w-5 h-5" />}
              onClick={() => setActiveTab('photos')}
            >
              Photos
            </ProfileTab>
          </div>
        </div>
        
        {/* Content Area */}
        {videos.length > 0 && activeTab === 'videos' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video, index) => (
              <div key={index} className="aspect-[9/16] bg-accent rounded-lg overflow-hidden">
                <video 
                  src={URL.createObjectURL(video)} 
                  className="w-full h-full object-cover" 
                  controls
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-foreground/50" />
            </div>
            <h3 className="text-xl font-medium mb-2">No content yet</h3>
            <p className="text-foreground/60 text-center max-w-md mb-6">
              {activeTab === 'videos' 
                ? "When you create videos, they'll appear here." 
                : activeTab === 'saved' 
                  ? "Items you save will appear here." 
                  : "Photos you share will appear here."}
            </p>
            {activeTab === 'videos' && (
              <Button onClick={() => setIsRecorderOpen(true)}>
                Create Video
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Video Recorder Modal */}
      <VideoRecorder 
        isOpen={isRecorderOpen}
        onClose={() => setIsRecorderOpen(false)}
        onSave={handleSaveVideo}
      />
    </AppLayout>
  );
};

export default Profile;
