import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Github, Mail, Linkedin, Star, Hammer, RefreshCcw, Code2, Trophy } from 'lucide-react';
import Matter from 'matter-js';

// --- PHYSICS CONSTANTS ---
const THICKNESS = 100;

const PhysicsBox = ({ id, children, isSmashed, engine, smashMode }) => {
  const domRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (isSmashed && !bodyRef.current && domRef.current) {
      // 1. Get exact position of the element before smashing
      const rect = domRef.current.getBoundingClientRect();
      
      // 2. Create Physics Body at that position
      const body = Matter.Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        {
          restitution: 0.6,
          friction: 0.5,
          frictionAir: 0.02,
          chamfer: { radius: 0 }, // Sharp corners
        }
      );

      // 3. Add to world
      bodyRef.current = body;
      Matter.World.add(engine.world, body);

      // 4. Sync Loop (Syncs DOM position to Physics Body)
      const update = () => {
        if (!bodyRef.current || !domRef.current) return;
        
        const { x, y } = bodyRef.current.position;
        const angle = bodyRef.current.angle;
        
        // We use translate3d for high performance (60fps)
        domRef.current.style.transform = `translate3d(${x - rect.left - rect.width / 2}px, ${y - rect.top - rect.height / 2}px, 0) rotate(${angle}rad)`;
        requestAnimationFrame(update);
      };
      
      requestAnimationFrame(update);
    }
  }, [isSmashed, engine]);

  return (
    <div
      ref={domRef}
      className={`transition-shadow duration-300 
        ${isSmashed ? 'fixed z-[8888] pointer-events-auto touch-none' : 'relative'}
        ${smashMode && !isSmashed ? 'cursor-[url("https://cur.cursors-4u.net/symbols/sym-1/sym10.cur"),_pointer] hover:scale-[1.02]' : ''}
      `}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
};

export default function App() {
  const [smashMode, setSmashMode] = useState(false);
  const [smashedIds, setSmashedIds] = useState(new Set());
  
  // Create Physics Engine once
  const engine = useMemo(() => Matter.Engine.create(), []);
  const world = engine.world;

  useEffect(() => {
    // 1. Create Runner
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // 2. Add Boundaries (Floor, Left, Right)
    const floor = Matter.Bodies.rectangle(
      window.innerWidth / 2, window.innerHeight + THICKNESS / 2, 
      window.innerWidth * 2, THICKNESS, { isStatic: true }
    );
    const leftWall = Matter.Bodies.rectangle(
      -THICKNESS / 2, window.innerHeight / 2, 
      THICKNESS, window.innerHeight * 2, { isStatic: true }
    );
    const rightWall = Matter.Bodies.rectangle(
      window.innerWidth + THICKNESS / 2, window.innerHeight / 2, 
      THICKNESS, window.innerHeight * 2, { isStatic: true }
    );
    Matter.World.add(world, [floor, leftWall, rightWall]);

    // 3. Add Mouse Interaction
    const mouse = Matter.Mouse.create(document.body);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Matter.World.add(world, mouseConstraint);

    return () => {
      Matter.Engine.clear(engine);
      Matter.Runner.stop(runner);
    };
  }, [engine, world]);

  const toggleSmash = (id) => {
    if (smashMode) setSmashedIds(prev => new Set(prev).add(id));
  };

  const reset = () => {
    window.location.reload(); // Simplest way to clear physics state and DOM
  };

  return (
    <div className={`min-h-screen bg-neo-bg text-neo-black p-6 md:p-12 selection:bg-neo-accent selection:text-white transition-colors ${smashMode ? 'bg-orange-50' : ''}`}>
      
      {/* FLOATING HAMMER */}
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-4">
        {smashedIds.size > 0 && (
          <button onClick={reset} className="bg-neo-black text-white border-4 border-black p-4 shadow-neo-md hover:-translate-y-1 active:translate-y-0 transition-all font-black uppercase flex items-center gap-2">
            <RefreshCcw size={20} /> Repair Site
          </button>
        )}
        <button 
          onClick={() => setSmashMode(!smashMode)}
          className={`w-20 h-20 rounded-full border-4 border-black flex items-center justify-center shadow-neo-lg transition-all active:shadow-none active:translate-x-1 active:translate-y-1 
            ${smashMode ? 'bg-neo-accent animate-bounce' : 'bg-neo-secondary hover:rotate-12'}`}
        >
          <Hammer size={32} fill={smashMode ? "white" : "black"} />
        </button>
      </div>

      {/* HEADER SECTION */}
      <header className="max-w-7xl mx-auto mb-16">
        <div onClick={() => toggleSmash('title')}>
          <PhysicsBox id="title" isSmashed={smashedIds.has('title')} engine={engine} smashMode={smashMode}>
            <h1 className="text-7xl md:text-[10rem] font-black uppercase leading-[0.8] mb-12 tracking-tighter">
              VAIBHAV <br /> <span className="text-neo-accent">VERMA</span>
            </h1>
          </PhysicsBox>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div onClick={() => toggleSmash('about')}>
            <PhysicsBox id="about" isSmashed={smashedIds.has('about')} engine={engine} smashMode={smashMode}>
              <div className="border-4 border-black bg-white p-8 shadow-neo-md h-full min-h-[250px]">
                <h2 className="text-3xl font-black uppercase mb-4 underline decoration-neo-accent decoration-8">About</h2>
                <p className="font-bold text-xl leading-tight">CSE Student. Builder of chaotic interfaces and robust backends. Passionate about 2D physics and neo-brutalism.</p>
              </div>
            </PhysicsBox>
          </div>

          <div onClick={() => toggleSmash('edu')}>
            <PhysicsBox id="edu" isSmashed={smashedIds.has('edu')} engine={engine} smashMode={smashMode}>
              <div className="border-4 border-black bg-neo-muted p-8 shadow-neo-md h-full min-h-[250px]">
                <h2 className="text-3xl font-black uppercase mb-4">Education</h2>
                <div className="space-y-2">
                  <p className="font-black text-5xl">9.2</p>
                  <p className="font-bold text-sm uppercase tracking-widest">B.Tech CGPA</p>
                  <p className="font-bold mt-4 border-t-2 border-black pt-2">Tech University '25</p>
                </div>
              </div>
            </PhysicsBox>
          </div>

          <div onClick={() => toggleSmash('skills')}>
            <PhysicsBox id="skills" isSmashed={smashedIds.has('skills')} engine={engine} smashMode={smashMode}>
              <div className="border-4 border-black bg-neo-secondary p-8 shadow-neo-md h-full min-h-[250px]">
                <h2 className="text-3xl font-black uppercase mb-4 flex gap-2"><Code2 /> Skills</h2>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['React', 'Go', 'Redis', 'Docker', 'AWS'].map(s => (
                    <span key={s} className="bg-white border-2 border-black px-2 py-1 font-black uppercase text-xs shadow-[2px_2px_0px_0px_#000]">{s}</span>
                  ))}
                </div>
              </div>
            </PhysicsBox>
          </div>
        </div>
      </header>

      {/* PROJECTS SECTION */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
        {[1, 2, 3, 4].map(i => (
          <div key={i} onClick={() => toggleSmash(`proj-${i}`)}>
            <PhysicsBox id={`proj-${i}`} isSmashed={smashedIds.has(`proj-${i}`)} engine={engine} smashMode={smashMode}>
              <div className={`border-4 border-black ${i % 2 === 0 ? 'bg-neo-black text-white' : 'bg-white'} p-0 shadow-neo-lg group`}>
                 <div className="h-48 bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center border-b-4 border-black group-hover:bg-neo-accent transition-colors">
                    <Star size={64} className="animate-spin-slow fill-current" />
                 </div>
                 <div className="p-8">
                  <h3 className="text-4xl font-black uppercase mb-4">Project_00{i}</h3>
                  <p className="font-bold opacity-80 mb-6">A fully decentralized architecture for real-time data processing and visual debris generation.</p>
                  <div className="flex gap-4">
                    <Github size={24} />
                    <Linkedin size={24} />
                  </div>
                 </div>
              </div>
            </PhysicsBox>
          </div>
        ))}
      </section>

      {/* EXPERIENCE / BADGES */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
         <div onClick={() => toggleSmash('exp')}>
            <PhysicsBox id="exp" isSmashed={smashedIds.has('exp')} engine={engine} smashMode={smashMode}>
              <div className="border-4 border-black bg-white p-6 shadow-neo-md">
                <Trophy size={40} className="mb-4 text-neo-accent" />
                <h3 className="text-2xl font-black uppercase mb-2">Google Summer of Code</h3>
                <p className="font-bold">Contributed to core physics modules in open source projects.</p>
              </div>
            </PhysicsBox>
         </div>
      </section>

      <footer className="text-center font-black uppercase text-2xl py-20 border-t-8 border-black">
        VAIBHAV.DEV // 2024
      </footer>
    </div>
  );
}