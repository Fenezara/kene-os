'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { usePathname } from 'next/navigation'
import * as THREE from 'three'

interface KeneSphereProps {
  pathname: string
  scrollProgress: number
}

function KeneSphere({ pathname, scrollProgress }: KeneSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  // Target states to lerp towards
  const targets = useMemo(() => {
    let position: [number, number, number] = [0, 0.4, 0]
    let scale = 1.6
    let color = new THREE.Color('#C8951E') // Gold Kene
    let wireframe = false
    let roughness = 0.15
    let metalness = 0.9

    if (pathname === '/diagnostic') {
      position = [0, 0, 0.5]
      scale = 2.0
      color = new THREE.Color('#22D3EE') // High-tech Cyan Laser
      wireframe = true
      roughness = 0.5
      metalness = 0.1
    } else if (pathname === '/jardin') {
      position = [0, -0.6, -0.5]
      scale = 1.3
      color = new THREE.Color('#10B981') // Moringa Green
      wireframe = false
      roughness = 0.4
      metalness = 0.4
    } else if (pathname === '/wallet') {
      position = [0, 0.5, 0.3]
      scale = 1.5
      color = new THREE.Color('#F59E0B') // Amber Gold Coin
      wireframe = false
      roughness = 0.1
      metalness = 1.0
    } else if (pathname.includes('/diagnostic/results')) {
      // Morph dynamically based on scroll progression
      // Scroll down zooms in on the skin layers
      const yPos = 1.0 - scrollProgress * 1.8
      const zPos = -0.5 + scrollProgress * 1.5
      position = [0, yPos, zPos]
      scale = 1.4 + scrollProgress * 0.8
      
      // Interpolate from deep gold to a glowing light copper
      color = new THREE.Color().lerpColors(
        new THREE.Color('#C8951E'),
        new THREE.Color('#F8F1E4'),
        scrollProgress
      )
      wireframe = scrollProgress > 0.85 // turns into wireframe cell grid at the very end
      roughness = 0.15 + scrollProgress * 0.3
      metalness = 0.9 - scrollProgress * 0.4
    }

    return { position, scale, color, wireframe, roughness, metalness }
  }, [pathname, scrollProgress])

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const mesh = meshRef.current
      const mat = materialRef.current

      // 1. Continuous organic rotation
      const time = state.clock.getElapsedTime()
      if (pathname === '/diagnostic') {
        // Fast rotation for scanning effect
        mesh.rotation.y = time * 0.6
        mesh.rotation.x = time * 0.3
      } else if (pathname === '/wallet') {
        // Coin spin
        mesh.rotation.y = time * 0.4
        mesh.rotation.x = 0
      } else {
        mesh.rotation.y = time * 0.12
        mesh.rotation.x = Math.sin(time * 0.08) * 0.08
      }

      // 2. Add organic breathing size fluctuation
      const breathing = Math.sin(time * 1.5) * 0.04
      const targetScale = targets.scale + breathing

      // 3. Smooth lerping for position, scale, color, roughness, metalness
      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targets.position[0], 0.08)
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targets.position[1], 0.08)
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targets.position[2], 0.08)

      mesh.scale.x = THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.08)
      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, targetScale, 0.08)
      mesh.scale.z = THREE.MathUtils.lerp(mesh.scale.z, targetScale, 0.08)

      mat.color.lerp(targets.color, 0.08)
      mat.roughness = THREE.MathUtils.lerp(mat.roughness, targets.roughness, 0.08)
      mat.metalness = THREE.MathUtils.lerp(mat.metalness, targets.metalness, 0.08)
      
      // Instantly set wireframe state for responsiveness
      mat.wireframe = targets.wireframe
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0.4, 0]} scale={1.6}>
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#C8951E"
        metalness={0.9}
        roughness={0.15}
        wireframe={false}
      />
    </mesh>
  )
}

function OrbitingParticles({ pathname }: { pathname: string }) {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 200

  // Generate random positions on a sphere shell
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 2.2 + Math.random() * 0.8 // orbit radius

      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      const speed = pathname === '/diagnostic' ? 0.25 : 0.08
      pointsRef.current.rotation.y = -state.clock.getElapsedTime() * speed
    }
  })

  // Disable orbiting dust in scanning mode for focus
  if (pathname === '/diagnostic') return null

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#F8F1E4" // Creme Karite
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  )
}

export default function Canvas3D() {
  const pathname = usePathname()
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const container = document.getElementById('kene-scroll-container')
    if (!container) return

    const handleScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight
      if (maxScroll <= 0) {
        setScrollProgress(0)
        return
      }
      setScrollProgress(container.scrollTop / maxScroll)
    }

    // Initialize
    handleScroll()

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [pathname])

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 w-full h-full overflow-hidden bg-gradient-to-b from-[#1A1410] to-[#0F0A05] transition-colors duration-500">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#F8F1E4" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#A0522D" />
        <directionalLight position={[0, 5, 2]} intensity={1.2} color="#FFD700" />
        
        <KeneSphere pathname={pathname || '/'} scrollProgress={scrollProgress} />
        <OrbitingParticles pathname={pathname || '/'} />
      </Canvas>
    </div>
  )
}
