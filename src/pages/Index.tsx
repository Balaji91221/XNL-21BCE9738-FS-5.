
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Shield, Video, Zap, ArrowRight, Users, Lock, Star, Globe, CheckCircle, Play } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import Hero from '@/components/ui-custom/Hero';
import Button from '@/components/ui-custom/Button';
import FeatureCard from '@/components/ui-custom/FeatureCard';
import { staggerElements } from '@/utils/animations';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();

  // Apply staggered animation to feature cards
  useEffect(() => {
    const timer = setTimeout(() => {
      staggerElements('.features-grid', '.feature-card', 100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Video className="w-6 h-6" />,
      title: 'Ephemeral Video Sharing',
      description: 'Share videos that auto-delete after a set time. Perfect for moments that matter now.',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Real-time Messaging',
      description: 'Connect with friends through instant encrypted messaging with video, audio, and text.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'AI Content Moderation',
      description: 'Our intelligent systems ensure a safe environment while respecting your privacy.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'High-Performance Playback',
      description: 'Smooth, buffer-free video playback optimized for all network conditions.',
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      quote: "Nexus has transformed how I connect with my audience. The ephemeral videos create a sense of FOMO that keeps engagement high.",
      avatar: null,
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Photographer",
      quote: "The quality of video playback is outstanding, even in areas with poor connectivity. My work has never looked better on mobile.",
      avatar: null,
      rating: 5
    },
    {
      name: "Aisha Patel",
      role: "Digital Marketer",
      quote: "I've tried many platforms, but Nexus offers the perfect balance of privacy, performance, and user experience.",
      avatar: null,
      rating: 4
    }
  ];

  return (
    <AppLayout fullWidth>
      {/* Hero Section with improved design */}
      <Hero />
      
      {/* Features Section with subtle design improvements */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-4 animate-fade-in">
              Designed For Everyone
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
              Next-Generation Video Platform
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto animate-fade-in">
              A beautiful, intuitive platform designed around privacy, performance, and expression.
            </p>
          </div>
          
          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className="feature-card hover:-translate-y-1"
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* New Testimonials Section */}
      <section className="py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Join thousands of satisfied users creating amazing content
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass p-6 rounded-2xl hover:shadow-elevated transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-foreground/80 italic mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center font-medium">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-foreground/60">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section - Enhanced Design */}
      <section className="py-16 md:py-24 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-accent text-accent-foreground text-sm font-medium px-3 py-1 rounded-full mb-4">
              Simple & Powerful
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Start sharing moments in three easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white/80 rounded-xl shadow-md">
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-4">
                <Users className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Account</h3>
              <p className="text-foreground/70">Sign up in seconds using your email or social accounts.</p>
              <div className="mt-4">
                <Link to="/signup">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
            <div className="text-center p-6 bg-white/80 rounded-xl shadow-md">
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-4">
                <Video className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Record Your Moment</h3>
              <p className="text-foreground/70">Capture videos directly or upload from your gallery.</p>
              <div className="mt-4">
                <Link to="/explore">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    rightIcon={<Play className="w-3 h-3" />}
                  >
                    Record
                  </Button>
                </Link>
              </div>
            </div>
            <div className="text-center p-6 bg-white/80 rounded-xl shadow-md">
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-4">
                <MessageSquare className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share & Connect</h3>
              <p className="text-foreground/70">Share with friends and start conversations instantly.</p>
              <div className="mt-4">
                <Link to="/messages">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    rightIcon={<MessageSquare className="w-3 h-3" />}
                  >
                    Message
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/messages">
              <Button 
                variant="primary" 
                size="lg" 
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Start Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Section - New */}
      <section className="py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="glass p-12 rounded-3xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-primary text-4xl md:text-5xl font-bold">2M+</div>
                <p className="text-foreground/70">Active Users</p>
              </div>
              <div className="space-y-2">
                <div className="text-primary text-4xl md:text-5xl font-bold">10M+</div>
                <p className="text-foreground/70">Videos Shared</p>
              </div>
              <div className="space-y-2">
                <div className="text-primary text-4xl md:text-5xl font-bold">200+</div>
                <p className="text-foreground/70">Countries</p>
              </div>
              <div className="space-y-2">
                <div className="text-primary text-4xl md:text-5xl font-bold">4.9</div>
                <p className="text-foreground/70">App Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Security Section - Enhanced */}
      <section className="py-16 md:py-24 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-4">
                Privacy First
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your Security Is Our Priority
              </h2>
              <p className="text-lg text-foreground/70 mb-6">
                We've built Nexus with end-to-end encryption, auto-deletion, and privacy controls at its core. Your moments stay private and secure.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-600 rounded-full p-1.5">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">End-to-end encryption</p>
                    <p className="text-sm text-foreground/70">All messages and videos are fully encrypted</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-600 rounded-full p-1.5">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Auto-deletion</p>
                    <p className="text-sm text-foreground/70">Content automatically deleted after viewing</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-600 rounded-full p-1.5">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Granular privacy controls</p>
                    <p className="text-sm text-foreground/70">Complete control over who can see your content</p>
                  </div>
                </li>
              </ul>
              <Link to="/explore">
                <Button variant="primary">Learn About Security</Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="glass rounded-2xl p-8 overflow-hidden relative z-10 border border-white/20">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -m-10"></div>
                  <div className="text-center">
                    <Lock className="w-16 h-16 mx-auto text-primary mb-4" />
                    <h3 className="text-2xl font-semibold mb-3">Privacy Guarantee</h3>
                    <p className="text-foreground/70 mb-6">
                      We never store or analyze your private messages and videos. What happens in Nexus, stays in Nexus.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/30 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-primary">100%</p>
                        <p className="text-sm text-foreground/70">Encrypted</p>
                      </div>
                      <div className="bg-white/30 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-primary">0</p>
                        <p className="text-sm text-foreground/70">Data Stored</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="flex items-center justify-center text-sm gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>GDPR Compliant</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Global Section - New */}
      <section className="py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Global Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Connect Across the Globe
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Join a diverse community of creators from over 200 countries
            </p>
          </div>
          
          <div className="relative rounded-3xl overflow-hidden h-[400px] glass">
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="w-60 h-60 text-primary/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-2">Go Global</h3>
                  <p className="text-lg text-foreground/80 max-w-md mx-auto mb-6">
                    Share your moments with friends and followers worldwide
                  </p>
                  <Link to="/explore">
                    <Button
                      variant="primary"
                      size="lg"
                      leftIcon={<Globe className="w-5 h-5" />}
                    >
                      Explore Global Content
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Enhanced */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="glass rounded-3xl p-12 text-center relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -m-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full -m-32"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
                Ready to experience the future of video sharing?
              </h2>
              <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-8 animate-fade-in">
                Join thousands of creators who are already sharing moments that matter.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup">
                  <Button 
                    size="lg" 
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="bg-gradient-to-r from-primary to-primary/80"
                  >
                    Get Started for Free
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2"
                  >
                    Explore Videos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default Index;
