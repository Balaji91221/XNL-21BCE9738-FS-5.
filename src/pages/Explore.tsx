
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Award, Flame, Star } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import VideoCard from '@/components/ui-custom/VideoCard';
import { staggerElements } from '@/utils/animations';

// Mock data for videos
const mockVideos = [
  {
    id: '1',
    username: 'creativecreator',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-off-her-alarm-clock-42896-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620926677220-ae8363dd2d1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1772&q=80',
    caption: 'Morning routine in the city #lifestyle #morning',
    likes: 2458,
    comments: 89,
    shares: 124,
  },
  {
    id: '2',
    username: 'travelexplorer',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506400889297-eebd3997a355?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1778&q=80',
    caption: 'The city that never sleeps ✨ #citylife #nightvibes',
    likes: 3872,
    comments: 215,
    shares: 432,
  },
  {
    id: '3',
    username: 'foodiechef',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-asian-food-on-a-pan-28132-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80',
    caption: 'Quick and easy weeknight stir fry recipe 🍜 #foodie #cooking',
    likes: 1954,
    comments: 126,
    shares: 87,
  },
  {
    id: '4',
    username: 'fitnesscoach',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-stretching-her-body-42262-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    caption: 'Morning stretch routine for busy professionals 💪 #fitness #wellness',
    likes: 2687,
    comments: 143,
    shares: 209,
  },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState(mockVideos);
  const [sortBy, setSortBy] = useState('hot');

  // Apply staggered animation to video cards
  useEffect(() => {
    const timer = setTimeout(() => {
      staggerElements('.videos-grid', '.video-card', 150);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout>
      <div className="pt-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">r/explore</h1>
          
          {/* Search Bar - Reddit Style */}
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-foreground/40" />
            </div>
            <input
              type="text"
              placeholder="Search r/explore"
              className="block w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Reddit-style Sorting */}
        <div className="flex overflow-x-auto no-scrollbar mb-6 bg-card rounded-lg p-1">
          <button
            className={`flex items-center px-4 py-2 rounded-md ${sortBy === 'hot' ? 'bg-accent text-foreground' : 'text-foreground/70 hover:bg-accent/50'}`}
            onClick={() => setSortBy('hot')}
          >
            <Flame className="w-4 h-4 mr-2" />
            Hot
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-md ${sortBy === 'new' ? 'bg-accent text-foreground' : 'text-foreground/70 hover:bg-accent/50'}`}
            onClick={() => setSortBy('new')}
          >
            <Star className="w-4 h-4 mr-2" />
            New
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-md ${sortBy === 'top' ? 'bg-accent text-foreground' : 'text-foreground/70 hover:bg-accent/50'}`}
            onClick={() => setSortBy('top')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Top
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-md ${sortBy === 'award' ? 'bg-accent text-foreground' : 'text-foreground/70 hover:bg-accent/50'}`}
            onClick={() => setSortBy('award')}
          >
            <Award className="w-4 h-4 mr-2" />
            Awarded
          </button>
        </div>
        
        {/* Trending Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'r/videos', 'r/gifs', 'r/funny', 'r/unexpected', 'r/nextfuckinglevel', 'r/aww', 'r/gaming'].map((tag) => (
            <button
              key={tag}
              className="px-4 py-1.5 text-sm font-medium rounded-full bg-accent text-foreground/70 hover:bg-accent/80 hover:text-foreground transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
        
        {/* Videos Grid */}
        <div className="videos-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              {...video}
              className="video-card opacity-0 reddit-card"
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Explore;
