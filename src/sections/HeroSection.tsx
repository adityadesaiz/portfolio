import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import * as THREE from 'three';
import { MarqueeBand } from '@/components/MarqueeBand';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Simplex noise implementation for shaders
const simplexNoiseGLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  ${simplexNoiseGLSL}

  float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for(int i = 0; i < 5; i++) {
      if(i >= octaves) break;
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    uv.x *= aspect;

    float time = uTime * 0.15;
    vec3 p = vec3(uv, time);

    // Mouse influence
    vec2 mouseNorm = uMouse;
    mouseNorm.x *= aspect;
    float mouseDist = length(uv - mouseNorm);
    float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * 0.3;

    // Multi-octave noise
    float n1 = fbm(p + vec3(mouseInfluence), 5);
    float n2 = fbm(p * 1.5 + vec3(n1 * 0.5, 0.0, time * 0.1), 5);
    float n3 = fbm(p * 0.8 + vec3(n2 * 0.3, n1 * 0.2, time * 0.05), 4);

    float combined = n1 * 0.4 + n2 * 0.35 + n3 * 0.25;
    combined += mouseInfluence;

    // Very dark color palette with faint amber veins
    vec3 darkBase = vec3(0.035, 0.031, 0.031);
    vec3 amberVein = vec3(0.55, 0.42, 0.18);

    float veinMask = smoothstep(-0.2, 0.6, combined);
    vec3 color = mix(darkBase, amberVein, veinMask * 0.15);

    // Film grain
    float grain = fract(sin(dot(vUv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.03;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function FluidNetworkCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const dpr = isMobile ? 0.5 : Math.min(window.devicePixelRatio, 2);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX / window.innerWidth,
          y: 1.0 - e.touches[0].clientY / window.innerHeight,
        };
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    const startTime = performance.now();
    let lastTime = startTime;

    const animate = () => {
      const now = performance.now();
      const delta = now - lastTime;

      // Frame capping for mobile
      if (isMobile && delta < 33) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      lastTime = now;
      uniforms.uTime.value = (now - startTime) / 1000;
      uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        0.05
      );

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion || !titleRef.current) return;

    // Hero title character reveal
    const chars = titleRef.current.querySelectorAll('.hero-char');
    gsap.from(chars, {
      opacity: 0,
      y: 60,
      duration: 0.06,
      stagger: 0.02,
      ease: 'power3.out',
      delay: 0.3,
    });

    // Marquee fade in
    if (marqueeRef.current) {
      gsap.from(marqueeRef.current, {
        opacity: 0,
        duration: 1,
        delay: 0.5,
      });
    }

    // Profile cards stagger
    if (cardsRef.current) {
      const cards = cardsRef.current.children;
      gsap.from(cards, {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.7,
      });
    }
  }, { scope: sectionRef });

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="hero-char inline-block" style={{ opacity: prefersReducedMotion ? 1 : undefined }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col"
    >
      {/* WebGL Background */}
      <FluidNetworkCanvas />

      {/* Fallback image */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Hero Title */}
      <div
        ref={titleRef}
        className="relative z-[1] flex-1 flex flex-col items-center justify-center pt-24 pb-12"
      >
        <h1 className="hero-headline text-center">
          <span className="block">{splitText('ADITYA')}</span>
          <span className="block md:pl-[10vw]">{splitText('DESAI')}</span>
        </h1>
      </div>

      {/* Marquee Bands */}
      <div ref={marqueeRef} className="relative z-[1] hidden md:block">
        <MarqueeBand
          content="DVP \u2022 CLOUD ARCHITECT \u2022 FINOPS STRATEGIST \u2022 AGENTIC AI BUILDER \u2022"
          direction="ltr"
          speed={30}
        />
        <MarqueeBand
          content="DATABRICKS \u2022 MULTI-CLOUD \u2022 2.5 PB DATA ESTATES \u2022 REGULATORY COMPLIANCE \u2022"
          direction="rtl"
          speed={30}
        />
      </div>

      {/* Profile Cards */}
      <div
        ref={cardsRef}
        className="relative z-[1] content-container py-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Card 1 - Identity */}
        <div className="card-surface card-surface-hover p-6 md:p-8 md:mt-0" data-cursor-hover>
          <p className="section-label text-amber mb-2">IDENTITY</p>
          <h4 className="font-archivo font-semibold text-2xl text-text-white tracking-[-0.02em]">Aditya Desai</h4>
          <p className="text-muted-grey mt-1 text-sm">DVP | Cloud Architecture, FinOps & AI</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="tag-pill">#FinOps</span>
            <span className="tag-pill">#AgenticAI</span>
            <span className="tag-pill">#CloudGovernance</span>
          </div>
        </div>

        {/* Card 2 - Focus */}
        <div className="card-surface card-surface-hover p-6 md:p-8 md:-mt-10" data-cursor-hover>
          <p className="section-label text-amber mb-2">CURRENT FOCUS</p>
          <h4 className="font-archivo font-semibold text-2xl text-text-white tracking-[-0.02em]">Enterprise AI Architecture</h4>
          <p className="text-muted-grey mt-1 text-sm">Designing agentic AI systems with sub-200ms voice API latency at DVP scale.</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="tag-pill">#VoiceAI</span>
            <span className="tag-pill">#LLMOps</span>
            <span className="tag-pill">#Latency</span>
          </div>
        </div>

        {/* Card 3 - Geography */}
        <div className="card-surface card-surface-hover p-6 md:p-8 md:-mt-20" data-cursor-hover>
          <p className="section-label text-amber mb-2">OPERATING REGIONS</p>
          <h4 className="font-archivo font-semibold text-2xl text-text-white tracking-[-0.02em]">Singapore &bull; Dubai &bull; Canada &bull; Poland</h4>
          <p className="text-muted-grey mt-1 text-sm">Target senior architect roles across regulated financial entities.</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="tag-pill">#Global</span>
            <span className="tag-pill">#FinTech</span>
            <span className="tag-pill">#Banking</span>
          </div>
        </div>
      </div>
    </section>
  );
}
