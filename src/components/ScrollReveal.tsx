import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
  delay?: number;
  stagger?: number;
  duration?: number;
  triggerStart?: string;
  y?: number;
  x?: number;
}

export function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  stagger = 0.1,
  duration = 0.8,
  triggerStart = 'top 80%',
  y = 50,
  x = 0,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const elements = containerRef.current.children;
    if (elements.length === 0) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      y: direction === 'up' ? y : 0,
      x: direction === 'left' ? -30 : direction === 'right' ? 30 : x,
      filter: direction === 'up' ? 'blur(4px)' : 'none',
    };

    gsap.from(elements, {
      ...fromVars,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: triggerStart,
        toggleActions: 'play none none none',
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
