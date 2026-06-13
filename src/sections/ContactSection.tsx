import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion || !headingRef.current) return;

    const chars = headingRef.current.querySelectorAll('.contact-char');
    gsap.from(chars, {
      opacity: 0,
      y: 40,
      duration: 0.04,
      stagger: 0.015,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headingRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  const splitHeading = (text: string) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="contact-char inline-block"
        style={{ opacity: prefersReducedMotion ? 1 : undefined }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section id="contact" ref={sectionRef} className="w-full py-[12vw] px-6 md:px-10">
      <div className="content-container">
        {/* Label */}
        <ScrollReveal className="flex justify-center mb-6">
          <p className="section-label text-center">( LET&apos;S CONNECT )</p>
        </ScrollReveal>

        {/* Heading */}
        <h2
          ref={headingRef}
          className="font-archivo font-extrabold uppercase text-text-white tracking-[-0.03em] text-center mb-16 md:mb-24"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            lineHeight: 0.9,
          }}
        >
          <span className="block">{splitHeading('Build Something')}</span>
          <span className="block">{splitHeading('Extraordinary')}</span>
        </h2>

        {/* 2-column profile grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left - Portrait */}
          <ScrollReveal direction="left" x={-30}>
            <div className="overflow-hidden rounded-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)] group" data-cursor-hover>
              <img
                src="/images/profile-left.jpg"
                alt="Aditya Desai - Professional portrait"
                className="w-full h-auto object-cover transition-transform duration-400 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </ScrollReveal>

          {/* Right - Text */}
          <ScrollReveal className="flex flex-col justify-center">
            <p className="text-text-white text-lg leading-relaxed mb-6">
              I&apos;m currently exploring senior architect and DVP-level opportunities across Singapore, Dubai, Canada, and Poland — specifically within regulated financial entities, cloud-native enterprises, and AI-first organizations.
            </p>
            <p className="text-muted-grey leading-relaxed mb-8">
              If you&apos;re building at scale and need someone who thinks in systems, costs, and outcomes — let&apos;s talk.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-6">
              <a
                href="#"
                className="font-archivo font-semibold text-base text-text-white hover:text-amber transition-colors duration-300 inline-flex items-center gap-1 group"
                data-cursor-hover
              >
                LinkedIn <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">&#8599;</span>
              </a>
              <a
                href="#"
                className="font-archivo font-semibold text-base text-text-white hover:text-amber transition-colors duration-300 inline-flex items-center gap-1 group"
                data-cursor-hover
              >
                GitHub <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">&#8599;</span>
              </a>
              <a
                href="https://adityadesaiz.github.io/resume/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-archivo font-semibold text-base text-text-white hover:text-amber transition-colors duration-300 inline-flex items-center gap-1 group"
                data-cursor-hover
              >
                Resume <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">&#8599;</span>
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* CTA Bar */}
        <ScrollReveal className="mt-16 md:mt-24" delay={0.3}>
          <div className="card-surface p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <h4 className="font-archivo font-semibold text-2xl text-text-white tracking-[-0.02em] text-center md:text-left">
              Ready to architect the next phase?
            </h4>
            <a
              href="mailto:adityadesaiz@gmail.com"
              className="bg-amber text-midnight font-archivo font-semibold text-sm uppercase px-8 py-4 rounded transition-all duration-300 hover:bg-amber-light hover:-translate-y-0.5 shrink-0"
              data-cursor-hover
            >
              Start a conversation
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
