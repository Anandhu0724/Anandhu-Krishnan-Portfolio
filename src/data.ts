/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, LeadershipRole, Credential, TechSkill, OperatorProfile } from './types';

export const PROFILE_DATABASE: OperatorProfile = {
  name: 'ANANDHU KRISHNAN',
  title: 'IDENTITY SYNC: ANANDHU KRISHNAN',
  subtitle: 'SYSTEMS ENGINEER & TECHNICAL COMMUNITY LEADER',
  summary: 'A results-driven Computer Science Engineering student and ecosystem builder specializing in AI workflow optimization, web architectures, and full-stack software design. Proven execution in leading multi-tier campus innovation initiatives, building automation systems, and managing regional technical communities.',
  avatarUrl: 'WhatsApp Image 2026-06-28 at 20.56.23.jpeg',
  operatorHash: 'AK_8849',
  securityLevel: 'LEVEL_01_ADMIN',
  systemStatus: 'ACTIVE_ONLINE',
  coordinates: '9.6894°N, 76.9902°E',
  encryption: 'SHA_256_ACTIVE',
  hobbies: [
    {
      title: 'Mythology Research',
      description: 'Delving into comparative mythology, folk narratives, and cultural legends.',
      themeColor: 'blue'
    },
    {
      title: 'Anime Explorer',
      description: 'Analyzing complex storytelling, artistic direction, and character arcs in modern animation.',
      themeColor: 'emerald'
    },
    {
      title: 'Horror Enthusiast',
      description: 'Watching Horror movies and webseries and also searching Horrorific things',
      themeColor: 'purple'
    }
  ]
};

export const PROJECTS: Project[] = [
  {
    id: 'elam-sahayi',
    title: 'Elam Sahayi',
    subtitle: 'IoT Cardamom Harvesting Automation',
    description: 'An advanced IoT & smart automation Cardamom Harvesting Machine addressing severe occupational health risks (pesticide exposure, leech bites, joint strain) in hilly agricultural plantations.',
    longDescription: 'Developed as part of the prestigious Young Innovators Programme (YIP 8.0), Elam Sahayi integrates custom mechanical picking assemblies with real-time sensor networks to completely automate agricultural harvesting. It replaces tedious manual picking, protecting plantation workers while increasing efficiency.',
    tags: ['IoT', 'Automation', 'Sensors', 'Embedded C', 'YIP 8.0'],
    metric: 'Occupational risk reduced by 95%',
    githubUrl: 'https://github.com/anandhu-krishnan',
    liveUrl: '#',
    architectureDetails: [
      'Pesticide & gas detection sensors',
      'Automated pick-and-sort mechanical end-effectors',
      'Solar-powered high-torque continuous drive train',
      'Telemetry feedback via local Bluetooth/WiFi interface'
    ]
  },
  {
    id: 'mbceats',
    title: 'MBCeats',
    subtitle: 'Full-Stack Canteen Management Workflow',
    description: 'A full-stack canteen automation network engineered with Java and SQL, eliminating high-volume checkout queues and optimizing kitchen inventory cycles.',
    longDescription: 'Designed to solve the bottleneck of long lunch queues in college canteens. MBCeats features an asynchronous order system, live queue tracking, and automated ledger balancing. Kitchen staff receive orders instantly on a digital dispatch screen, and students get live ETA updates.',
    tags: ['Java', 'SQL', 'Database Design', 'Asynchronous Workflows', 'Client-Server'],
    metric: 'Queue wait-time cut by 70%',
    githubUrl: 'https://github.com/anandhu-krishnan',
    liveUrl: '#',
    architectureDetails: [
      'Relational database with optimized index paths',
      'Thread-safe Java concurrent socket communication',
      'Interactive dashboard for food vendors and students',
      'Secure transaction hashing'
    ]
  },
  {
    id: 'time-dilation',
    title: 'Time Dilation App',
    subtitle: 'Relativistic Spacetime Simulation',
    description: 'An interactive, astrophysics-focused simulation application engineered during the NASA Space Apps Challenge to visualize relativistic time dilation effects near high-mass celestial bodies.',
    tags: ['Astrophysics Data', 'React', 'NASA API', 'Tailwind CSS', 'Data Visualization'],
    metric: 'Calculated time shift equations dynamically',
    githubUrl: 'https://github.com/anandhu-krishnan',
    liveUrl: '#',
    architectureDetails: [
      'Einstein field equations computation engine',
      'Interactive orbital parameter controls',
      'NASA API stellar telemetry visualization interface',
      'Dynamic gravitational redshift curve rendering'
    ]
  },
  {
    id: 'yawnsense',
    title: 'YawnSense',
    subtitle: 'Computer Vision Boredom Tracker',
    description: 'An intentionally ironic, whimsical computer vision script designed for the Useless Project Challenge that detects facial tracking points to calculate exact yawn durations and sound-level disruption metrics.',
    tags: ['Python', 'OpenCV', 'Facial Landmarks', 'Amusing Automation'],
    metric: '100% accurate yawn fatigue verification',
    githubUrl: 'https://github.com/anandhu-krishnan',
    liveUrl: '#',
    architectureDetails: [
      'Real-time facial landmark detection (68-point model)',
      'Mouth Aspect Ratio (MAR) yawn tracking algorithm',
      'Decibel-level microphone threshold triggers',
      'Automated fatigue alerts & CSV session logs export'
    ]
  },
  {
    id: 'prompt-eng-workflows',
    title: 'AI Workflow Automations',
    subtitle: 'System Instruction Frameworks',
    description: 'A structured repository containing optimized LLM context designs, systemic prompt instructions, and algorithmic chain-of-thought workflows engineered during the Future Interns program.',
    tags: ['Prompt Engineering', 'Generative AI', 'LLM Alignment', 'Workflow Optimization'],
    metric: 'Context accuracy improved via alignment logic',
    githubUrl: 'https://github.com/anandhu-krishnan',
    liveUrl: '#',
    architectureDetails: [
      'Context window packing & token budget layout',
      'Chain-of-thought reasoning graph structures',
      'Targeted system instruction schemas',
      'Evaluation benchmarks for task accuracy'
    ]
  }
];

export const LEADERSHIP_ROLES: LeadershipRole[] = [
  {
    id: 'iic-lead',
    title: 'Student Convener & Innovation Lead',
    organization: "Institution's Innovation Council (IIC)",
    duration: '2024 - Present',
    description: 'Spearheading the institute-wide innovation ecosystem under the Ministry of Education guidelines, promoting entrepreneurship, Hackathons, and incubation drives.',
    highlights: [
      'Successfully coordinated 12+ institutional hackathons and startup incubation events',
      'Mentored 150+ students in developing business models for national grants',
      'Pioneered inter-departmental innovation sprints'
    ],
    metric: {
      value: '450+',
      label: 'Students Mobilized'
    }
  },
  {
    id: 'edc-manager',
    title: 'Structural Action Plan Manager',
    organization: 'Entrepreneurship Development Club (EDC)',
    duration: '2024 - Present',
    description: 'Structuring and executing development maps to foster entrepreneurial minds, organizing design sprints and funding bootcamps.',
    highlights: [
      'Designed a multi-stage startup ideation pipeline for student-led companies',
      'Liaised with state funding bodies for student enterprise sponsorships',
      'Formulated the annual technical action plan and operational budget'
    ],
    metric: {
      value: 'YIP 8.0',
      label: 'Selected Teams Coordinator'
    }
  },
  {
    id: 'kkem-ambassador',
    title: 'Career Ambassador',
    organization: 'Kerala Knowledge Economy Mission (KKEM)',
    duration: '2024 - Present',
    description: 'Connecting regional talent with global digital employment initiatives by leading technical awareness campaigns and career readiness bootcamps.',
    highlights: [
      'Educated 300+ students on modern remote work methodologies and certifications',
      'Facilitated direct career assistance drives in the local community',
      'Awarded "Outstanding Regional Ambassador" for active campaign reach'
    ],
    metric: {
      value: '300+',
      label: 'Talent Registrations'
    }
  },
  {
    id: 'bridgegap-rep',
    title: 'Idukki City Representative',
    organization: 'Bridgegap Community',
    duration: '2025 - Present',
    description: 'Empowering young engineers in hilly and rural sectors of Idukki by providing mentorship networks, technical workshops, and collaboration platforms.',
    highlights: [
      'Established the local Bridgegap node in the district',
      'Conducted free technical workshops on Linux and WSL developer environments',
      'Bridged the regional gap by connecting students to premium tech resources'
    ],
    metric: {
      value: '10+',
      label: 'Workshops Managed'
    }
  }
];

export const CREDENTIALS: Credential[] = [
  {
    id: 'uquest-winner',
    title: 'Winner - µQuest 7-Day Entrepreneurship Sprint',
    issuer: 'IEDC Sponsored',
    date: '2025',
    type: 'honor',
    description: 'Awarded first place in a rigorous 7-day startup incubation marathon. Designed, pitch-decked, and validated a sustainable high-tech enterprise solution under industry pressure.'
  },
  {
    id: 'nasa-spaceapps',
    title: 'Team Lead - Team "VajraM"',
    issuer: 'NASA Space Apps Challenge',
    date: '2024',
    type: 'honor',
    description: 'Led an agile team of engineers in solving complex planetary data tasks using NASA open-source satellite API feeds, building a clean visual data dashboard in 48 hours.'
  },
  {
    id: 'future-interns',
    title: 'Prompt Engineering & Generative AI Intern',
    issuer: 'Future Interns',
    date: '2025',
    type: 'internship',
    description: 'Architected prompt workflows, automated content systems, and researched LLM alignment strategies using advanced system instructions.'
  },
  {
    id: 'cognevance-intern',
    title: 'Frontend Web Design Intern',
    issuer: 'Cognevance',
    date: '2024',
    type: 'internship',
    description: 'Crafted highly interactive, responsive visual interfaces for corporate portfolios and SaaS dashboards, mastering layout pacing and SVG mechanics.'
  }
];

export const TECH_SKILLS: TechSkill[] = [
  { name: 'Java SE', category: 'languages', level: 90 },
  { name: 'SQL & Database Indexing', category: 'databases', level: 85 },
  { name: 'Windows 11 / WSL Optimization', category: 'systems', level: 95 },
  { name: 'Garuda Linux (Arch-based)', category: 'systems', level: 88 },
  { name: 'Debian Ecosystems', category: 'systems', level: 85 },
  { name: 'React & Vite', category: 'languages', level: 80 },
  { name: 'Tailwind CSS', category: 'tools', level: 90 },
  { name: 'Git & Command Line Automation', category: 'tools', level: 88 },
  { name: 'IoT Systems & Sensor Telemetry', category: 'systems', level: 82 }
];
