/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  ChevronDown, Cpu, Activity, Settings, Calendar
} from 'lucide-react';

import CyberSpaceCanvas from './components/CyberSpaceCanvas';
import Navbar from './components/Navbar';
import ProjectCard from './components/ProjectCard';
import LeadershipCard from './components/LeadershipCard';
import TechStackDashboard from './components/TechStackDashboard';
import ContactForm from './components/ContactForm';
import ResidentialLocation from './components/ResidentialLocation';
import AdminConsole from './components/AdminConsole';

import { PROJECTS, LEADERSHIP_ROLES } from './data';
import { audioSystem } from './utils/audioSystem';
import { Project, LeadershipRole } from './types';

const getProjectCategory = (project: Project): 'IoT' | 'Full-Stack' => {
  if (project.id === 'elam-sahayi' || project.id === 'yawnsense') {
    return 'IoT';
  }
  return 'Full-Stack';
};

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'IoT' | 'Full-Stack'>('All');

  // Load and manage custom client-side override state
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('portfolio_override_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (Array.isArray(data.projects)) return data.projects;
      } catch (e) {
        console.error('Error loading overridden project data:', e);
      }
    }
    return PROJECTS;
  });

  const [leadershipRoles, setLeadershipRoles] = useState<LeadershipRole[]>(() => {
    const saved = localStorage.getItem('portfolio_override_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (Array.isArray(data.leadershipRoles)) return data.leadershipRoles;
      } catch (e) {
        console.error('Error loading overridden leadership data:', e);
      }
    }
    return LEADERSHIP_ROLES;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('portfolio_admin_active') === 'true';
  });

  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);

  const handleUpdateProject = (updatedProject: Project) => {
    const updated = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(updated);
    localStorage.setItem('portfolio_override_data', JSON.stringify({
      projects: updated,
      leadershipRoles
    }));
  };

  const handleUpdateLeadershipRole = (updatedRole: LeadershipRole) => {
    const updated = leadershipRoles.map(r => r.id === updatedRole.id ? updatedRole : r);
    setLeadershipRoles(updated);
    localStorage.setItem('portfolio_override_data', JSON.stringify({
      projects,
      leadershipRoles: updated
    }));
  };

  const handleResetData = () => {
    setProjects(PROJECTS);
    setLeadershipRoles(LEADERSHIP_ROLES);
    localStorage.removeItem('portfolio_override_data');
  };

  // Keystroke listener for Ctrl + Shift + A to open administrative override
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        audioSystem.playClickBeep();
        setIsAdminConsoleOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectAndScroll = (category: 'All' | 'IoT' | 'Full-Stack') => {
    audioSystem.playClickBeep();
    setSelectedCategory(category);
    const section = document.getElementById('journey-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleStageClick = (stageIndex: number) => {
    audioSystem.playClickBeep();
    let targetRef: HTMLElement | null = null;
    if (stageIndex === 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } else if (stageIndex === 2) {
      targetRef = projectsSectionRef.current;
    } else if (stageIndex === 3) {
      targetRef = impactSectionRef.current;
    } else if (stageIndex === 4) {
      targetRef = academicsSectionRef.current;
    } else if (stageIndex === 5) {
      targetRef = credentialsSectionRef.current;
    } else if (stageIndex === 6) {
      targetRef = document.getElementById('contact-section');
    }

    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Attempt welcome sequence on first user gesture (complying with browser autoplay rules)
  useEffect(() => {
    const handleFirstGesture = () => {
      audioSystem.triggerWelcomeOnce();
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('wheel', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);
    window.addEventListener('touchstart', handleFirstGesture);
    window.addEventListener('wheel', handleFirstGesture);

    return cleanup;
  }, []);

  const activeHighlight = (() => {
    if (selectedCategory !== 'All') return selectedCategory;
    if (scrollProgress >= 0.14 && scrollProgress <= 0.31) return 'IoT';
    if (scrollProgress > 0.31 && scrollProgress <= 0.48) return 'Full-Stack';
    return 'All';
  })();

  // Measure page scroll overall
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setScrollProgress(progress);

      // Map progress to active narrative stage (1 to 6)
      if (progress < 0.14) {
        setActiveStage(1);
      } else if (progress >= 0.14 && progress < 0.38) {
        setActiveStage(2);
      } else if (progress >= 0.38 && progress < 0.62) {
        setActiveStage(3);
      } else if (progress >= 0.62 && progress < 0.78) {
        setActiveStage(4);
      } else if (progress >= 0.78 && progress < 0.92) {
        setActiveStage(5);
      } else {
        setActiveStage(6);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Section Refs for scroll tracking
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const impactSectionRef = useRef<HTMLDivElement>(null);
  const academicsSectionRef = useRef<HTMLDivElement>(null);
  const credentialsSectionRef = useRef<HTMLDivElement>(null);

  // Framer Motion scroll hooks for desktop sticky effects
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end end']
  });

  const { scrollYProgress: projectsScroll } = useScroll({
    target: projectsSectionRef,
    offset: ['start start', 'end end']
  });

  const { scrollYProgress: impactScroll } = useScroll({
    target: impactSectionRef,
    offset: ['start start', 'end end']
  });

  const { scrollYProgress: academicsScroll } = useScroll({
    target: academicsSectionRef,
    offset: ['start start', 'end end']
  });

  const { scrollYProgress: credentialsScroll } = useScroll({
    target: credentialsSectionRef,
    offset: ['start start', 'end end']
  });

  // Stage 1 (Hero) transformations
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.7], [1, 0.9]);
  const heroTranslateY = useTransform(heroScroll, [0, 0.7], [0, -100]);

  // Stage 2 (Projects Bento Grid) transformations
  const gridOpacity = useTransform(projectsScroll, [0.0, 0.15, 0.85, 1.0], [0, 1, 1, 0]);
  const gridScale = useTransform(projectsScroll, [0.0, 0.15, 0.85, 1.0], [0.88, 1, 1, 0.9]);
  const gridTranslateY = useTransform(projectsScroll, [0.0, 0.15, 0.85, 1.0], [40, 0, 0, -40]);
  const gridPointerEvents = useTransform(gridOpacity, (v) => (v > 0.1 ? 'auto' : 'none'));

  // Stage 3 (Leadership) transformations
  const lAOpacity = useTransform(impactScroll, [0.0, 0.12, 0.4, 0.52], [0, 1, 1, 0]);
  const lAScale = useTransform(impactScroll, [0.0, 0.12, 0.4, 0.52], [0.85, 1, 1, 1.15]);
  const lAY = useTransform(impactScroll, [0.0, 0.12, 0.4, 0.52], [60, 0, 0, -80]);
  const lAPointerEvents = useTransform(lAOpacity, (v) => (v > 0.1 ? 'auto' : 'none'));

  const lBOpacity = useTransform(impactScroll, [0.46, 0.58, 0.88, 1.0], [0, 1, 1, 0]);
  const lBScale = useTransform(impactScroll, [0.46, 0.58, 0.88, 1.0], [0.85, 1, 1, 1.15]);
  const lBY = useTransform(impactScroll, [0.46, 0.58, 0.88, 1.0], [60, 0, 0, -80]);
  const lBPointerEvents = useTransform(lBOpacity, (v) => (v > 0.1 ? 'auto' : 'none'));

  // Stage 4 (Academics) transformations
  const acadAOpacity = useTransform(academicsScroll, [0.0, 0.12, 0.45, 0.55], [0, 1, 1, 0]);
  const acadAScale = useTransform(academicsScroll, [0.0, 0.12, 0.45, 0.55], [0.88, 1, 1, 1.1]);
  const acadAY = useTransform(academicsScroll, [0.0, 0.12, 0.45, 0.55], [60, 0, 0, -80]);
  const acadAPointerEvents = useTransform(acadAOpacity, (v) => (v > 0.1 ? 'auto' : 'none'));

  const acadBOpacity = useTransform(academicsScroll, [0.48, 0.60, 0.92, 1.0], [0, 1, 1, 1]);
  const acadBScale = useTransform(academicsScroll, [0.48, 0.60, 0.92, 1.0], [0.88, 1, 1, 1]);
  const acadBY = useTransform(academicsScroll, [0.48, 0.60, 0.92, 1.0], [60, 0, 0, 0]);
  const acadBPointerEvents = useTransform(acadBOpacity, (v) => (v > 0.1 ? 'auto' : 'none'));

  // Stage 5 (Tech Stack) transformations
  const credsOpacity = useTransform(credentialsScroll, [0.0, 0.15, 0.85, 1.0], [0, 1, 1, 0.3]);
  const credsScale = useTransform(credentialsScroll, [0.0, 0.15, 0.85, 1.0], [0.92, 1, 1, 0.95]);

  return (
    <div className="relative min-h-screen selection:bg-brand-blue/30 selection:text-white">
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-brand-emerald/10 border-b border-brand-emerald/40 backdrop-blur-md text-brand-emerald py-2 px-4 text-center font-mono text-[10px] md:text-xs tracking-widest flex items-center justify-center gap-3 animate-pulse">
          <span className="inline-block w-2 h-2 rounded-full bg-brand-emerald animate-ping" />
          <span>SYSTEM STATE: OVERRIDE_GRANTED // EDIT_MODE_ACTIVE</span>
          <button 
            onClick={() => {
              audioSystem.playClickBeep();
              setIsAdminConsoleOpen(true);
            }}
            className="ml-4 px-2 py-0.5 rounded bg-brand-emerald/20 hover:bg-brand-emerald/30 border border-brand-emerald/30 text-[10px] text-white font-bold cursor-pointer"
          >
            ADMIN PANEL
          </button>
        </div>
      )}

      {/* 3D Immersive Particle/Circuit Space Background Canvas */}
      <CyberSpaceCanvas scrollProgress={scrollProgress} />

      {/* Floating HUD Interface / Cockpit Telemetry - Left Side */}
      <div className="fixed left-6 bottom-8 z-40 hidden lg:flex flex-col text-left font-mono text-[10px] text-gray-500 bg-cyber-dark/65 border border-white/5 p-4 rounded-xl backdrop-blur-md space-y-1.5 pointer-events-none tracking-wider w-56">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1">
          <span className="text-white font-bold flex items-center gap-1.5 uppercase">
            <Activity className="w-3.5 h-3.5 text-brand-blue animate-pulse" />
            HUD_Telemetry
          </span>
          <span className="text-brand-blue animate-pulse">● STABLE</span>
        </div>
        <p>MISSION: PORTFOLIO_V2.6</p>
        <p className="flex justify-between">
          <span>COORDINATE_Z:</span>
          <span className="text-white font-bold">{Math.round(scrollProgress * 3000)}m</span>
        </p>
        <p className="flex justify-between">
          <span>GRID_DENSITY:</span>
          <span className="text-white font-bold">14_RINGS</span>
        </p>
        <p className="flex justify-between">
          <span>ACTIVE_NODE:</span>
          <span className="text-brand-emerald font-bold">[STAGE_0{activeStage}]</span>
        </p>
        <p className="flex justify-between">
          <span>LOCATION_REF:</span>
          <span className="text-white">IDUKKI_KERALA</span>
        </p>
        <div className="pt-1 flex items-center gap-1 text-[9px] text-gray-500 border-t border-white/5 mt-1">
          <Settings className="w-3 h-3 animate-spin" />
          <span>SYS_ENGINEERING_READY</span>
        </div>
      </div>

      {/* Narrative Progress Indicator HUD - Right Side */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-6">
        {/* Background Track Line */}
        <div className="absolute right-[7px] top-2 bottom-2 w-[2px] bg-white/[0.08] rounded-full" />
        
        {/* Glowing Progress Line */}
        <motion.div 
          className="absolute right-[7px] top-2 w-[2px] bg-gradient-to-b from-brand-blue to-brand-emerald rounded-full origin-top glow-blue" 
          style={{ height: `${scrollProgress * 100}%` }}
        />

        {[
          { num: '01', name: 'INIT', label: 'Intro' },
          { num: '02', name: 'PROJ', label: 'Projects' },
          { num: '03', name: 'LDR', label: 'Leadership' },
          { num: '04', name: 'ACAD', label: 'Academic History' },
          { num: '05', name: 'CRED', label: 'Tech & Honors' },
          { num: '06', name: 'TERM', label: 'Contact' },
        ].map((stage, idx) => {
          const isCurrent = activeStage === idx + 1;
          const isPassed = activeStage > idx + 1;
          
          return (
            <motion.div 
              key={stage.num} 
              whileHover={{ scale: 1.05, x: -4 }}
              onClick={() => handleStageClick(idx + 1)}
              className="relative group/hud flex items-center justify-end w-40 cursor-pointer"
            >
              <span className="absolute right-8 text-[9px] font-mono tracking-widest text-gray-500 opacity-0 group-hover/hud:opacity-100 transition-opacity duration-300 pr-2 pointer-events-none">
                {stage.label}
              </span>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-mono transition-colors duration-300 ${isCurrent ? 'text-brand-blue font-bold [text-shadow:0_0_8px_rgba(0,240,255,0.5)]' : isPassed ? 'text-brand-emerald/80' : 'text-gray-600 group-hover/hud:text-white'}`}>
                  {stage.name}
                </span>
                <div className="relative flex items-center justify-center w-4 h-4 z-10">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-brand-blue scale-125 glow-blue border border-white/20' 
                      : isPassed 
                        ? 'bg-brand-emerald glow-emerald' 
                        : 'bg-gray-700 group-hover/hud:bg-brand-blue/50'
                  }`} />
                  {isCurrent && (
                    <div className="absolute w-5 h-5 rounded-full border border-brand-blue/40 animate-ping" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sticky Fixed Navigation */}
      <Navbar />

      {/* ========================================================= */}
      {/*                   DESKTOP STICKY JOURNEY                  */}
      {/* ========================================================= */}
      {!isMobile ? (
        <div className="w-full">
          
          {/* STAGE 1: HERO ENTERING THE SPACE */}
          <div ref={heroSectionRef} id="home-section" className="relative h-[150vh] w-full">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 overflow-hidden">
              <motion.div
                style={{ opacity: heroOpacity, scale: heroScale, y: heroTranslateY }}
                className="max-w-4xl text-center space-y-6 relative z-10"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-gray/60 border border-white/5 backdrop-blur-md mb-2">
                  <Cpu className="w-4 h-4 text-brand-emerald animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400">
                    Mission Operations Profile // Anandhu Krishnan
                  </span>
                </div>

                <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight tracking-tight text-white select-none">
                  Engineering systems.<br />
                  <span className="bg-gradient-to-r from-brand-blue via-brand-emerald to-brand-blue bg-[size:200%_auto] animate-[shimmer_5s_linear_infinite] bg-clip-text text-transparent">
                    Building technical communities.
                  </span>
                </h1>

                <p className="max-w-2xl mx-auto text-gray-300 text-base md:text-lg leading-relaxed font-sans">
                  Computer Science student specializing in AI workflow optimization, web architectures, and ecosystem leadership. Designing automated devices and full-stack software pipelines.
                </p>

                <div className="pt-6 flex flex-col items-center gap-8">
                  <button
                    onClick={() => document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group relative px-6 py-3.5 bg-transparent border border-brand-blue/30 text-xs font-display font-bold uppercase tracking-widest text-white rounded-lg hover:border-brand-blue transition-colors duration-300 cursor-pointer glow-blue"
                  >
                    <span className="absolute inset-0 rounded-lg bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    Scroll to Begin the Journey
                  </button>

                  {/* Pulsing scroll hint */}
                  <motion.div 
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 cursor-pointer transition-opacity"
                    onClick={() => document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Glide Forward</span>
                    <ChevronDown className="w-4 h-4 text-brand-blue" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* STAGE 2: TRAVELING THROUGH PROJECTS */}
          <div ref={projectsSectionRef} id="journey-section" className="relative h-[250vh] w-full">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 overflow-hidden">
              
              {/* Floating Section Title - Background text */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none z-0">
                <span className="text-[10px] font-mono tracking-widest text-brand-blue uppercase">
                  Telemetry Segment 02
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white/5 uppercase tracking-wider mt-1">
                  Architectural Archives
                </h2>
              </div>

              {/* Category Filter Buttons */}
              <div className="absolute top-44 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-1.5 py-1 rounded-full bg-cyber-gray/60 border border-white/5 backdrop-blur-md">
                {(['All', 'IoT', 'Full-Stack'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => selectAndScroll(cat)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                      activeHighlight === cat
                        ? 'bg-brand-blue/25 text-brand-blue border border-brand-blue/30'
                        : 'text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Bento-style Project Grid Container */}
              <motion.div
                style={{ 
                  opacity: gridOpacity, 
                  scale: gridScale, 
                  y: gridTranslateY,
                  pointerEvents: gridPointerEvents
                }}
                className="w-full max-w-6xl relative z-10 px-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects
                    .filter((project) => selectedCategory === 'All' || getProjectCategory(project) === selectedCategory)
                    .map((project, idx) => (
                      <ProjectCard 
                        key={project.id}
                        project={project} 
                        colorTheme={idx % 2 === 0 ? "emerald" : "blue"} 
                        isAdmin={isAdmin} 
                        onUpdate={handleUpdateProject} 
                      />
                    ))}
                </div>
              </motion.div>

            </div>
          </div>

          {/* STAGE 3: TRAVELING THROUGH LEADERSHIP & IMPACT */}
          <div ref={impactSectionRef} id="impact-section" className="relative h-[250vh] w-full">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 overflow-hidden">
              
              {/* Section Header HUD */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none z-0">
                <span className="text-[10px] font-mono tracking-widest text-brand-emerald uppercase">
                  Telemetry Segment 03
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white/5 uppercase tracking-wider mt-1">
                  Ecosystem Mobilization
                </h2>
              </div>

              {/* SLIDE A: Ecosystem Management (IIC & EDC) */}
              <motion.div
                style={{ 
                  opacity: lAOpacity, 
                  scale: lAScale, 
                  y: lAY,
                  pointerEvents: lAPointerEvents
                }}
                className="w-full max-w-5xl absolute z-10"
              >
                <div className="space-y-4 text-center">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-6">
                    Ecosystem Management
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {leadershipRoles?.[0] && (
                      <LeadershipCard 
                        role={leadershipRoles[0]} 
                        index={0} 
                        isAdmin={isAdmin} 
                        onUpdate={handleUpdateLeadershipRole} 
                      />
                    )}
                    {leadershipRoles?.[1] && (
                      <LeadershipCard 
                        role={leadershipRoles[1]} 
                        index={1} 
                        isAdmin={isAdmin} 
                        onUpdate={handleUpdateLeadershipRole} 
                      />
                    )}
                  </div>
                </div>
              </motion.div>

              {/* SLIDE B: Community Footprint (KKEM, Bridgegap) */}
              <motion.div
                style={{ 
                  opacity: lBOpacity, 
                  scale: lBScale, 
                  y: lBY,
                  pointerEvents: lBPointerEvents
                }}
                className="w-full max-w-5xl absolute z-10"
              >
                <div className="space-y-4 text-center">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-6">
                    Community Footprint & Outreach
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {leadershipRoles?.[2] && (
                      <LeadershipCard 
                        role={leadershipRoles[2]} 
                        index={2} 
                        isAdmin={isAdmin} 
                        onUpdate={handleUpdateLeadershipRole} 
                      />
                    )}
                    {leadershipRoles?.[3] && (
                      <LeadershipCard 
                        role={leadershipRoles[3]} 
                        index={3} 
                        isAdmin={isAdmin} 
                        onUpdate={handleUpdateLeadershipRole} 
                      />
                    )}
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* STAGE 4: HISTORICAL ACADEMIC LEDGER */}
          <div ref={academicsSectionRef} id="academics-section" className="relative h-[200vh] w-full">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 overflow-hidden">
              
              {/* Section Header HUD */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none z-0">
                <span className="text-[10px] font-mono tracking-widest text-brand-blue uppercase">
                  Telemetry Segment 04
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white/5 uppercase tracking-wider mt-1">
                  Historical Academic Ledger
                </h2>
              </div>

              {/* SLIDE A: Node 1 & 2 (Primary and Secondary) */}
              <motion.div
                style={{ 
                  opacity: acadAOpacity, 
                  scale: acadAScale, 
                  y: acadAY,
                  pointerEvents: acadAPointerEvents
                }}
                className="w-full max-w-4xl absolute z-10"
              >
                <div className="space-y-4 text-center">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-6">
                    Foundational Educational Track
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    
                    {/* Milestone 01 */}
                    <div className="holo-glass p-6 rounded-2xl border border-white/[0.06] text-left relative overflow-hidden group hover:border-brand-blue/30 transition-all duration-300">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <span className="font-mono text-5xl font-bold text-brand-blue">01</span>
                      </div>
                      <span className="inline-block px-2.5 py-1 rounded bg-brand-blue/10 border border-brand-blue/20 text-[9px] font-mono text-brand-blue uppercase tracking-widest mb-4">
                        Primary Education
                      </span>
                      <h4 className="font-display text-lg font-bold text-white mb-1">
                        1st to 7th Grade
                      </h4>
                      <p className="font-mono text-[10px] text-gray-500 mb-3 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Vimal Jyothi Public School CBSE
                      </p>
                      <p className="font-sans text-sm text-gray-300 leading-relaxed">
                        Mlamala, Vandiperiyar, Peermade, Idukki.
                      </p>
                    </div>

                    {/* Milestone 02 */}
                    <div className="holo-glass p-6 rounded-2xl border border-white/[0.06] text-left relative overflow-hidden group hover:border-brand-blue/30 transition-all duration-300">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <span className="font-mono text-5xl font-bold text-brand-blue">02</span>
                      </div>
                      <span className="inline-block px-2.5 py-1 rounded bg-brand-blue/10 border border-brand-blue/20 text-[9px] font-mono text-brand-blue uppercase tracking-widest mb-4">
                        Secondary Foundation
                      </span>
                      <h4 className="font-display text-lg font-bold text-white mb-1">
                        7th to 10th Grade
                      </h4>
                      <p className="font-mono text-[10px] text-gray-500 mb-3 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        B.C Grace Garden Public School CBSE
                      </p>
                      <p className="font-sans text-sm text-gray-300 leading-relaxed">
                        Mattukatta, Ayyappankovil, Idukki.
                      </p>
                    </div>

                  </div>
                </div>
              </motion.div>

              {/* SLIDE B: Node 3 & 4 (Higher Secondary & Undergraduate) */}
              <motion.div
                style={{ 
                  opacity: acadBOpacity, 
                  scale: acadBScale, 
                  y: acadBY,
                  pointerEvents: acadBPointerEvents
                }}
                className="w-full max-w-4xl absolute z-10"
              >
                <div className="space-y-4 text-center">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-6">
                    Advanced Academics & Current Vector
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    
                    {/* Milestone 03 */}
                    <div className="holo-glass p-6 rounded-2xl border border-white/[0.06] text-left relative overflow-hidden group hover:border-brand-blue/30 transition-all duration-300">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <span className="font-mono text-5xl font-bold text-brand-blue">03</span>
                      </div>
                      <span className="inline-block px-2.5 py-1 rounded bg-brand-blue/10 border border-brand-blue/20 text-[9px] font-mono text-brand-blue uppercase tracking-widest mb-4">
                        Higher Secondary
                      </span>
                      <h4 className="font-display text-lg font-bold text-white mb-1">
                        11th & 12th Grade
                      </h4>
                      <p className="font-mono text-[10px] text-gray-500 mb-3 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        St. Philomina's Higher Secondary School
                      </p>
                      <p className="font-sans text-sm text-gray-300 leading-relaxed">
                        Upputhara, Idukki.
                      </p>
                    </div>

                    {/* Milestone 04 */}
                    <div className="holo-glass p-6 rounded-2xl border border-brand-emerald/20 bg-brand-emerald/[0.02] text-left relative overflow-hidden group hover:border-brand-emerald/40 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,136,0.05)]">
                      <div className="absolute top-0 right-0 p-3 opacity-20">
                        <span className="font-mono text-5xl font-bold text-brand-emerald animate-pulse">04</span>
                      </div>
                      <span className="inline-block px-2.5 py-1 rounded bg-brand-emerald/10 border border-brand-emerald/20 text-[9px] font-mono text-brand-emerald uppercase tracking-widest mb-4 animate-pulse">
                        Current Vector (Highlight State)
                      </span>
                      <h4 className="font-display text-lg font-bold text-white mb-1 [text-shadow:0_0_10px_rgba(255,255,255,0.15)]">
                        Undergraduate (B.Tech)
                      </h4>
                      <p className="font-mono text-[10px] text-brand-emerald mb-3 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 animate-spin" />
                        Mar Baselios Christian College of Engineering & Technology
                      </p>
                      <p className="font-sans text-sm text-gray-200 leading-relaxed">
                        Currently pursuing Computer Science and Engineering at Peermade, Idukki.
                      </p>
                    </div>

                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* STAGE 5: TECHNICAL STACK & CREDENTIAL HUB */}
          <div ref={credentialsSectionRef} id="credentials-section" className="relative h-[160vh] w-full">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 overflow-hidden">
              <motion.div
                style={{ opacity: credsOpacity, scale: credsScale }}
                className="w-full absolute z-10"
              >
                <TechStackDashboard />
              </motion.div>
            </div>
          </div>

          {/* STAGE 5: FINAL DESTINATION (CONTACT TERMINAL) */}
          <div id="contact-section" className="relative min-h-screen w-full pt-32 pb-16 px-6 flex flex-col justify-between items-center z-20">
            <div className="w-full flex-1 flex flex-col items-center justify-center">
              <div className="text-center max-w-xl mb-12">
                <span className="text-[10px] font-mono tracking-widest text-brand-blue uppercase">
                  Secure Connection Established
                </span>
                <h2 className="font-display text-4xl font-extrabold text-white mt-1">
                  Contact Terminal
                </h2>
                <p className="text-sm text-gray-400 mt-2">
                  Initiate sync with Anandhu Krishnan. Send a diagnostic ping or professional request.
                </p>
              </div>

              <ContactForm />

              <div className="w-full max-w-xl relative z-30 mx-auto px-4 flex justify-center">
                <ResidentialLocation />
              </div>

              {/* Social Configuration links */}
              <div className="mt-10 flex flex-col items-center gap-3 relative z-30">
                <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                  // FOLLOW US ON
                </span>
                <div className="flex flex-wrap items-center justify-center gap-8">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => audioSystem.playClickBeep()}
                    className="text-[11px] font-mono tracking-widest text-gray-400 hover:text-brand-blue hover:[text-shadow:0_0_8px_rgba(0,240,255,0.7)] transition-all duration-300 uppercase cursor-pointer"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://github.com/anandhu-krishnan"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => audioSystem.playClickBeep()}
                    className="text-[11px] font-mono tracking-widest text-gray-400 hover:text-brand-emerald hover:[text-shadow:0_0_8px_rgba(0,255,136,0.7)] transition-all duration-300 uppercase cursor-pointer"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => audioSystem.playClickBeep()}
                    className="text-[11px] font-mono tracking-widest text-gray-400 hover:text-brand-blue hover:[text-shadow:0_0_8px_rgba(0,240,255,0.7)] transition-all duration-300 uppercase cursor-pointer"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Cinematic Footer */}
            <div className="w-full max-w-6xl mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] text-gray-500">
              <button 
                onClick={() => {
                  audioSystem.playClickBeep();
                  setIsAdminConsoleOpen(true);
                }}
                className="hover:text-brand-blue cursor-pointer transition-colors"
              >
                SYSTEM STATE: {isAdmin ? 'OVERRIDE_GRANTED' : 'EXECUTED_WITHOUT_WARNINGS'}
              </button>
              <span className="text-white/40">Built with precision. © 2026 Anandhu Krishnan.</span>
              <span>ENCRYPTION: {isAdmin ? 'DECRYPTED_OVERRIDE' : 'TLS_1.3'}</span>
            </div>
          </div>

        </div>
      ) : (
        /* ========================================================= */
        /*                    MOBILE SCROLL FLOW                     */
        /* ========================================================= */
        <div className="w-full px-4 pt-24 pb-12 space-y-24 relative z-10">
          
          {/* Mobile Hero */}
          <section id="home-section" className="min-h-[80vh] flex flex-col justify-center text-center space-y-6 pt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-gray border border-white/5 w-fit mx-auto">
              <Cpu className="w-3.5 h-3.5 text-brand-emerald" />
              <span className="text-[9px] font-mono tracking-widest uppercase text-gray-400">
                Operations Profile // Anandhu Krishnan
              </span>
            </div>

            <h1 className="font-display font-extrabold text-4xl leading-tight text-white">
              Engineering systems.<br />
              <span className="bg-gradient-to-r from-brand-blue to-brand-emerald bg-clip-text text-transparent">
                Building communities.
              </span>
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed">
              Computer Science student specializing in AI workflow optimization, web architectures, and ecosystem leadership. Designing automated systems and full-stack canteen pipelines.
            </p>

            <button
              onClick={() => {
                audioSystem.playClickBeep();
                document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-cyber-gray border border-brand-blue/30 text-[11px] font-display font-medium uppercase tracking-widest text-white rounded-lg mx-auto"
            >
              Begin Journey
            </button>
          </section>

          {/* Mobile Projects */}
          <section id="journey-section" className="space-y-10">
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest text-brand-blue uppercase">Segment 02</span>
              <h2 className="text-3xl font-display font-bold text-white mt-1">Projects</h2>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex justify-center gap-2 px-1.5 py-1 rounded-full bg-cyber-gray/40 border border-white/5 w-fit mx-auto">
              {(['All', 'IoT', 'Full-Stack'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    audioSystem.playClickBeep();
                    setSelectedCategory(cat);
                  }}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-brand-blue/25 text-brand-blue border border-brand-blue/30'
                      : 'text-gray-400 hover:text-white border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {projects
                .filter((project) => selectedCategory === 'All' || getProjectCategory(project) === selectedCategory)
                .map((project, idx) => (
                  <ProjectCard 
                    key={project.id}
                    project={project} 
                    colorTheme={idx % 2 === 0 ? "emerald" : "blue"} 
                    isAdmin={isAdmin} 
                    onUpdate={handleUpdateProject} 
                  />
                ))}
            </div>
          </section>

          {/* Mobile Impact & Leadership */}
          <section id="impact-section" className="space-y-10">
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest text-brand-emerald uppercase">Segment 03</span>
              <h2 className="text-3xl font-display font-bold text-white mt-1">Leadership</h2>
            </div>

            <div className="space-y-6">
              {leadershipRoles?.[0] && (
                <LeadershipCard 
                  role={leadershipRoles[0]} 
                  index={0} 
                  isAdmin={isAdmin} 
                  onUpdate={handleUpdateLeadershipRole} 
                />
              )}
              {leadershipRoles?.[1] && (
                <LeadershipCard 
                  role={leadershipRoles[1]} 
                  index={1} 
                  isAdmin={isAdmin} 
                  onUpdate={handleUpdateLeadershipRole} 
                />
              )}
              {leadershipRoles?.[2] && (
                <LeadershipCard 
                  role={leadershipRoles[2]} 
                  index={2} 
                  isAdmin={isAdmin} 
                  onUpdate={handleUpdateLeadershipRole} 
                />
              )}
              {leadershipRoles?.[3] && (
                <LeadershipCard 
                  role={leadershipRoles[3]} 
                  index={3} 
                  isAdmin={isAdmin} 
                  onUpdate={handleUpdateLeadershipRole} 
                />
              )}
            </div>
          </section>

          {/* Mobile Academic History */}
          <section id="academics-section" className="space-y-10">
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest text-brand-blue uppercase">Segment 04</span>
              <h2 className="text-3xl font-display font-bold text-white mt-1">Academic History</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  id: '01',
                  phase: 'Primary Education',
                  range: '1st to 7th Grade',
                  details: 'Vimal Jyothi Public School CBSE, Mlamala, Vandiperiyar, Peermade, Idukki.',
                  active: false
                },
                {
                  id: '02',
                  phase: 'Secondary Foundation',
                  range: '7th to 10th Grade',
                  details: 'B.C Grace Garden Public School CBSE, Mattukatta, Ayyappankovil, Idukki.',
                  active: false
                },
                {
                  id: '03',
                  phase: 'Higher Secondary',
                  range: '11th & 12th Grade',
                  details: "St. Philomina's Higher Secondary School, Upputhara, Idukki.",
                  active: false
                },
                {
                  id: '04',
                  phase: 'Undergraduate (B.Tech)',
                  range: 'Current Vector',
                  details: 'Computer Science and Engineering at Mar Baselios Christian College of Engineering and Technology, Peermade, Idukki.',
                  active: true
                }
              ].map((node) => (
                <div 
                  key={node.id} 
                  className={`holo-glass p-5 rounded-xl border relative overflow-hidden text-left ${
                    node.active 
                      ? 'border-brand-emerald/30 bg-brand-emerald/[0.01]' 
                      : 'border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      node.active ? 'text-brand-emerald' : 'text-brand-blue'
                    }`}>
                      <Calendar className={`w-3.5 h-3.5 ${node.active ? 'animate-pulse' : ''}`} />
                      Node {node.id} // {node.phase}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500">
                      {node.range}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    {node.details}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Mobile Tech & Credentials */}
          <section id="credentials-section" className="space-y-10">
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest text-brand-blue uppercase">Segment 05</span>
              <h2 className="text-3xl font-display font-bold text-white mt-1">Credentials</h2>
            </div>
            
            <TechStackDashboard />
          </section>

          {/* Mobile Contact */}
          <section id="contact-section" className="space-y-10 pt-10">
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest text-brand-emerald uppercase">Segment 06</span>
              <h2 className="text-3xl font-display font-bold text-white mt-1">Get In Touch</h2>
            </div>

            <ContactForm />

            <div className="w-full max-w-xl mx-auto px-1 relative z-30 flex justify-center">
              <ResidentialLocation />
            </div>

            {/* Social Configuration links */}
            <div className="pt-4 flex flex-col items-center gap-2">
              <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">
                // FOLLOW US ON
              </span>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audioSystem.playClickBeep()}
                  className="text-[10px] font-mono tracking-widest text-gray-400 hover:text-brand-blue hover:[text-shadow:0_0_8px_rgba(0,240,255,0.7)] transition-all duration-300 uppercase cursor-pointer"
                >
                  Instagram
                </a>
                <a
                  href="https://github.com/anandhu-krishnan"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audioSystem.playClickBeep()}
                  className="text-[10px] font-mono tracking-widest text-gray-400 hover:text-brand-emerald hover:[text-shadow:0_0_8px_rgba(0,255,136,0.7)] transition-all duration-300 uppercase cursor-pointer"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audioSystem.playClickBeep()}
                  className="text-[10px] font-mono tracking-widest text-gray-400 hover:text-brand-blue hover:[text-shadow:0_0_8px_rgba(0,240,255,0.7)] transition-all duration-300 uppercase cursor-pointer"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="pt-8 border-t border-white/[0.04] text-center font-mono text-[9px] text-gray-500 space-y-1">
              <p>Anandhu Krishnan Portfolio © 2026</p>
              <button 
                onClick={() => {
                  audioSystem.playClickBeep();
                  setIsAdminConsoleOpen(true);
                }}
                className="hover:text-brand-blue cursor-pointer transition-colors block mx-auto text-center font-mono text-[9px]"
              >
                SYSTEM CODE: {isAdmin ? 'OVERRIDE_GRANTED' : 'SUCCESS_TELEMETRY'}
              </button>
            </div>
          </section>

        </div>
      )}

      {/* Administrative Terminal Control Gateway */}
      <AdminConsole 
        isOpen={isAdminConsoleOpen} 
        onClose={() => setIsAdminConsoleOpen(false)} 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
        onResetData={handleResetData} 
      />
    </div>
  );
}
