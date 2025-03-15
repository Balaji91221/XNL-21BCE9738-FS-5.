
import React from 'react';
import Navbar from '@/components/ui-custom/Navbar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  className,
  fullWidth = false 
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={cn(
        'flex-1 pt-16',
        !fullWidth && 'container mx-auto px-4',
        className
      )}>
        {children}
      </main>
      
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-bold text-primary flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
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
                Nexus
              </div>
              <p className="text-sm text-foreground/70 mt-1">
                Ephemeral video sharing platform
              </p>
            </div>
            
            <div className="text-sm text-foreground/70">
              &copy; {new Date().getFullYear()} Nexus. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
