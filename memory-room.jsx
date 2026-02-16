import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useControls } from 'leva';
import * as THREE from 'three';

// ============================================================================
// DATA STRUCTURE
// ============================================================================
const memories = [
  {
    id: 1,
    position: [-0.3, 0.8, 0.5],
    title: "The Sofa Stories",
    description: "Countless Netflix marathons, deep conversations over cheap beer, and those Sunday afternoon naps. This corner knew all your secrets and never judged.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    color: "#4ECDC4"
  },
  {
    id: 2,
    position: [-2.5, 1.3, 1.2],
    title: "The Cozy Corner Shelf",
    description: "Your collection of treasures: plants that somehow survived your care, candles for those moody evenings, and books that shaped your thoughts. Every item tells a story.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    color: "#FFB347"
  },
  {
    id: 3,
    position: [-1.8, 1.9, -2.8],
    title: "The Photo Wall Memories",
    description: "A gallery of moments frozen in time. Friends, adventures, concerts, and random Tuesday afternoons that somehow became unforgettable. Tokyo awaits new frames.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80",
    color: "#95E1D3"
  },
  {
    id: 4,
    position: [3.3, 1.7, 1.2],
    title: "The Raised Bed Haven",
    description: "Your elevated sanctuary with storage below. Climb those little steps to your personal cloud, where dreams happen above and life happens below - wardrobe, mini fridge, and all your essentials within reach.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    color: "#FF8C42"
  }
];

// ============================================================================
// HOTSPOT COMPONENT
// ============================================================================
function Hotspot({ position, onClick, color, isActive }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.2);
    }
  });

  return (
    <group position={position}>
      <mesh ref={glowRef} onClick={onClick}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 1.5 : 0.8}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      <Html
        position={[0, 0.5, 0]}
        center
        distanceFactor={8}
        style={{
          pointerEvents: 'none',
          transition: 'all 0.3s',
          opacity: isActive ? 1 : 0.7
        }}
      >
        <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium whitespace-nowrap">
          Click to reveal
        </div>
      </Html>
    </group>
  );
}

// ============================================================================
// ROOM COMPONENT - Fixed Configuration with Adjustable Door
// ============================================================================
function Room() {
  const width = 8.5;
  const height = 3.2;
  const depth = 4.0;

  // 只有門的位置可以調整
  const { doorX, doorY, doorZ } = useControls('Main Door Position', {
    doorX: { value: -width / 2 + 0.05, min: -width / 2, max: -width / 2 + 0.2, step: 0.01, label: 'X (wall offset)' },
    doorY: { value: 1, min: 0, max: 2, step: 0.1, label: 'Y (height)' },
    doorZ: { value: -0.5, min: -2, max: 2, step: 0.1, label: 'Z (position)' }
  });

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#D4B896" roughness={0.9} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#F5F3EE" />
      </mesh>
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#F5F3EE" />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#F5F3EE" />
      </mesh>

      {/* Bed - ENLARGED: 2.4m × 2.6m platform */}
      <group position={[3.3, 0.1, 1.2]} rotation={[0, (270 * Math.PI) / 180, 0]}>
        {/* Larger bed platform base */}
        <mesh position={[0, 0.7, 0]} castShadow><boxGeometry args={[2.4, 1.4, 2.6]} /><meshStandardMaterial color="#3D3024" roughness={0.7} /></mesh>
        
        {/* Larger mattress */}
        <mesh position={[0, 1.5, 0]} castShadow><boxGeometry args={[2.3, 0.2, 2.5]} /><meshStandardMaterial color="#D8C8B8" roughness={0.9} /></mesh>

        {/* Larger red blanket */}
        <mesh position={[0, 1.62, 0.2]} castShadow><boxGeometry args={[2.0, 0.05, 1.8]} /><meshStandardMaterial color="#E85D4F" roughness={0.8} /></mesh>

        {/* Pillow at bed head */}
        <mesh position={[0.6, 1.68, -0.9]} castShadow><boxGeometry args={[0.6, 0.15, 0.35]} /><meshStandardMaterial color="#E8DCC8" roughness={0.9} /></mesh>

        {/* Ladder steps */}
        <mesh position={[-1.0, 0.25, 1.1]} castShadow><boxGeometry args={[0.4, 0.5, 0.4]} /><meshStandardMaterial color="#4A3B2F" roughness={0.6} /></mesh>
        <mesh position={[-1.0, 0.7, 1.1]} castShadow><boxGeometry args={[0.4, 0.3, 0.4]} /><meshStandardMaterial color="#4A3B2F" roughness={0.6} /></mesh>
        <mesh position={[-1.0, 1.1, 1.1]} castShadow><boxGeometry args={[0.4, 0.3, 0.4]} /><meshStandardMaterial color="#4A3B2F" roughness={0.6} /></mesh>

        {/* Storage - Wardrobe */}
        <mesh position={[0.6, 0.35, -0.6]} castShadow><boxGeometry args={[1.0, 0.7, 1.2]} /><meshStandardMaterial color="#5D4E37" roughness={0.7} /></mesh>

        {/* Mini fridge */}
        <mesh position={[-0.6, 0.3, -0.6]} castShadow><boxGeometry args={[0.5, 0.6, 0.5]} /><meshStandardMaterial color="#E8E8E8" metalness={0.3} roughness={0.5} /></mesh>
        <mesh position={[-0.4, 0.35, -0.36]} castShadow><boxGeometry args={[0.05, 0.15, 0.02]} /><meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} /></mesh>

        {/* Hanging clothes bar */}
        <mesh position={[0.6, 0.8, 0.6]} castShadow><cylinderGeometry args={[0.02, 0.02, 0.7]} /><meshStandardMaterial color="#A0826D" metalness={0.6} roughness={0.3} /></mesh>

        {/* Clothes hangers */}
        {[0, 0.2, -0.2].map((o, i) => <mesh key={i} position={[0.6, 0.8, 0.6 + o]} castShadow><boxGeometry args={[0.15, 0.02, 0.02]} /><meshStandardMaterial color="#6B5B4E" /></mesh>)}

        {/* Shelf above bed */}
        <mesh position={[0.8, 2.1, -1.1]} castShadow><boxGeometry args={[0.7, 0.3, 0.25]} /><meshStandardMaterial color="#E8D4B8" roughness={0.7} /></mesh>

        {/* Decorative items on shelf */}
        <mesh position={[0.6, 2.3, -1.1]} castShadow><cylinderGeometry args={[0.05, 0.06, 0.12]} /><meshStandardMaterial color="#8B7355" /></mesh>
        <mesh position={[0.6, 2.4, -1.1]} castShadow><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#6B8E4E" /></mesh>
        <mesh position={[0.95, 2.3, -1.05]} castShadow><boxGeometry args={[0.12, 0.15, 0.02]} /><meshStandardMaterial color="#3D3024" /></mesh>
        <mesh position={[1.0, 2.35, -1.1]} castShadow><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#FFE4B5" emissive="#FFD700" emissiveIntensity={0.7} /></mesh>
      </group>

      {/* Desk - Position: X=1.6, Y=0.0, Z=1.4, Rotation=270° */}
      <group position={[1.6, 0.0, 1.4]} rotation={[0, (270 * Math.PI) / 180, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[1.2, 0.8, 0.8]} /><meshStandardMaterial color="#4A3B2F" roughness={0.6} /></mesh>
        <mesh position={[0, 0.95, -0.15]} castShadow><boxGeometry args={[0.7, 0.45, 0.05]} /><meshStandardMaterial color="#1a1a1a" emissive="#6BB6FF" emissiveIntensity={0.4} /></mesh>
        <mesh position={[0, 0.7, -0.1]} castShadow><cylinderGeometry args={[0.06, 0.08, 0.12]} /><meshStandardMaterial color="#2a2a2a" /></mesh>
        <mesh position={[0, 0.82, 0.25]} castShadow><boxGeometry args={[0.4, 0.02, 0.14]} /><meshStandardMaterial color="#E8E8E8" roughness={0.4} /></mesh>
        <mesh position={[0.3, 0.82, 0.25]} castShadow><boxGeometry args={[0.06, 0.03, 0.09]} /><meshStandardMaterial color="#2a2a2a" roughness={0.5} /></mesh>
      </group>

      {/* Sofa - Position: X=-0.3, Y=0.0, Z=1.6, Rotation=0° */}
      <group position={[-0.3, 0.0, 1.6]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow><boxGeometry args={[2, 0.5, 0.85]} /><meshStandardMaterial color="#B8B0A0" roughness={0.8} /></mesh>
        <mesh position={[0, 0.55, 0.3]} castShadow><boxGeometry args={[2, 0.6, 0.2]} /><meshStandardMaterial color="#B8B0A0" roughness={0.8} /></mesh>
        <mesh position={[-0.95, 0.45, 0]} castShadow><boxGeometry args={[0.15, 0.5, 0.85]} /><meshStandardMaterial color="#A8A098" roughness={0.8} /></mesh>
        <mesh position={[0.95, 0.45, 0]} castShadow><boxGeometry args={[0.15, 0.5, 0.85]} /><meshStandardMaterial color="#A8A098" roughness={0.8} /></mesh>
      </group>

      {/* Coffee Table - Position: X=-0.3, Y=0.2, Z=0.1, Rotation=0° */}
      <group position={[-0.3, 0.2, 0.1]} rotation={[0, 0, 0]}>
        <mesh castShadow><boxGeometry args={[1.1, 0.44, 0.75]} /><meshStandardMaterial color="#9B7653" roughness={0.5} /></mesh>
        <mesh position={[-0.2, 0.24, 0]} castShadow><cylinderGeometry args={[0.06, 0.06, 0.15]} /><meshStandardMaterial color="#E8DCC8" /></mesh>
      </group>

      {/* Rug */}
      <mesh position={[-0.3, 0.01, 0.8]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.5, 1.8]} /><meshStandardMaterial color="#C8B8A8" roughness={0.9} /></mesh>

      {/* Shelf - Position: X=1.0, Y=0.0, Z=1.9, Rotation=0° */}
      <group position={[1.0, 0.0, 1.9]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0.55, 0]} castShadow><boxGeometry args={[0.5, 1.1, 0.4]} /><meshStandardMaterial color="#3D3024" roughness={0.6} /></mesh>
        <mesh position={[-0.1, 1.15, 0]} castShadow><cylinderGeometry args={[0.08, 0.1, 0.12]} /><meshStandardMaterial color="#C8B8A8" /></mesh>
        <mesh position={[-0.1, 1.28, 0]} castShadow><sphereGeometry args={[0.12, 8, 8]} /><meshStandardMaterial color="#6B8E4E" /></mesh>
        <mesh position={[0.12, 1.18, 0.05]} castShadow><boxGeometry args={[0.15, 0.22, 0.08]} /><meshStandardMaterial color="#8B6F47" /></mesh>
      </group>

      {/* Floor Lamp - Position: X=-1.6, Y=-0.1, Z=2.1 */}
      <group position={[-1.6, -0.1, 2.1]}>
        <mesh position={[0, 0.85, 0]} castShadow><cylinderGeometry args={[0.02, 0.02, 1.7]} /><meshStandardMaterial color="#2D2D2D" /></mesh>
        <mesh position={[0, 1.7, 0]} castShadow><coneGeometry args={[0.16, 0.28, 8]} /><meshStandardMaterial color="#2D2D2D" emissive="#FFD700" emissiveIntensity={0.3} /></mesh>
      </group>

      {/* TV - Position: X=0.0, Y=1.5, Rotation=0° */}
      <group position={[0.0, 1.5, -depth / 2 + 0.05]} rotation={[0, 0, 0]}>
        <mesh castShadow><boxGeometry args={[2.2, 1.3, 0.08]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
        <mesh position={[0, 0, 0.04]} castShadow><boxGeometry args={[2.1, 1.2, 0.01]} /><meshStandardMaterial color="#2a2a2a" emissive="#4a4a4a" emissiveIntensity={0.3} /></mesh>
      </group>

      {/* TV Cabinet - Position: X=0.0, Y=0.4, Rotation=0° */}
      <group position={[0.0, 0.4, -depth / 2 + 0.35]} rotation={[0, 0, 0]}>
        <mesh castShadow><boxGeometry args={[2.4, 0.76, 0.5]} /><meshStandardMaterial color="#F8F6F0" roughness={0.3} /></mesh>
        <mesh position={[-0.8, 0.4, 0]} castShadow><boxGeometry args={[0.15, 0.08, 0.12]} /><meshStandardMaterial color="#3D3024" /></mesh>
      </group>

      {/* Photo Frames */}
      {[[-1.8, 1.9], [-1.5, 1.6], [-2, 1.5], [-1.2, 2.1], [-1.6, 2.35]].map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], -depth / 2 + 0.02]} castShadow>
          <boxGeometry args={[0.22, 0.27, 0.02]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#2D2D2D" : "#F5F3EE"} />
        </mesh>
      ))}

      {/* Art */}
      <mesh position={[-width / 2 + 0.02, 1.5, -0.6]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.75, 0.85, 0.02]} />
        <meshStandardMaterial color="#4A6B3A" emissive="#6B8E4E" emissiveIntensity={0.2} />
      </mesh>

      {/* Main entrance door (left wall) - NOW ADJUSTABLE */}
      <mesh position={[doorX, doorY, doorZ]} rotation={[0, Math.PI / 2, 0]} castShadow><boxGeometry args={[0.9, 2, 0.05]} /><meshStandardMaterial color="#E8DCC8" /></mesh>
      <mesh position={[doorX + 0.03, doorY, doorZ - 0.4]} rotation={[0, Math.PI / 2, 0]} castShadow><cylinderGeometry args={[0.03, 0.03, 0.1]} /><meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} /></mesh>
      
      {/* Bathroom door (back wall) */}
      <mesh position={[-2.3, 1, -depth / 2 + 0.05]} castShadow><boxGeometry args={[0.75, 2, 0.05]} /><meshStandardMaterial color="#E8DCC8" /></mesh>
      <mesh position={[-2, 1, -depth / 2 + 0.08]} castShadow><cylinderGeometry args={[0.03, 0.03, 0.1]} rotation={[0, 0, Math.PI / 2]} /><meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} /></mesh>

      {/* Ceiling Lamp */}
      <mesh position={[-0.3, 2.9, 0.3]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#F5EFE0" emissive="#FFE4B5" emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ============================================================================
// EXPERIENCE COMPONENT
// ============================================================================
function Experience({ onHotspotClick, activeMemoryId }) {
  return (
    <>
      <ambientLight intensity={0.2} color="#FFF0DB" />
      <directionalLight
        position={[4.0, 8.0, 3.0]}
        intensity={0.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#FFE0B2"
      />
      <pointLight position={[-2.2, 1.7, 0.2]} intensity={0.8} color="#FFD54F" distance={4} />
      <pointLight position={[2, 2.3, 1.8]} intensity={0.6} color="#FFECB3" distance={3.5} />
      <pointLight position={[-0.3, 0.6, 0.5]} intensity={0.4} color="#FFF3E0" distance={3} />
      <pointLight position={[-0.3, 2.9, 0.3]} intensity={0.7} color="#FFE4B5" distance={5} />
      <Room />
      {memories.map((memory) => (
        <Hotspot
          key={memory.id}
          position={memory.position}
          color={memory.color}
          onClick={() => onHotspotClick(memory)}
          isActive={activeMemoryId === memory.id}
        />
      ))}
    </>
  );
}

// ============================================================================
// MEMORY CARD COMPONENT
// ============================================================================
function MemoryCard({ memory, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative max-w-2xl w-full bg-gradient-to-br from-[#2C2416] to-[#1A1410] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ border: `2px solid ${memory.color}20` }}
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: memory.color }} />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all group"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="relative h-64 overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            src={memory.image}
            alt={memory.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] via-transparent" />
        </div>
        <div className="p-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: memory.color }} />
              <h2 className="text-3xl font-bold text-[#F5E6D3]" style={{ fontFamily: 'Georgia, serif' }}>{memory.title}</h2>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-[#C9B8A3] leading-relaxed text-lg"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {memory.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-6 flex items-center gap-2 text-sm text-[#8B7355]"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
            <span>Memory from Taipei, Taiwan</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function App() {
  const [activeMemory, setActiveMemory] = useState(null);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#1A1410] via-[#2C2416] to-[#1A1410]">
      
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-[#F5E6D3] mb-2" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.02em' }}>
            台北小窩 Memory Room
          </h1>
          <p className="text-[#A89378] text-sm tracking-wider uppercase">
            From your Taipei studio to Tokyo adventures
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full text-[#C9B8A3] text-sm"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span>Click glowing orbs to reveal memories · Drag to explore</span>
        </div>
      </motion.div>

      <Canvas shadows={false} dpr={[1, 1]} gl={{ antialias: false }}>
        <PerspectiveCamera
          makeDefault
          position={[7.0, 6.5, 9.5]}
          fov={38}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={5}
          maxDistance={20}
          target={[0, 1, 0]}
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
        <Experience onHotspotClick={setActiveMemory} activeMemoryId={activeMemory?.id} />
        <fog attach="fog" args={['#1A1410', 10, 25]} />
      </Canvas>

      <AnimatePresence>
        {activeMemory && <MemoryCard memory={activeMemory} onClose={() => setActiveMemory(null)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-6 z-10"
      >
        <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg">
          <div className="text-[#A89378] text-xs uppercase tracking-wider mb-1">Memories</div>
          <div className="text-[#F5E6D3] text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{memories.length}</div>
        </div>
      </motion.div>
    </div>
  );
}
