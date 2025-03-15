
import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle, Heart, MessageCircle, Share2, BookmarkPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  id: string;
  username: string;
  avatarUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  id,
  username,
  avatarUrl,
  videoUrl,
  thumbnailUrl,
  caption,
  likes,
  comments,
  shares,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Observe when card is in viewport to autoplay/pause
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!isPlaying) {
            videoElement.play()
              .then(() => setIsPlaying(true))
              .catch(error => console.error("Error playing video:", error));
          }
        } else {
          if (isPlaying) {
            videoElement.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.6 } // Video will play when at least 60% visible
    );

    observer.observe(videoElement);
    
    return () => {
      observer.disconnect();
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error("Error playing video:", error));
    }
  };

  return (
    <div className={cn(
      'rounded-2xl overflow-hidden bg-card shadow-subtle border border-border',
      'transform transition-all duration-300 hover:shadow-elevated',
      'reddit-card', // Adding Reddit-style class
      className
    )}>
      {/* Video Container */}
      <div className="relative aspect-[9/16] bg-black overflow-hidden">
        {/* Thumbnail shown until video loads */}
        {!videoLoaded && (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${thumbnailUrl})` }}>
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white opacity-80" />
            </div>
          </div>
        )}
        
        {/* Video */}
        <div className={cn('absolute inset-0 transition-opacity duration-300', videoLoaded ? 'opacity-100' : 'opacity-0')}>
          <video
            ref={videoRef}
            id={`video-${id}`}
            className="w-full h-full object-cover"
            src={videoUrl}
            poster={thumbnailUrl}
            loop
            muted
            playsInline
            preload="metadata"
            onLoadedData={() => setVideoLoaded(true)}
            onClick={togglePlay}
          />
          
          {/* Play/Pause Overlay */}
          {!isPlaying && videoLoaded && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center" onClick={togglePlay}>
              <PlayCircle className="w-16 h-16 text-white opacity-80" />
            </div>
          )}
        </div>
      </div>
      
      {/* Content - Reddit Style */}
      <div className="p-4 reddit-content">
        {/* Vote Counter (Reddit style) */}
        <div className="flex items-center mb-3">
          <div className="flex flex-col items-center mr-3 bg-accent/30 rounded-md px-2 py-1">
            <button 
              className="text-foreground/70 hover:text-orange-500 transition-colors"
              aria-label="Upvote"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L3 15H21L12 4Z" fill="currentColor" />
              </svg>
            </button>
            <span className="font-bold text-sm my-1">{likes}</span>
            <button 
              className="text-foreground/70 hover:text-blue-500 transition-colors"
              aria-label="Downvote"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20L3 9H21L12 20Z" fill="currentColor" />
              </svg>
            </button>
          </div>
          
          {/* Author */}
          <div className="flex items-center space-x-2">
            <img 
              src={avatarUrl} 
              alt={username} 
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
            <div>
              <div className="font-medium">r/{username}</div>
              <div className="text-xs text-foreground/60">Posted by u/{username}</div>
            </div>
          </div>
        </div>
        
        {/* Caption */}
        <p className="text-sm text-foreground/80 mb-4">{caption}</p>
        
        {/* Actions - Reddit Style */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <button className="flex items-center space-x-1 text-sm text-foreground/70 hover:text-foreground">
            <MessageCircle className="w-5 h-5" />
            <span>{comments} Comments</span>
          </button>
          
          <button className="flex items-center space-x-1 text-sm text-foreground/70 hover:text-foreground">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
          
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={cn(
              'flex items-center text-sm',
              isSaved ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
            )}
          >
            <BookmarkPlus className={cn('w-5 h-5', isSaved && 'fill-primary')} />
            <span className="ml-1">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
