
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, User, Mail, Plus, Menu, X, Video, Image, MicIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { path: '/explore', icon: <Compass className="w-5 h-5" />, label: 'Explore' },
    { path: '/messages', icon: <Mail className="w-5 h-5" />, label: 'Messages' },
    { path: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];

  const createOptions = [
    { 
      icon: <Video className="w-5 h-5 text-blue-500" />, 
      label: 'Record Video', 
      description: 'Create a new video to share with friends',
      onClick: () => {
        setIsCreateDialogOpen(false);
        if (!isAuthenticated) {
          toast({
            title: "Authentication required",
            description: "Please log in to record videos",
            variant: "destructive"
          });
          return;
        }
        window.location.href = '/profile?action=record';
      }
    },
    { 
      icon: <Image className="w-5 h-5 text-green-500" />, 
      label: 'Upload Media', 
      description: 'Share photos or videos from your device',
      onClick: () => {
        setIsCreateDialogOpen(false);
        toast({
          title: "Coming Soon",
          description: "This feature will be available soon!"
        });
      }
    },
    { 
      icon: <MicIcon className="w-5 h-5 text-purple-500" />, 
      label: 'Audio Message', 
      description: 'Record a voice message to share',
      onClick: () => {
        setIsCreateDialogOpen(false);
        toast({
          title: "Coming Soon",
          description: "This feature will be available soon!"
        });
      }
    },
    { 
      icon: <FileText className="w-5 h-5 text-orange-500" />, 
      label: 'Create Story', 
      description: 'Share a text update with your followers',
      onClick: () => {
        setIsCreateDialogOpen(false);
        toast({
          title: "Coming Soon",
          description: "This feature will be available soon!"
        });
      }
    },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 smooth-transition',
        isScrolled ? 'glass shadow-subtle py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold text-primary">
          <span className="sr-only">Nexus</span>
          <svg
            className="w-8 h-8"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 2L30 16L16 30L2 16L16 2Z"
              className="fill-primary"
            />
            <path
              d="M16 9L23 16L16 23L9 16L16 9Z"
              className="fill-white"
            />
          </svg>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'p-2 rounded-lg flex flex-col items-center text-sm font-medium transition-colors no-tap-highlight',
                  isActive
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                )
              }
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Create Button with Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="primary" 
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              className="hidden md:flex bg-gradient-to-r from-primary to-primary/80"
            >
              Create
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Content</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              {createOptions.map((option, index) => (
                <button
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent transition-colors text-left"
                  onClick={option.onClick}
                >
                  <div className="p-2 bg-background rounded-lg">
                    {option.icon}
                  </div>
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 right-0 p-4 animate-fade-in">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'p-3 rounded-lg flex items-center space-x-3 font-medium',
                    isActive
                      ? 'bg-accent text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-accent/50'
                  )
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
            
            {/* Mobile Create Button */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="primary" 
                  size="md"
                  leftIcon={<Plus className="w-4 h-4" />}
                  fullWidth
                  className="mt-4 bg-gradient-to-r from-primary to-primary/80"
                >
                  Create
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
