import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MarqueeBand } from '@/components/MarqueeBand';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface MetricCardProps {
  number: string;
  suffix: string;
  label: string;
  description: string;
  tag: string;
  marginTop: string;
  delay: number;
}

function MetricCard({ number, suffix, label, description, tag, marginTop, delay }: MetricCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const suffixRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion || !cardRef.current || !numberRef.current) return;

    // Card entrance
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

    // Number counter
    const targetValue = parseFloat(number);
    const counter = { value: 0 };

    gsap.to(counter, {
      value: targetValue,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        if (numberRef.current) {
          if (number.includes('.')) {
            numberRef.current.textContent = counter.value.toFixed(1);
          } else {
            numberRef.current.textContent = Math.round(counter.value).toString();
          }
        }
      },
      onComplete: () => {
        if (suffixRef.current) {
          gsap.fromTo(suffixRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        }
      },
    });
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className="card-surface card-surface-hover p-6 md:p-8"
      style={{ marginTop }}
      data-cursor-hover
    >
      <div className="flex items-baseline gap-1">
        <span ref={numberRef} className="font-archivo font-extrabold text-[4.5rem] leading-[0.9] tracking-[-0.02em] text-text-white">
          {prefersReducedMotion ? number : '0'}
        </span>
        <span ref={suffixRef} className="font-archivo font-extrabold text-2xl text-amber" style={{ opacity: prefersReducedMotion ? 1 : 0 }}>
          {suffix}
        </span>
      </div>
      <p className="section-label mt-3">{label}</p>
      <p className="text-muted-grey text-sm mt-3 max-w-[30ch] leading-relaxed">{description}</p>
      <span className="tag-pill mt-4 inline-block">{tag}</span>
    </div>
  );
}

export function MetricsSection() {
  return (
    <section id="metrics" className="w-full py-[12vw] px-6 md:px-10">
      <div className="content-container">
        <ScrollReveal>
          <p className="section-label mb-4">( IMPACT AT SCALE )</p>
          <h2 className="section-headline mb-12">
            Numbers That<br />Define the Work
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            number="36.8"
            suffix="%"
            label="RUN-RATE COST REDUCTION"
            description="Delivered through FinOps governance and architectural optimization across multi-cloud estates."
            tag="#CloudEconomics"
            marginTop="0px"
            delay={0}
          />
          <MetricCard
            number="2.5"
            suffix="PB"
            label="DATA ESTATE GOVERNED"
            description="Multi-cloud data platform spanning Databricks Unity Catalog with 9,000+ managed tables."
            tag="#DataGovernance"
            marginTop="40px"
            delay={0.15}
          />
          <MetricCard
            number="200"
            suffix="ms"
            label="VOICE API LATENCY"
            description="Production-grade agentic AI voice bot with sub-200ms response APIs at enterprise scale."
            tag="#AgenticAI"
            marginTop="80px"
            delay={0.3}
          />
          <MetricCard
            number="9000"
            suffix="+"
            label="UNITY CATALOG TABLES"
            description="Databricks Unity Catalog implementation managing enterprise data lineage and access control."
            tag="#Databricks"
            marginTop="120px"
            delay={0.45}
          />
        </div>

        <div className="mt-24">
          <MarqueeBand
            content="SINGAPORE \u2022 DUBAI \u2022 CANADA \u2022 POLAND \u2022"
            direction="ltr"
            speed={20}
          />
        </div>
      </div>
    </section>
  );
}
