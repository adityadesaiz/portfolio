import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ScrollReveal } from '@/components/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

interface VisionBlockProps {
  num: string;
  title: string;
  body: string;
  quote: string;
  image?: string;
  isGradient?: boolean;
}

function VisionBlock({ num, title, body, quote, image, isGradient }: VisionBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!blockRef.current || !imageRef.current) return;

    // Parallax on image
    gsap.to(imageRef.current, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: blockRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { scope: blockRef });

  return (
    <div ref={blockRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-24 md:mb-32 last:mb-0">
      {/* Left - Image */}
      <div className="relative overflow-hidden rounded-sm" style={{ minHeight: '300px' }}>
        <div
          ref={imageRef}
          className="absolute inset-0"
          style={{
            background: isGradient
              ? 'linear-gradient(135deg, #0F0E0E 0%, #1A1A1A 50%, #2A2518 100%)'
              : undefined,
            backgroundImage: !isGradient ? `url(${image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'translateY(0)',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Right - Text */}
      <div className="flex flex-col justify-center md:sticky md:top-[25vh] md:self-start">
        <ScrollReveal>
          <p className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-amber mb-4">{num}</p>
          <h3 className="font-archivo font-bold text-[clamp(1.5rem,3.5vw,3rem)] text-text-white tracking-[-0.02em] leading-tight mb-6">
            {title}
          </h3>
          <p className="text-text-white leading-[1.7] mb-8">{body}</p>
          <blockquote className="border-l-[3px] border-amber pl-6 transition-all duration-300 hover:border-l-[5px] hover:pl-7">
            <p className="font-archivo font-semibold text-xl text-amber italic leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
          </blockquote>
        </ScrollReveal>
      </div>
    </div>
  );
}

export function VisionSection() {
  return (
    <section id="vision" className="w-full py-[12vw] px-6 md:px-10">
      <div className="content-container">
        <ScrollReveal className="mb-16 md:mb-24">
          <p className="section-label mb-4">( VISION & APPROACH )</p>
          <h2 className="section-headline">
            How I Think<br />About Architecture
          </h2>
        </ScrollReveal>

        <VisionBlock
          num="01"
          title="Cost Is an Architecture Decision"
          body="Every architectural choice has a cost signature. I design systems where cost optimization is embedded in the architecture itself — not bolted on as an afterthought. Reserved capacity, workload right-sizing, and governance automation are first-class design constraints."
          quote="36.8% cost reduction isn't luck — it's architecture."
          image="/images/vision-1.jpg"
        />

        <VisionBlock
          num="02"
          title="Data Is a Product, Not a Byproduct"
          body="In regulated financial entities, data governance isn't optional — it's existential. I treat data as a product with owners, SLAs, and lifecycle management. Unity Catalog with 9,000+ tables isn't a statistic — it's a governance operating model that scales."
          quote="Governance at scale is product management for data."
          image="/images/vision-2.jpg"
        />

        <VisionBlock
          num="03"
          title="AI Is Infrastructure, Not a Feature"
          body="Production AI systems require the same rigor as any critical infrastructure — latency SLAs, failover patterns, observability, and compliance audit trails. My agentic AI voice platform achieves sub-200ms latency because it's architected as infrastructure, not a prototype."
          quote="Prototype AI demos. Infrastructure ships."
          isGradient={true}
        />
      </div>
    </section>
  );
}
