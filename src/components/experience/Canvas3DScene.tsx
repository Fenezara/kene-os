'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Canvas3DSceneProps {
  color?: string;
  speed?: number;
}

export function Canvas3DScene({ color = '#C8951E', speed = 0.005 }: Canvas3DSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 1. Central 3D Luxury Floating Gold Crystal Gem / Emblem
    const geometry = new THREE.IcosahedronGeometry(1.8, 1);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4AF37'),
      metalness: 0.9,
      roughness: 0.1,
      wireframe: false,
      emissive: new THREE.Color('#8A3B14'),
      emissiveIntensity: 0.25,
    });
    const crystalMesh = new THREE.Mesh(geometry, material);
    scene.add(crystalMesh);

    // Wireframe Outer Orb
    const outerGeo = new THREE.IcosahedronGeometry(2.4, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#C8951E'),
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const outerOrb = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerOrb);

    // 2. Gold Particle Constellation / Dust
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color('#F3E5AB'),
      size: 0.05,
      transparent: true,
      opacity: 0.75,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffd700, 3.5, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x2e5a36, 2.5, 50);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // 🌟 INTERACTIVE FINGER & MOUSE DRAG ROTATION FOR 3D GEM
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let mouseX = 0;
    let mouseY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (!isDragging) return;

      const deltaX = e.clientX - previousPointerPosition.x;
      const deltaY = e.clientY - previousPointerPosition.y;

      crystalMesh.rotation.y += deltaX * 0.01;
      crystalMesh.rotation.x += deltaY * 0.01;
      outerOrb.rotation.y -= deltaX * 0.008;

      previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        crystalMesh.rotation.x += speed * 1.5;
        crystalMesh.rotation.y += speed * 2;
        outerOrb.rotation.x -= speed * 0.8;
        outerOrb.rotation.y -= speed * 1.2;
      }

      particles.rotation.y += speed * 0.5;

      // Smooth Camera Reactivity
      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [color, speed]);

  return <div ref={mountRef} className="w-full h-full absolute inset-0 pointer-events-auto cursor-grab active:cursor-grabbing z-0" />;
}
