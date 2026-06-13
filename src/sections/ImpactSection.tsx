import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ScrollReveal } from '@/components/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  title: string;
  year: string;
  description: string;
  metric: string;
  tags: string[];
  gradient: string;
  overlayPattern?: string;
  hasCrosshair?: boolean;
  hasParallax?: boolean;
  delay: number;
}

function ProjectCard({ title, year, description, metric, tags, gradient, overlayPattern, hasCrosshair, hasParallax, delay }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useGSAP(() => {
    if (!cardRef.current) return;
    gsap.from(cardRef.current, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: cardRef });

  // Crosshair cursor effect
  useEffect(() => {
    if (!hasCrosshair || !imageRef.current || !crosshairRef.current) return;

    const image = imageRef.current;
    const crosshair = crosshairRef.current;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = image.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    const onMouseEnter = () => {
      crosshair.style.opacity = '1';
    };

    const onMouseLeave = () => {
      crosshair.style.opacity = '0';
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      crosshair.style.transform = `translate(${currentX - 20}px, ${currentY - 20}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    image.addEventListener('mousemove', onMouseMove);
    image.addEventListener('mouseenter', onMouseEnter);
    image.addEventListener('mouseleave', onMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      image.removeEventListener('mousemove', onMouseMove);
      image.removeEventListener('mouseenter', onMouseEnter);
      image.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [hasCrosshair]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hasParallax || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * -20, y: y * -20 });
  };

  return (
    <div
      ref={cardRef}
      className="card-surface card-surface-hover overflow-hidden"
      data-cursor-hover
    >
      {/* Image Area */}
      <div
        ref={imageRef}
        className="relative h-60 overflow-hidden"
        style={{
          background: gradient,
          cursor: hasCrosshair ? 'none' : 'default',
        }}
        onMouseMove={handleMouseMove}
      >
        {overlayPattern && (
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: overlayPattern, backgroundSize: '20px 20px' }}
          />
        )}
        {hasParallax && (
          <div
            className="absolute inset-[-20px] transition-transform duration-300 ease-out"
            style={{
              background: gradient,
              transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            }}
          />
        )}

        {/* Crosshair cursor */}
        {hasCrosshair && (
          <div
            ref={crosshairRef}
            className="absolute top-0 left-0 w-10 h-10 pointer-events-none opacity-0 transition-opacity duration-200 z-10"
          >
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-text-white" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-text-white" />
            <div className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-text-white -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <h4 className="font-archivo font-semibold text-2xl text-text-white tracking-[-0.02em]">{title}</h4>
        <p className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-muted-grey mt-1">{year}</p>
        <p className="text-muted-grey text-sm mt-3 leading-relaxed">{description}</p>
        <p className="font-archivo font-semibold text-xl text-amber mt-4">{metric}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const awards = [
  { num: '01', year: '2024', credential: 'Databricks Platform Architect Certification', context: 'Enterprise-scale Unity Catalog implementation' },
  { num: '02', year: '2024', credential: 'FinOps Certified Practitioner', context: 'Multi-cloud cost optimization at PB scale' },
  { num: '03', year: '2023', credential: 'AWS Solutions Architect — Professional', context: 'Large-scale migration and landing zone design' },
  { num: '04', year: '2023', credential: 'Azure Architect Technologies', context: 'Hybrid cloud and regulatory compliance' },
  { num: '05', year: '2022', credential: 'Certified Kubernetes Administrator', context: 'Container orchestration for AI workloads' },
  { num: '06', year: '2022', credential: 'Google Cloud Professional Architect', context: 'Multi-cloud strategy and data platform' },
  { num: '07', year: '2021', credential: 'TOGAF 9.2 Certified', context: 'Enterprise architecture framework' },
];

export function ImpactSection() {
  const tableRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!tableRef.current) return;
    const rows = tableRef.current.querySelectorAll('.award-row');
    gsap.from(rows, {
      opacity: 0,
      stagger: 0.05,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: tableRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: tableRef });

  return (
    <section id="impact" className="w-full py-[12vw] px-6 md:px-10">
      <div className="content-container">
        {/* Header */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-12">
          <h2 className="section-headline">Impact</h2>
          <p className="section-label mt-2 md:mt-0">( PROJECTS & RECOGNITION )</p>
        </ScrollReveal>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProjectCard
            title="Cloud Cost Transformation"
            year="2023-2024"
            description="Architected a multi-cloud FinOps program that reduced annual run-rate by 36.8% through reserved capacity optimization, automated governance policies, and real-time cost attribution dashboards."
            metric="36.8% reduction"
            tags={['#FinOps', '#MultiCloud', '#Enterprise']}
            gradient="linear-gradient(135deg, #1A1A1A, #2A2A2A)"
            hasCrosshair={true}
            delay={0}
          />
          <ProjectCard
            title="AI Voice Platform"
            year="2024"
            description="Designed and deployed a production-grade agentic AI voice bot handling customer interactions with sub-200ms API latency. Integrated with enterprise CRM and compliance audit trails."
            metric="<200ms latency"
            tags={['#AgenticAI', '#Voice', '#Production']}
            gradient="linear-gradient(135deg, #1A1A1A, #252525)"
            overlayPattern="linear-gradient(rgba(58,58,58,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(58,58,58,0.3) 1px, transparent 1px)"
            hasParallax={true}
            delay={0.2}
          />
          <ProjectCard
            title="Data Estate Governance"
            year="2022-2024"
            description="Implemented Databricks Unity Catalog across a 2.5 PB multi-cloud data estate, governing 9,000+ tables with automated lineage tracking, access control, and regulatory compliance frameworks."
            metric="9,000+ tables"
            tags={['#Databricks', '#Governance', '#Data']}
            gradient="linear-gradient(135deg, #1A1A1A, #252520)"
            overlayPattern="radial-gradient(circle, rgba(58,58,58,0.5) 1px, transparent 1px)"
            hasParallax={true}
            delay={0.4}
          />
        </div>

        {/* Awards Table */}
        <div ref={tableRef} className="mt-32">
          <ScrollReveal>
            <p className="section-label mb-6">( CERTIFICATIONS & CREDENTIALS )</p>
          </ScrollReveal>
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-industrial-grey">
                  <th className="section-label text-left py-3 pr-4 w-12">#</th>
                  <th className="section-label text-left py-3 pr-4 w-20">YEAR</th>
                  <th className="section-label text-left py-3 pr-4">CREDENTIAL</th>
                  <th className="section-label text-left py-3">CONTEXT</th>
                </tr>
              </thead>
              <tbody>
                {awards.map((award) => (
                  <tr
                    key={award.num}
                    className="award-row border-b border-industrial-grey/30 transition-colors duration-300 hover:bg-offblack group"
                  >
                    <td className="py-4 pr-4 text-text-white font-mono text-sm">{award.num}</td>
                    <td className="py-4 pr-4 text-muted-grey font-mono text-sm">{award.year}</td>
                    <td className="py-4 pr-4 text-text-white font-archivo font-semibold group-hover:text-amber transition-colors duration-300">
                      {award.credential}
                    </td>
                    <td className="py-4 text-muted-grey text-sm">{award.context}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
