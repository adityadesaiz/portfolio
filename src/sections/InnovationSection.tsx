import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ScrollReveal } from '@/components/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const images = [
  { src: '/images/grid-1.jpg', alt: 'Server racks with LED lighting' },
  { src: '/images/grid-2.jpg', alt: 'Circuit board macro' },
  { src: '/images/grid-3.jpg', alt: 'Fiber optic light trails' },
  { src: '/images/grid-4.jpg', alt: 'Dark workspace with laptop' },
];

function ImageRow({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !imageRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { clipPath: 'inset(100% 0 0% 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          end: 'top 30%',
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      imageRef.current,
      { scale: 1.2 },
      {
        scale: 1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          end: 'top 30%',
          scrub: true,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="w-full aspect-video overflow-hidden rounded-sm relative group"
      style={{ clipPath: 'inset(100% 0 0% 0)' }}
      data-cursor-hover
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-amber/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
    </div>
  );
}

export function InnovationSection() {
  return (
    <section id="innovation" className="w-full py-[12vw] px-6 md:px-10">
      <div className="content-container">
        <ScrollReveal className="mb-12">
          <h2 className="section-headline">The Craft</h2>
        </ScrollReveal>

        <div className="flex flex-col gap-8">
          {images.map((img, i) => (
            <ImageRow key={i} src={img.src} alt={img.alt} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="https://adityadesaiz.github.io/resume/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-archivo font-semibold text-lg text-amber link-hover inline-flex items-center gap-2"
            data-cursor-hover
          >
            Explore the architecture <span>&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
