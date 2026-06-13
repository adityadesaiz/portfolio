import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function ImpactVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Video fade in
    if (videoRef.current) {
      gsap.from(videoRef.current, {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Card slide up
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[80vh] overflow-hidden"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="images/hero-bg.jpg"
      >
        <source src="videos/impact.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-midnight/60 z-[1]" />

      {/* Floating Metric Card */}
      <div
        ref={cardRef}
        className="absolute bottom-[10%] left-[5%] md:left-[10%] z-[2] max-w-[400px] w-[90%] md:w-auto"
      >
        <div
          className="bg-offblack/70 backdrop-blur-xl border border-industrial-grey/40 rounded p-8 md:p-12 transition-all duration-300 hover:-translate-y-1 hover:border-amber/50"
          data-cursor-hover
        >
          <p className="font-archivo font-extrabold text-[4.5rem] leading-[0.9] tracking-[-0.02em] text-text-white">
            36.8<span className="text-amber text-2xl">%</span>
          </p>
          <p className="section-label text-amber mt-3">COST REDUCTION DELIVERED</p>
          <p className="text-muted-grey text-sm mt-4 leading-relaxed">
            Across multi-cloud estates through FinOps governance, reserved capacity optimization, and automated cost attribution.
          </p>
          <a
            href="https://adityadesaiz.github.io/resume/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-amber text-midnight font-archivo font-semibold text-sm uppercase px-8 py-4 rounded transition-all duration-300 hover:bg-amber-light hover:-translate-y-0.5"
            data-cursor-hover
          >
            See the architecture
          </a>
        </div>
      </div>
    </section>
  );
}
