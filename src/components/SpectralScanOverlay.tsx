'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Sparkles, Zap, Shield, Eye, RefreshCw } from 'lucide-react';

// ── TYPES ──
type BodyZone = 'visage' | 'cou' | 'decollete' | 'bras' | 'mains' | 'dos' | 'jambes' | 'pieds' | 'cuir_chevelu' | 'corps_entier';

interface HotspotDetail {
  id: string;
  title: string;
  type: 'pih' | 'hydration' | 'sebum' | 'barrier' | 'collagen' | 'elasticity' | 'keratosis' | 'eczema' | 'acne' | 'stretch_marks';
  depth: string;
  metric: string;
  status: 'critical' | 'warning' | 'optimal';
  zone: string;
  xPercent: number;
  yPercent: number;
  description: string;
  recommendedBotanical: string;
}

interface SpectralScanOverlayProps {
  imageSrc?: string;
  photos?: string[];
  clientName?: string;
  hydrationScore?: number;
  pihDepth?: string;
  phototype?: string;
  showControls?: boolean;
  bodyZone?: BodyZone;
}

// ── BODY ZONE DEFINITIONS ──
const BODY_ZONES: { id: BodyZone; label: string; icon: string }[] = [
  { id: 'visage', label: 'Visage', icon: '👤' },
  { id: 'cou', label: 'Cou & Nuque', icon: '🦒' },
  { id: 'decollete', label: 'Décolleté & Poitrine', icon: '👗' },
  { id: 'bras', label: 'Bras & Avant-Bras', icon: '💪' },
  { id: 'mains', label: 'Mains & Ongles', icon: '🤲' },
  { id: 'dos', label: 'Dos', icon: '🔙' },
  { id: 'jambes', label: 'Jambes & Cuisses', icon: '🦵' },
  { id: 'pieds', label: 'Pieds & Talons', icon: '🦶' },
  { id: 'cuir_chevelu', label: 'Cuir Chevelu', icon: '💇' },
  { id: 'corps_entier', label: 'Corps Entier', icon: '🧍' },
];

// ── HOTSPOTS PAR ZONE CORPORELLE ──
const HOTSPOTS_BY_ZONE: Record<BodyZone, HotspotDetail[]> = {
  visage: [
    {
      id: 'pih-cheek', title: 'Hyperpigmentation PIH', type: 'pih',
      depth: '0.2mm (Épidermique)', metric: 'Indice Mélanine 68', status: 'warning',
      zone: 'Pommette Droite 🔴', xPercent: 24, yPercent: 32,
      description: 'Accumulation mélanique post-inflammatoire sous-cutanée. Risque d\'obscurcissement au soleil.',
      recommendedBotanical: 'Sérum Hibiscus & Niacinamide 5%',
    },
    {
      id: 'tewl-front', title: 'Perte Transepidermique (TEWL)', type: 'hydration',
      depth: '0.05mm (Stratum Corneum)', metric: '14.2 g/m²/h', status: 'critical',
      zone: 'Front & Zone T 🟡', xPercent: 48, yPercent: 18,
      description: 'Évaporation hydrique accélérée du film hydrolipidique.',
      recommendedBotanical: 'Beurre de Karité Brut (45%) & Huile de Baobab (30%)',
    },
    {
      id: 'sebum-nose', title: 'Sécrétion Séborrhique', type: 'sebum',
      depth: '1.2mm (Glande Sébacée)', metric: 'Indice Sébum 74%', status: 'warning',
      zone: 'Aile du Nez 🟠', xPercent: 52, yPercent: 44,
      description: 'Hyper-activité sébacée avec pores dilatés et risque de comédons.',
      recommendedBotanical: 'Extrait Neem & Moringa (Matifiant)',
    },
    {
      id: 'acne-chin', title: 'Zone Acnéique Hormonale', type: 'acne',
      depth: '0.8mm (Follicule)', metric: 'Grade II Rétentionnel', status: 'critical',
      zone: 'Menton & Mandibule 🔴', xPercent: 48, yPercent: 72,
      description: 'Micro-comédons rétentionnels liés à un déséquilibre hormonal. Risque de cicatrices PIH.',
      recommendedBotanical: 'Extrait de Papaye Fermentée & Arbre à Thé 2%',
    },
  ],
  cou: [
    {
      id: 'pih-cou', title: 'Hyperpigmentation Cervicale', type: 'pih',
      depth: '0.3mm', metric: 'Indice Mélanine 72', status: 'warning',
      zone: 'Face Latérale du Cou 🟠', xPercent: 35, yPercent: 40,
      description: 'Dépôts mélaniques diffus accentués par le frottement des vêtements et l\'exposition solaire.',
      recommendedBotanical: 'Acide Kojique Naturel & Extrait de Réglisse',
    },
    {
      id: 'elasticity-cou', title: 'Perte d\'Élasticité Cutanée', type: 'elasticity',
      depth: '1.5mm (Derme)', metric: 'Élasticité 62%', status: 'critical',
      zone: 'Face Antérieure du Cou 🔴', xPercent: 50, yPercent: 55,
      description: 'Relâchement cutané précoce dû à la perte de collagène et d\'élastine.',
      recommendedBotanical: 'Huile de Marula & Peptides de Collagène Marin',
    },
  ],
  decollete: [
    {
      id: 'pih-decollete', title: 'Taches Solaires Décolleté', type: 'pih',
      depth: '0.4mm', metric: 'Indice Mélanine 75', status: 'warning',
      zone: 'Haut du Décolleté 🟠', xPercent: 45, yPercent: 30,
      description: 'Photo-dommages cumulatifs avec lentigos solaires sur zone exposée en permanence.',
      recommendedBotanical: 'Vitamine C Stabilisée & Extrait de Bissap',
    },
    {
      id: 'hydration-decollete', title: 'Déshydratation Thoracique', type: 'hydration',
      depth: '0.1mm', metric: 'TEWL 18.5 g/m²/h', status: 'critical',
      zone: 'Sternum & Poitrine 🔴', xPercent: 50, yPercent: 55,
      description: 'Zone de peau fine avec film hydrolipidique insuffisant.',
      recommendedBotanical: 'Beurre de Cacao & Huile de Coco Vierge',
    },
  ],
  bras: [
    {
      id: 'keratosis-bras', title: 'Kératose Pilaire', type: 'keratosis',
      depth: '0.5mm (Follicule)', metric: 'Densité 42 lésions/cm²', status: 'warning',
      zone: 'Face Post. Bras 🟠', xPercent: 40, yPercent: 35,
      description: 'Accumulation de kératine autour des follicules pileux créant des micro-boutons rugueux.',
      recommendedBotanical: 'AHA Naturel de Papaye & Huile de Coco Fractionnée',
    },
    {
      id: 'pih-bras', title: 'Hyperpigmentation de Frottement', type: 'pih',
      depth: '0.3mm', metric: 'Indice Mélanine 70', status: 'warning',
      zone: 'Plis du Coude 🟡', xPercent: 55, yPercent: 58,
      description: 'Assombrissement mécanique par frottement répétitif au niveau des plis articulaires.',
      recommendedBotanical: 'Acide Glycolique Naturel & Beurre de Karité',
    },
  ],
  mains: [
    {
      id: 'dryness-mains', title: 'Xérose des Mains', type: 'hydration',
      depth: '0.08mm', metric: 'TEWL 22.1 g/m²/h', status: 'critical',
      zone: 'Dos des Mains 🔴', xPercent: 45, yPercent: 35,
      description: 'Sécheresse extrême avec micro-fissures dues aux lavages fréquents et détergents.',
      recommendedBotanical: 'Beurre de Karité Concentré & Glycérine Végétale',
    },
    {
      id: 'pih-mains', title: 'Taches Séniles Prématurées', type: 'pih',
      depth: '0.4mm', metric: 'Indice Mélanine 78', status: 'warning',
      zone: 'Articulations des Doigts 🟠', xPercent: 52, yPercent: 60,
      description: 'Lentigos solaires liés à une photo-exposition chronique non protégée.',
      recommendedBotanical: 'Sérum Éclaircissant Bissap & Vitamine C',
    },
  ],
  dos: [
    {
      id: 'acne-dos', title: 'Acné Dorsale (Bacne)', type: 'acne',
      depth: '1.5mm (Follicule Profond)', metric: 'Grade III Inflammatoire', status: 'critical',
      zone: 'Haut du Dos & Épaules 🔴', xPercent: 45, yPercent: 28,
      description: 'Folliculite inflammatoire profonde liée à la transpiration et aux textiles synthétiques.',
      recommendedBotanical: 'Savon Noir Africain & Huile d\'Arbre à Thé 3%',
    },
    {
      id: 'pih-dos', title: 'Cicatrices Pigmentées Post-Acné', type: 'pih',
      depth: '0.6mm', metric: 'Indice Mélanine 82', status: 'warning',
      zone: 'Zone Interscapulaire 🟠', xPercent: 50, yPercent: 52,
      description: 'Résidus inflammatoires pigmentés laissés par des lésions acnéiques profondes.',
      recommendedBotanical: 'AHA de Fruit de la Passion & Acide Azélaïque Naturel',
    },
  ],
  jambes: [
    {
      id: 'stretch-jambes', title: 'Vergetures (Striae Distensae)', type: 'stretch_marks',
      depth: '2.0mm (Derme Profond)', metric: 'Largeur 3mm × 8cm', status: 'warning',
      zone: 'Intérieur des Cuisses 🟠', xPercent: 42, yPercent: 30,
      description: 'Rupture des fibres de collagène et d\'élastine due à une distension rapide de la peau.',
      recommendedBotanical: 'Huile de Rose Musquée & Centella Asiatica',
    },
    {
      id: 'keratosis-jambes', title: 'Kératose & Folliculite', type: 'keratosis',
      depth: '0.4mm', metric: 'Densité 38 lésions/cm²', status: 'warning',
      zone: 'Tibias & Avant-Jambes 🟡', xPercent: 50, yPercent: 60,
      description: 'Poils incarnés et kératose pilaire post-épilation avec micro-inflammations.',
      recommendedBotanical: 'Gommage Sucre de Canne & Huile de Coco Vierge',
    },
  ],
  pieds: [
    {
      id: 'crack-pieds', title: 'Fissures Talonnières', type: 'hydration',
      depth: '1.0mm (Hyperkératose)', metric: 'Épaisseur Corne 3.2mm', status: 'critical',
      zone: 'Talons & Plante du Pied 🔴', xPercent: 48, yPercent: 65,
      description: 'Épaississement corné excessif avec crevasses douloureuses par déshydratation profonde.',
      recommendedBotanical: 'Urée 20% & Beurre de Karité Enrichi AHA',
    },
    {
      id: 'fungal-pieds', title: 'Suspicion Mycosique', type: 'eczema',
      depth: '0.2mm', metric: 'Score Risque 6/10', status: 'warning',
      zone: 'Espaces Interdigitaux 🟡', xPercent: 40, yPercent: 38,
      description: 'Macération inter-orteils avec desquamation suspecte d\'une dermatophytose.',
      recommendedBotanical: 'Huile Essentielle d\'Arbre à Thé & Extrait de Neem',
    },
  ],
  cuir_chevelu: [
    {
      id: 'sebum-scalp', title: 'Dermite Séborrhéique', type: 'sebum',
      depth: '0.3mm', metric: 'Indice Sébum 88%', status: 'critical',
      zone: 'Vertex & Ligne Frontale 🔴', xPercent: 48, yPercent: 30,
      description: 'Excès sébacé avec pellicules grasses et prurit du cuir chevelu.',
      recommendedBotanical: 'Huile de Ricin Noir Jamaïcain & Pyrithione de Zinc Naturel',
    },
    {
      id: 'alopecia-scalp', title: 'Alopécie de Traction', type: 'elasticity',
      depth: '2.0mm (Bulbe)', metric: 'Densité -35%', status: 'critical',
      zone: 'Tempes & Ligne Frontale 🔴', xPercent: 30, yPercent: 45,
      description: 'Perte capillaire progressive par traction des coiffures serrées (tresses, tissages).',
      recommendedBotanical: 'Huile de Fenugrec & Sérum Biotine Concentré',
    },
  ],
  corps_entier: [
    {
      id: 'eczema-body', title: 'Dermatite Atopique Généralisée', type: 'eczema',
      depth: '0.5mm', metric: 'SCORAD 28/103', status: 'critical',
      zone: 'Plis de Flexion 🔴', xPercent: 45, yPercent: 35,
      description: 'Eczéma constitutionnel avec xérose, prurit et lichénification des plis.',
      recommendedBotanical: 'Émollient Karité & Avoine Colloïdale',
    },
    {
      id: 'hydration-body', title: 'Xérose Corporelle Diffuse', type: 'hydration',
      depth: '0.1mm', metric: 'TEWL 19.8 g/m²/h', status: 'warning',
      zone: 'Tronc & Membres 🟠', xPercent: 50, yPercent: 55,
      description: 'Déshydratation cutanée généralisée avec desquamation fine et tiraillement.',
      recommendedBotanical: 'Lait Corporel Karité-Baobab & Glycérine Végétale 10%',
    },
  ],
};

// ── SVG MESH PAR ZONE ──
const MESH_SVG: Record<BodyZone, JSX.Element> = {
  visage: (
    <g stroke="#C8951E" strokeWidth="1.2" strokeOpacity="0.7">
      <path d="M150 120 Q 250 180 350 120" /><path d="M130 160 Q 250 230 370 160" />
      <path d="M120 210 Q 250 290 380 210" /><path d="M110 270 Q 250 360 390 270" />
      <path d="M115 330 Q 250 430 385 330" /><path d="M130 390 Q 250 480 370 390" />
      <path d="M160 450 Q 250 520 340 450" />
      <path d="M150 120 Q 110 270 160 450" /><path d="M190 120 Q 150 270 200 480" />
      <path d="M230 120 Q 200 270 240 500" /><path d="M270 120 Q 300 270 260 500" />
      <path d="M310 120 Q 350 270 300 480" /><path d="M350 120 Q 390 270 340 450" />
      <line x1="150" y1="120" x2="370" y2="390" strokeDasharray="3 3" strokeOpacity="0.4" />
      <line x1="350" y1="120" x2="130" y2="390" strokeDasharray="3 3" strokeOpacity="0.4" />
    </g>
  ),
  cou: (
    <g stroke="#C8951E" strokeWidth="1.2" strokeOpacity="0.7">
      <path d="M120 80 Q 250 120 380 80" /><path d="M100 160 Q 250 220 400 160" />
      <path d="M90 250 Q 250 320 410 250" /><path d="M100 340 Q 250 410 400 340" />
      <path d="M120 420 Q 250 480 380 420" /><path d="M140 500 Q 250 540 360 500" />
      <path d="M170 80 Q 150 300 170 500" /><path d="M250 80 Q 250 300 250 540" />
      <path d="M330 80 Q 350 300 330 500" />
    </g>
  ),
  decollete: (
    <g stroke="#C8951E" strokeWidth="1.2" strokeOpacity="0.7">
      <path d="M80 100 Q 250 60 420 100" /><path d="M60 180 Q 250 130 440 180" />
      <path d="M50 270 Q 250 220 450 270" /><path d="M60 360 Q 250 310 440 360" />
      <path d="M80 440 Q 250 400 420 440" />
      <path d="M150 60 Q 130 280 150 500" /><path d="M250 60 Q 250 280 250 500" />
      <path d="M350 60 Q 370 280 350 500" />
    </g>
  ),
  bras: (
    <g stroke="#C8951E" strokeWidth="1.2" strokeOpacity="0.7">
      <path d="M140 60 Q 250 100 360 60" /><path d="M120 140 Q 250 190 380 140" />
      <path d="M110 230 Q 250 290 390 230" /><path d="M120 330 Q 250 390 380 330" />
      <path d="M140 420 Q 250 470 360 420" /><path d="M160 500 Q 250 540 340 500" />
      <path d="M180 60 Q 160 300 180 540" /><path d="M250 60 Q 250 300 250 540" />
      <path d="M320 60 Q 340 300 320 540" />
    </g>
  ),
  mains: (
    <g stroke="#C8951E" strokeWidth="1.2" strokeOpacity="0.7">
      <path d="M150 120 Q 250 80 350 120" /><path d="M130 200 Q 250 160 370 200" />
      <path d="M140 280 Q 250 250 360 280" /><path d="M150 360 Q 250 330 350 360" />
      <path d="M160 440 Q 250 420 340 440" />
      <path d="M170 80 Q 160 300 170 500" /><path d="M220 80 Q 210 300 220 500" />
      <path d="M280 80 Q 290 300 280 500" /><path d="M330 80 Q 340 300 330 500" />
    </g>
  ),
  dos: (
    <g stroke="#C8951E" strokeWidth="1.2" strokeOpacity="0.7">
      <path d="M100 60 Q 250 100 400 60" /><path d="M80 150 Q 250 210 420 150" />
      <path d="M70 250 Q 250 320 430 250" /><path d="M80 350 Q 250 420 420 350" />
      <path d="M100 440 Q 250 500 400 440" />
      <path d="M160 60 Q 140 280 160 500" /><path d="M250 60 Q 250 280 250 540" />
      <path d="M340 60 Q 360 280 340 500" />
      <line x1="250" y1="60" x2="250" y2="540" strokeDasharray="4 4" strokeOpacity="0.5" />
    </g>
  ),
  jambes: (
    <g stroke="#C8951E" strokeWidth="1.2" strokeOpacity="0.7">
      <path d="M120 50 Q 250 80 380 50" /><path d="M110 140 Q 250 180 390 140" />
      <path d="M105 240 Q 250 290 395 240" /><path d="M110 340 Q 250 390 390 340" />
      <path d="M120 440 Q 250 480 380 440" /><path d="M140 530 Q 250 560 360 530" />
      <path d="M180 50 Q 170 300 180 560" /><path d="M250 50 Q 250 300 250 560" />
      <path d="M320 50 Q 330 300 320 560" />
    </g>
  ),
  pieds: (
    <g stroke="#C8951E" strokeWidth="1.2" strokeOpacity="0.7">
      <path d="M130 100 Q 250 60 370 100" /><path d="M120 200 Q 250 160 380 200" />
      <path d="M130 300 Q 250 270 370 300" /><path d="M150 400 Q 250 380 350 400" />
      <path d="M170 480 Q 250 470 330 480" />
      <path d="M180 60 Q 170 280 180 520" /><path d="M250 60 Q 250 280 250 520" />
      <path d="M320 60 Q 330 280 320 520" />
    </g>
  ),
  cuir_chevelu: (
    <g stroke="#C8951E" strokeWidth="1.2" strokeOpacity="0.7">
      <path d="M160 100 Q 250 60 340 100" /><path d="M140 170 Q 250 120 360 170" />
      <path d="M130 250 Q 250 200 370 250" /><path d="M140 330 Q 250 290 360 330" />
      <path d="M160 400 Q 250 370 340 400" />
      <path d="M190 60 Q 180 250 190 440" /><path d="M250 60 Q 250 250 250 440" />
      <path d="M310 60 Q 320 250 310 440" />
      <circle cx="250" cy="200" r="100" strokeDasharray="5 5" strokeOpacity="0.5" fill="none" />
    </g>
  ),
  corps_entier: (
    <g stroke="#C8951E" strokeWidth="1.2" strokeOpacity="0.7">
      <path d="M200 50 Q 250 40 300 50" /><path d="M150 120 Q 250 100 350 120" />
      <path d="M120 200 Q 250 180 380 200" /><path d="M130 280 Q 250 260 370 280" />
      <path d="M140 360 Q 250 340 360 360" /><path d="M150 440 Q 250 420 350 440" />
      <path d="M160 520 Q 250 510 340 520" />
      <path d="M200 40 Q 180 300 200 560" /><path d="M250 40 Q 250 300 250 560" />
      <path d="M300 40 Q 320 300 300 560" />
      <line x1="250" y1="40" x2="250" y2="560" strokeDasharray="4 4" strokeOpacity="0.4" />
    </g>
  ),
};

// ── AFRO-FUTURISTIC 3D HOLOGRAPHIC PARTICLE CANVAS ──
function HolographicParticleCanvas({ activeMode, isScanning }: { activeMode: string; isScanning: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const colorMap: Record<string, { primary: string; secondary: string; glow: string }> = {
      mesh: { primary: '#FFD700', secondary: '#C8951E', glow: 'rgba(255, 215, 0, 0.5)' },
      pih: { primary: '#FF4D4D', secondary: '#FF8800', glow: 'rgba(255, 77, 77, 0.5)' },
      hydration: { primary: '#00E5FF', secondary: '#00A2FF', glow: 'rgba(0, 229, 255, 0.5)' },
      barrier: { primary: '#00E676', secondary: '#B9F6CA', glow: 'rgba(0, 230, 118, 0.5)' },
    };

    const palette = colorMap[activeMode] || colorMap.mesh;

    const numParticles = 40;
    const particles = Array.from({ length: numParticles }, () => ({
      x: (Math.random() - 0.5) * 350,
      y: (Math.random() - 0.5) * 450,
      z: Math.random() * 350 + 100,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      vz: (Math.random() - 0.5) * 0.7,
      size: Math.random() * 2 + 1,
    }));

    let laserY = 0;
    let laserDirection = 1;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const fov = 280;
      const centerX = width / 2;
      const centerY = height / 2;

      const projected: { x: number; y: number; z: number }[] = [];

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < -180 || p.x > 180) p.vx *= -1;
        if (p.y < -220 || p.y > 220) p.vy *= -1;
        if (p.z < 60 || p.z > 450) p.vz *= -1;

        const scale = fov / p.z;
        const px = p.x * scale + centerX;
        const py = p.y * scale + centerY;

        projected.push({ x: px, y: py, z: p.z });

        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, p.size * scale * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = palette.primary;
        ctx.shadowBlur = 8;
        ctx.shadowColor = palette.glow;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Connect nodes with Kente geometric lines
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 70) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.strokeStyle = palette.secondary;
            ctx.globalAlpha = (1 - dist / 70) * 0.4;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Moving Laser Line
      laserY += laserDirection * (isScanning ? 5.0 : 2.0);
      if (laserY > height) laserDirection = -1;
      if (laserY < 0) laserDirection = 1;

      const grad = ctx.createLinearGradient(0, laserY - 12, 0, laserY + 12);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.5, palette.primary);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, laserY - 8, width, 16);

      // Spark particles
      for (let i = 0; i < 4; i++) {
        const sparkX = Math.random() * width;
        ctx.beginPath();
        ctx.arc(sparkX, laserY + (Math.random() - 0.5) * 4, Math.random() * 1.8 + 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeMode, isScanning]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-15 pointer-events-none w-full h-full" />;
}

export function SpectralScanOverlay({
  imageSrc = '/images/afro_skin_spectral_scanner.jpg',
  photos = [],
  clientName = 'Analyse Cliente',
  hydrationScore = 84,
  pihDepth = '0.2mm',
  phototype = 'Type V',
  showControls = true,
  bodyZone: initialZone = 'visage',
}: SpectralScanOverlayProps) {
  const [activeMode, setActiveMode] = useState<'mesh' | 'pih' | 'hydration' | 'barrier'>('mesh');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [currentZone, setCurrentZone] = useState<BodyZone>(initialZone);

  const hotspots = HOTSPOTS_BY_ZONE[currentZone] || HOTSPOTS_BY_ZONE.visage;
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotDetail | null>(hotspots[0]);

  const availablePhotos = photos.length > 0 ? photos : [imageSrc];
  const currentPhoto = availablePhotos[Math.min(selectedPhotoIdx, availablePhotos.length - 1)];

  const handleZoneChange = (zone: BodyZone) => {
    setCurrentZone(zone);
    const zoneHotspots = HOTSPOTS_BY_ZONE[zone];
    setSelectedHotspot(zoneHotspots?.[0] || null);
  };

  const handleReScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border-2 border-[#C8951E]/60 bg-[#0F0A05] shadow-[0_0_50px_rgba(200,149,30,0.3)] select-none font-sans">
      
      {/* ── HEADER : ZONE CORPORELLE + FILTRES SPECTRAUX ── */}
      {showControls && (
        <div className="bg-[#1A1410] border-b border-white/10 p-2.5 space-y-2">
          {/* Body Zone Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-[9px] text-white/40 font-mono shrink-0 pr-1">Zone :</span>
            {BODY_ZONES.map((zone) => (
              <button
                key={zone.id}
                onClick={() => handleZoneChange(zone.id)}
                className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  currentZone === zone.id
                    ? 'bg-gradient-to-r from-[#C8951E] to-[#F3E5AB] text-[#0F0A05] shadow-md'
                    : 'text-white/50 hover:text-white bg-[#0F0A05] border border-white/10'
                }`}
              >
                {zone.icon} {zone.label}
              </button>
            ))}
          </div>

          {/* Multi-Photo + Spectral Modes Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            {availablePhotos.length > 1 ? (
              <div className="flex flex-wrap items-center gap-1.5 bg-[#0F0A05] p-1 rounded-xl border border-white/10">
                <span className="text-[9px] text-white/40 font-mono px-1 w-full sm:w-auto">Photos ({availablePhotos.length}) :</span>
                {availablePhotos.map((_, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setSelectedPhotoIdx(pIdx)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg transition ${
                      selectedPhotoIdx === pIdx ? 'bg-[#C8951E] text-[#0F0A05]' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    📷 Photo {pIdx + 1}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-[10px] font-mono text-[#F3E5AB] font-bold flex items-center gap-1 min-w-0">
                ✨ {BODY_ZONES.find(z => z.id === currentZone)?.icon} Scan {BODY_ZONES.find(z => z.id === currentZone)?.label} (3D AI)
              </span>
            )}

            <div className="flex flex-wrap items-center gap-1 bg-[#0F0A05] p-1 rounded-xl border border-white/10">
              {[
                { mode: 'mesh' as const, label: '🌟 Mesh 3D', activeClass: 'bg-gradient-to-r from-[#C8951E] to-[#F3E5AB] text-[#0F0A05]' },
                { mode: 'pih' as const, label: '🔬 PIH', activeClass: 'bg-red-500 text-white' },
                { mode: 'hydration' as const, label: '💧 Hydra', activeClass: 'bg-sky-500 text-white' },
                { mode: 'barrier' as const, label: '🛡️ Barrière', activeClass: 'bg-emerald-500 text-white' },
              ].map(({ mode, label, activeClass }) => (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-1 rounded-lg transition whitespace-nowrap ${activeMode === mode ? activeClass : 'text-white/50 hover:text-white'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGE + MAILLAGE 3D + HOTSPOTS ── */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-[#1A1410]">
        <img
          src={currentPhoto}
          alt={`${clientName} — ${BODY_ZONES.find(z => z.id === currentZone)?.label}`}
          className={`w-full h-full object-cover transition-all duration-700 ${
            activeMode === 'pih' ? 'contrast-150 saturate-200 hue-rotate-15' :
            activeMode === 'hydration' ? 'hue-rotate-180 brightness-110' :
            activeMode === 'barrier' ? 'invert opacity-85 contrast-200' : ''
          }`}
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/afro_skin_spectral_scanner.jpg'; }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A05] via-transparent to-black/50" />

        {/* Laser Scan Animation */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent shadow-[0_0_25px_#FFD700] z-30"
            />
          )}
        </AnimatePresence>

        {/* 3D MESH OVERLAY (adapté à la zone) */}
        {activeMode === 'mesh' && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-85">
            <svg className="w-full h-full" viewBox="0 0 500 600" fill="none">
              {MESH_SVG[currentZone]}
            </svg>
          </div>
        )}

        {/* ── AFRO-FUTURISTIC 3D HOLOGRAPHIC CANVAS ── */}
        <HolographicParticleCanvas activeMode={activeMode} isScanning={isScanning} />

        {/* HOTSPOTS INTELLIGENTS (positionnés sur zones suspectes) */}
        <div className="absolute inset-0 z-20">
          {hotspots.map((hotspot) => {
            const isSelected = selectedHotspot?.id === hotspot.id;
            const dotColor = hotspot.status === 'critical' ? 'bg-red-500' : hotspot.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400';
            const badgeColor = hotspot.status === 'critical' ? 'border-red-500 text-red-200' :
                             hotspot.status === 'warning' ? 'border-amber-500 text-amber-200' : 'border-emerald-500 text-emerald-200';

            return (
              <div
                key={hotspot.id}
                style={{ top: `${hotspot.yPercent}%`, left: `${hotspot.xPercent}%` }}
                className="absolute flex items-center gap-2 group cursor-pointer"
                onClick={() => setSelectedHotspot(hotspot)}
              >
                <div className="relative">
                  <div className={`w-6 h-6 rounded-full bg-black/60 border-2 flex items-center justify-center animate-pulse ${isSelected ? 'scale-125 border-[#FFD700]' : 'border-white/50'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                  </div>
                  <div className="absolute inset-0 rounded-full border border-white/60 animate-ping opacity-75" />
                </div>
                <div className={`bg-[#0F0A05]/95 border backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xl transition-all ${badgeColor} ${isSelected ? 'ring-2 ring-[#C8951E] scale-105' : 'opacity-85 hover:opacity-100'}`}>
                  <span className="text-[10px] font-mono font-bold block">{hotspot.title}</span>
                  <span className="text-[9px] font-mono text-white/60 block">{hotspot.metric}</span>
                </div>
              </div>
            );
          })}

          {/* HUD Hydration Score */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-[8%] right-[4%] bg-[#0F0A05]/90 border-2 border-[#C8951E] backdrop-blur-xl rounded-2xl p-2.5 shadow-xl flex items-center gap-2.5 text-white"
          >
            <div>
              <span className="text-[9px] font-mono text-white/50 uppercase block">Hydratation</span>
              <div className="flex items-center gap-1">
                <span className="text-xl font-display font-black text-[#F3E5AB]">+{hydrationScore}%</span>
                <Droplets className="w-4 h-4 text-sky-400 animate-bounce" />
              </div>
            </div>
          </motion.div>

          {/* Bottom HUD Cards */}
          <div className="absolute bottom-[4%] left-[3%] right-[3%] grid grid-cols-3 gap-2">
            <div className="bg-[#0F0A05]/90 border border-white/10 backdrop-blur-md p-2 rounded-xl text-center">
              <span className="text-[8px] text-white/40 font-mono uppercase block">Mélanine</span>
              <span className="text-xs font-mono font-bold text-[#F3E5AB]">68/100</span>
            </div>
            <div className="bg-[#0F0A05]/90 border border-white/10 backdrop-blur-md p-2 rounded-xl text-center">
              <span className="text-[8px] text-white/40 font-mono uppercase block">TEWL</span>
              <span className="text-xs font-mono font-bold text-amber-300">14.2 g/m²/h</span>
            </div>
            <div className="bg-[#0F0A05]/90 border border-white/10 backdrop-blur-md p-2 rounded-xl text-center">
              <span className="text-[8px] text-white/40 font-mono uppercase block">Microbiome</span>
              <span className="text-xs font-mono font-bold text-emerald-400">94%</span>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute top-3 left-3 bg-black/60 border border-white/10 px-2.5 py-1 rounded-xl text-[9px] font-mono text-[#F3E5AB] flex items-center gap-1.5 z-20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>XP-3D · {BODY_ZONES.find(z => z.id === currentZone)?.label?.toUpperCase()} · 60 FPS</span>
        </div>
      </div>

      {/* ── INSPECTEUR DE ZONE SUSPECTE ── */}
      {selectedHotspot && (
        <div className="bg-[#1A1410] border-t border-white/10 p-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs">🔬</span>
              <span className="font-display font-bold text-sm text-white">{selectedHotspot.title}</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#C8951E]/20 text-[#F3E5AB] font-mono font-bold">
                {selectedHotspot.zone}
              </span>
            </div>
            <span className="text-[10px] text-white/40 font-mono">{selectedHotspot.depth}</span>
          </div>

          <p className="text-xs text-white/70 font-sans leading-relaxed">
            {selectedHotspot.description}
          </p>

          <div className="bg-[#0A0603] p-2.5 rounded-xl border border-[#2E5A36]/50 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[#4CAF6E] font-bold">🌱 Actif Botanique Prescrit :</span>
            <span className="text-white font-mono font-semibold">{selectedHotspot.recommendedBotanical}</span>
          </div>
        </div>
      )}
    </div>
  );
}
