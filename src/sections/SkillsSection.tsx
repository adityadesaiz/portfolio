import { useState } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';

interface SkillCardData {
  num: string;
  title: string;
  description: string;
  tags: string[];
  hoverType: 'slide' | 'bloom' | 'border' | 'shift';
  overlay?: string;
  hiddenContent?: string;
}

const skills: SkillCardData[] = [
  {
    num: '01',
    title: 'FinOps & Cloud Economics',
    description: 'Run-rate optimization, reserved instance strategy, and cloud cost governance at enterprise scale.',
    tags: ['#CostOptimization', '#FinOps'],
    hoverType: 'slide',
    overlay: 'Tools: CloudHealth, Kubecost, AWS Cost Explorer, Azure Cost Management + custom dashboards.',
  },
  {
    num: '02',
    title: 'Agentic AI & Voice Systems',
    description: 'Production LLM deployments, voice bot architectures with sub-200ms latency, and autonomous agent frameworks.',
    tags: ['#LLMOps', '#VoiceAI'],
    hoverType: 'bloom',
  },
  {
    num: '03',
    title: 'Cloud Architecture',
    description: 'Multi-cloud design patterns, landing zones, and enterprise-scale infrastructure.',
    tags: ['#AWS', '#Azure'],
    hoverType: 'border',
  },
  {
    num: '04',
    title: 'Data Governance',
    description: 'Unity Catalog, data lineage, access control, and compliance frameworks for PB-scale estates.',
    tags: ['#Databricks', '#Governance'],
    hoverType: 'shift',
    hiddenContent: 'Key metric: 9,000+ tables governed',
  },
  {
    num: '05',
    title: 'Multi-Cloud Strategy',
    description: 'AWS, Azure, and GCP orchestration with vendor-agnostic architecture patterns.',
    tags: ['#MultiCloud', '#Strategy'],
    hoverType: 'border',
  },
  {
    num: '06',
    title: 'Regulatory Compliance',
    description: 'RBI, DPDP, PCI-DSS frameworks for banking and NBFC entities across jurisdictions.',
    tags: ['#Compliance', '#Banking'],
    hoverType: 'shift',
    hiddenContent: 'Regulated: Banking, NBFC, FinTech',
  },
  {
    num: '07',
    title: 'Cost Engineering',
    description: 'Structural cost reduction through architectural decisions — 36.8% run-rate reduction delivered via reserved capacity planning, workload right-sizing, and governance automation.',
    tags: ['#Savings', '#ROI'],
    hoverType: 'slide',
    overlay: 'Approach: Tagging strategy, showback models, reserved capacity planning, auto-shutdown policies.',
  },
  {
    num: '08',
    title: 'Technical Leadership',
    description: 'Leading architecture teams, stakeholder alignment, and C-suite technical communication for global initiatives.',
    tags: ['#Leadership', '#DVP'],
    hoverType: 'bloom',
  },
];

function SkillCard({ skill }: { skill: SkillCardData }) {
  const [isHovered, setIsHovered] = useState(false);

  const hoverEffects = {
    slide: (
      <div
        className="absolute inset-0 bg-midnight/95 p-6 md:p-8 flex items-center justify-center transition-transform duration-400"
        style={{
          transform: isHovered ? 'translateX(0)' : 'translateX(100%)',
          transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)',
        }}
      >
        <p className="text-text-white text-center text-sm leading-relaxed">{skill.overlay}</p>
      </div>
    ),
    bloom: (
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-400 rounded"
        style={{
          boxShadow: isHovered ? '0 0 30px rgba(212,168,83,0.3)' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)',
        }}
      />
    ),
    border: (
      <div
        className="absolute top-0 left-0 right-0 bg-amber transition-all duration-300 rounded-t"
        style={{
          height: isHovered ? '3px' : '0px',
        }}
      />
    ),
    shift: (
      <div
        className="absolute bottom-6 left-6 right-6 transition-all duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        <p className="text-amber text-sm font-archivo font-semibold">{skill.hiddenContent}</p>
      </div>
    ),
  };

  return (
    <div
      className="card-surface card-surface-hover p-6 md:p-8 relative overflow-hidden min-h-[240px] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor-hover
    >
      {skill.hoverType === 'border' && hoverEffects.border}
      {skill.hoverType === 'bloom' && hoverEffects.bloom}
      {skill.hoverType === 'slide' && hoverEffects.slide}

      <span
        className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-amber mb-3 transition-transform duration-400"
        style={{
          transform: skill.hoverType === 'bloom' && isHovered ? 'scale(1.5)' : 'scale(1)',
          display: 'inline-block',
        }}
      >
        {skill.num}
      </span>

      <h4 className="font-archivo font-semibold text-2xl text-text-white tracking-[-0.02em] mb-3">
        {skill.title}
      </h4>

      <p
        className="text-muted-grey text-sm leading-relaxed transition-transform duration-300 flex-1"
        style={{
          transform: skill.hoverType === 'shift' && isHovered ? 'translateY(-10px)' : 'translateY(0)',
        }}
      >
        {skill.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {skill.tags.map((tag) => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>

      {skill.hoverType === 'shift' && hoverEffects.shift}
    </div>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="w-full py-[12vw] px-6 md:px-10">
      <div className="content-container">
        <ScrollReveal>
          <p className="section-label mb-4">( CORE COMPETENCIES )</p>
          <h2 className="section-headline mb-4">What I Build</h2>
          <p className="text-muted-grey mb-12 max-w-[40ch]">
            Eight domains where architecture meets execution.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto">
          {/* Row 1 - Cards 1 & 2 (span 2 cols each) */}
          <div className="md:col-span-2">
            <SkillCard skill={skills[0]} />
          </div>
          <div className="md:col-span-2">
            <SkillCard skill={skills[1]} />
          </div>

          {/* Row 2 - Cards 3, 4, 5, 6 (1 col each) */}
          <div className="md:col-span-1">
            <SkillCard skill={skills[2]} />
          </div>
          <div className="md:col-span-1">
            <SkillCard skill={skills[3]} />
          </div>
          <div className="md:col-span-1">
            <SkillCard skill={skills[4]} />
          </div>
          <div className="md:col-span-1">
            <SkillCard skill={skills[5]} />
          </div>

          {/* Row 3 - Cards 7 & 8 (span 2 cols each) */}
          <div className="md:col-span-2">
            <SkillCard skill={skills[6]} />
          </div>
          <div className="md:col-span-2">
            <SkillCard skill={skills[7]} />
          </div>
        </div>
      </div>
    </section>
  );
}
