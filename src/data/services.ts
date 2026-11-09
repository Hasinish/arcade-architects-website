import type { ServiceItem } from '../types';

export const services: ServiceItem[] = [
  {
    id: 'exterior-arch',
    number: '01',
    title: 'Architectural Exterior Design & Visualization',
    description: 'We shape monuments, commercial towers, and private luxury residences with uncompromising structural aesthetics. From initial volumetric massing studies to photorealistic day and night renders that bring client visions to reality.',
    deliverables: [
      'High-Resolution 4K/8K Photorealistic Stills',
      'Day, Twilight & Dramatic Night Lighting Studies',
      'Architectural Facade Detailing & Material Selection',
      'Site Integration & Landscape Visualization'
    ],
    image: '/assets/Exterior/Hazi Bari Project/01.png',
    tag: 'Architecture & Exterior',
  },
  {
    id: 'interior-design',
    number: '02',
    title: 'Interior Architecture & Spatial Styling',
    description: 'Immersive interior spaces designed with sensory depth. We combine bespoke millwork, custom lighting plans, tactile stone and timber materials, and ergonomic furniture layouts for high-end residential and hospitality environments.',
    deliverables: [
      'Comprehensive Interior Space Planning',
      'Photorealistic D5 & Corona Interior Renders',
      'Custom Joinery, Millwork & Lighting Schedules',
      'Furniture, Fixture & Equipment (FF&E) Specifications'
    ],
    image: '/assets/Interior/Cafe/nidasheena (1).jpg',
    tag: 'Interior & Hospitality',
  },
  {
    id: 'exhibition-pavilion',
    number: '03',
    title: 'Exhibition Pavilions & Brand Architecture',
    description: 'Stand out on the world stage. We engineer high-traffic exhibition booths, corporate brand pavilions, and event environments that command attention and drive unforgettable visitor engagement.',
    deliverables: [
      'Custom Structural Truss & Pavilion Design',
      'Visitor Circulation & Spatial Flow Strategy',
      'Integrated Digital Display & Architectural Lighting',
      'Fabrication & On-Site Assembly Guidelines'
    ],
    image: '/assets/Exhibition/Ford/01_Photo - 10 (FILEminimizer).jpg',
    tag: 'Brand Environments',
  },
  {
    id: 'turnkey-planning',
    number: '04',
    title: 'Architectural Planning & Project Supervision',
    description: 'Beyond concept renders: complete working drawings, municipal approval coordination, structural alignment, and periodic site inspection to ensure your project is built exactly as envisioned.',
    deliverables: [
      'Complete Architectural Working Drawings & Blueprints',
      'Structural & MEP Coordination Assistance',
      'Bill of Quantities (BOQ) & Material Estimates',
      'Site Supervision & Execution Quality Control'
    ],
    image: '/assets/Exterior/USA/001_10 - Photo.jpg',
    tag: 'Turnkey Execution',
  },
];
