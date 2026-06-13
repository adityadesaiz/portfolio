import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import * as THREE from 'three';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

function ParticleConstellationCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 55;
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 100);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // Particles
    const positions = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 20;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.01
      ));
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xF2F0E6,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lines between particles
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xD4A853,
      transparent: true,
      opacity: 0.15,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    container.addEventListener('mousemove', onMouseMove);

    const startTime = performance.now();

    const animate = () => {
      const time = (performance.now() - startTime) / 1000;
      const posArray = particleGeometry.attributes.position.array as Float32Array;
      const linePositions: number[] = [];

      // Mouse position in world space (approximate)
      const mouseWorld = new THREE.Vector3(
        mouseRef.current.x * 20,
        mouseRef.current.y * 20,
        0
      );

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;

        // Apply velocity with Perlin-like noise drift
        const noiseX = Math.sin(time * 0.5 + i * 0.1) * 0.005;
        const noiseY = Math.cos(time * 0.3 + i * 0.15) * 0.005;

        velocities[i].x += noiseX;
        velocities[i].y += noiseY;

        // Damping
        velocities[i].multiplyScalar(0.98);

        // Mouse repel
        const px = posArray[idx];
        const py = posArray[idx + 1];
        const pz = posArray[idx + 2];
        const particlePos = new THREE.Vector3(px, py, pz);
        const distToMouse = particlePos.distanceTo(mouseWorld);

        if (distToMouse < 15) {
          const force = (15 - distToMouse) / 15 * 0.08;
          const dir = particlePos.clone().sub(mouseWorld).normalize();
          velocities[i].add(dir.multiplyScalar(force));
        }

        // Update position
        posArray[idx] += velocities[i].x;
        posArray[idx + 1] += velocities[i].y;
        posArray[idx + 2] += velocities[i].z;

        // Soft boundary return
        posArray[idx] += (originalPositions[idx] - posArray[idx]) * 0.002;
        posArray[idx + 1] += (originalPositions[idx + 1] - posArray[idx + 1]) * 0.002;
        posArray[idx + 2] += (originalPositions[idx + 2] - posArray[idx + 2]) * 0.002;

        // Lines to nearby particles
        for (let j = i + 1; j < particleCount; j++) {
          const jdx = j * 3;
          const dx = posArray[idx] - posArray[jdx];
          const dy = posArray[idx + 1] - posArray[jdx + 1];
          const dz = posArray[idx + 2] - posArray[jdx + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 8) {
            linePositions.push(
              posArray[idx], posArray[idx + 1], posArray[idx + 2],
              posArray[jdx], posArray[jdx + 1], posArray[jdx + 2]
            );
          }
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
    />
  );
}

export function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion || !leftRef.current) return;

    gsap.from(leftRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative w-full min-h-screen grid grid-cols-1 md:grid-cols-2"
    >
      {/* Left Column - Particle Canvas */}
      <div ref={leftRef} className="relative min-h-[50vh] md:min-h-full overflow-hidden bg-midnight">
        <ParticleConstellationCanvas />
        {/* Decorative image overlay */}
        <div
          className="absolute top-0 left-0 right-0 h-[60vh] z-[1] pointer-events-none hidden md:block"
          style={{
            backgroundImage: 'url(images/philosophy-top.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          }}
        />
      </div>

      {/* Right Column - Text */}
      <div className="bg-offblack p-8 md:p-16 flex flex-col justify-center">
        <ScrollReveal stagger={0.1}>
          <p className="section-label mb-6">( ENGINEERING PHILOSOPHY )</p>
          <h2 className="section-headline mb-8">
            Depth Over Breadth.<br />Impact Over Activity.
          </h2>
          <p className="text-text-white leading-relaxed max-w-[50ch] mb-6">
            I don&apos;t chase every technology trend. I go deep — architecting systems that move billions in cloud spend, govern petabyte-scale data estates, and deploy production AI that regulators trust.
          </p>
          <p className="text-text-white leading-relaxed max-w-[50ch] mb-8">
            My work sits at the intersection of cost engineering, regulatory compliance, and intelligent automation. Every architecture decision is measured in dollars saved, risks mitigated, and capabilities unlocked.
          </p>
          <a
            href="https://adityadesaiz.github.io/resume/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-archivo font-semibold text-base text-amber link-hover inline-flex items-center gap-2"
            data-cursor-hover
          >
            View Resume <span>&rarr;</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
