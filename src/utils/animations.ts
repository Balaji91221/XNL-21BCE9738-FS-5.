
import { useEffect } from 'react';

// Animation entrance observer
export const useAnimateEntrances = (selector: string, options = {}) => {
  useEffect(() => {
    const defaultOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
      ...options
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, defaultOptions);

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, [selector, options]);
};

// Animation sequence helper
export const staggerElements = (parentSelector: string, childSelector: string, delayMs: number = 50) => {
  const parent = document.querySelector(parentSelector);
  if (!parent) return;
  
  const elements = parent.querySelectorAll(childSelector);
  elements.forEach((el, index) => {
    (el as HTMLElement).style.opacity = '0';
    setTimeout(() => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transition = 'opacity 0.5s ease-out';
    }, index * delayMs);
  });
};

// Parallax effect for hero sections
export const createParallaxEffect = (element: HTMLElement, speedFactor: number = 0.5) => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const offset = scrollPosition * speedFactor;
    element.style.transform = `translateY(${offset}px)`;
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
};
