import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { getLenis } from '@/hooks/useLenis';

const menuItems = [
  { label: 'IDENTITY', target: '#hero' },
  { label: 'PHILOSOPHY', target: '#philosophy' },
  { label: 'SKILLS', target: '#skills' },
  { label: 'IMPACT', target: '#impact' },
  { label: 'VISION', target: '#vision' },
  { label: 'CONNECT', target: '#contact' },
];

export function NavigationHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    if (!overlayRef.current || !menuItemsRef.current) return;

    const tl = gsap.timeline({ paused: true });
    tl.to(overlayRef.current, {
      x: 0,
      duration: 0.6,
      ease: 'power3.inOut',
    });
    tl.from(
      menuItemsRef.current.children,
      {
        y: 40,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power3.out',
      },
      '-=0.3'
    );
    tlRef.current = tl;
  }, { scope: overlayRef });

  useEffect(() => {
    if (menuOpen) {
      tlRef.current?.play();
      document.body.style.overflow = 'hidden';
    } else {
      tlRef.current?.reverse();
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  const handleNavClick = useCallback((target: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const lenis = getLenis();
      const element = document.querySelector(target);
      if (lenis && element) {
        lenis.scrollTo(element as HTMLElement);
      } else if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] px-6 md:px-10 py-4 flex items-center justify-between transition-all duration-400 ${
          scrolled ? 'bg-midnight/80 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-col gap-[6px] group"
          aria-label="Open menu"
          data-cursor-hover
        >
          <span className="w-5 h-[2px] bg-text-white group-hover:bg-amber transition-colors duration-300" />
          <span className="w-5 h-[2px] bg-text-white group-hover:bg-amber transition-colors duration-300" />
        </button>

        {/* Center title */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="absolute left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.1em] uppercase text-text-white hover:text-amber transition-colors duration-300"
          data-cursor-hover
        >
          ADITYA DESAI
        </a>

        {/* Email icon */}
        <a
          href="mailto:adityadesaiz@gmail.com"
          className="text-text-white hover:text-amber transition-colors duration-300"
          aria-label="Send email"
          data-cursor-hover
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </a>
      </header>

      {/* Full-screen menu overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] bg-offblack flex flex-col items-center justify-center"
        style={{ transform: 'translateX(100%)' }}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-6 md:right-10 text-text-white hover:text-amber transition-colors duration-300"
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div ref={menuItemsRef} className="flex flex-col items-center gap-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.target)}
              className="font-archivo font-extrabold text-4xl md:text-6xl uppercase text-text-white hover:text-amber transition-colors duration-300 tracking-[-0.03em]"
              data-cursor-hover
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
