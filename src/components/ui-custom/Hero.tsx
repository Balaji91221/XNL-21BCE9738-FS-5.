
import React, { useEffect, useRef } from 'react';
import { ArrowRight, MessageCircle, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !shapeRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      // Calculate position within the hero element (0 to 1)
      const xPos = (clientX - left) / width;
      const yPos = (clientY - top) / height;
      
      // Apply subtle movement to the shape
      const moveX = (xPos - 0.5) * 30;
      const moveY = (yPos - 0.5) * 30;
      
      shapeRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleGetStarted = () => {
    toast({
      title: "Welcome to Nexus!",
      description: "Start sharing your moments with the world",
    });
  };

  return (
    <div
      ref={heroRef}
      className={cn(
        'relative overflow-hidden pt-24 pb-16 md:py-32 px-4',
        className
      )}
    >
      {/* Background Shapes */}
      <div
        ref={shapeRef}
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-70 transition-transform duration-[1.5s] ease-smooth"
        aria-hidden="true"
      />
      
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/30 rounded-full blur-[100px] opacity-60"
        aria-hidden="true"
      />
      
      <div className="container relative z-10 mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          {/* Label */}
          <div className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-6 animate-fade-in">
            Introducing the future of video sharing
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            <span className="block">Share moments that</span>
            <span className="text-gradient-primary">matter</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-8 animate-fade-in delay-75">
            A next-generation platform for sharing ephemeral videos and messages. Capture the present, share in real-time, and express yourself in ways never before possible.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-lg mb-10 animate-fade-in delay-100">
            <div className="glass rounded-xl p-3 md:p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">2M+</p>
              <p className="text-xs md:text-sm text-foreground/70">Active Users</p>
            </div>
            <div className="glass rounded-xl p-3 md:p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">4.9</p>
              <p className="text-xs md:text-sm text-foreground/70">App Rating</p>
            </div>
            <div className="glass rounded-xl p-3 md:p-4 text-center col-span-2 md:col-span-1">
              <p className="text-2xl md:text-3xl font-bold text-primary">10M+</p>
              <p className="text-xs md:text-sm text-foreground/70">Daily Messages</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-150">
            <Link to="/messages" onClick={handleGetStarted}>
              <Button 
                size="lg" 
                rightIcon={<ArrowRight className="w-4 h-4" />} 
                className="group relative overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></span>
              </Button>
            </Link>
            <Link to="/explore">
              <Button 
                size="lg" 
                variant="outline" 
                leftIcon={<Video className="w-4 h-4" />}
              >
                Explore Videos
              </Button>
            </Link>
            <Link to="/messages">
              <Button 
                size="lg" 
                variant="secondary" 
                leftIcon={<MessageCircle className="w-4 h-4" />}
                className="hidden sm:flex"
              >
                Start Messaging
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-secondary/50 to-transparent"></div>
    </div>
  );
};

export default Hero;
