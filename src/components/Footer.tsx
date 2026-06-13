import { ScrollReveal } from './ScrollReveal';

export function Footer() {
  return (
    <footer id="footer" className="bg-midnight border-t border-industrial-grey/30 pt-32 pb-12 px-6 md:px-10">
      <div className="content-container">
        <ScrollReveal>
          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-3">
              <h3 className="font-archivo font-extrabold text-[clamp(2rem,3.5vw,3.5rem)] text-text-white leading-tight tracking-[-0.02em]">
                Let's build something extraordinary.
              </h3>
              <a
                href="mailto:adityadesaiz@gmail.com"
                className="font-mono text-base text-muted-grey hover:text-amber transition-colors duration-300 mt-4 inline-block"
                data-cursor-hover
              >
                adityadesaiz@gmail.com
              </a>
            </div>
            <div>
              <p className="section-label mb-4">LINKS</p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://adityadesaiz.github.io/resume/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-white hover:text-amber transition-colors duration-300 font-archivo"
                  data-cursor-hover
                >
                  Resume
                </a>
                <a
                  href="#"
                  className="text-text-white hover:text-amber transition-colors duration-300 font-archivo"
                  data-cursor-hover
                >
                  GitHub
                </a>
                <a
                  href="#"
                  className="text-text-white hover:text-amber transition-colors duration-300 font-archivo"
                  data-cursor-hover
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Middle */}
          <div className="mt-12 flex justify-center">
            <p className="font-mono text-[0.625rem] tracking-[0.1em] uppercase text-amber text-center">
              ( AVAILABLE FOR SENIOR ARCHITECT ROLES )
            </p>
          </div>

          {/* Bottom */}
          <div className="mt-24 flex justify-center">
            <p className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-muted-grey">
              &copy; 2025 Aditya Desai
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
