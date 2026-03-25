import React, { useState, useEffect, useRef } from 'react';
import { Github, Mail, Linkedin, ExternalLink, Award, Code2, Briefcase, GraduationCap, Star, Layers, Database, Wrench, Cloud, LayoutTemplate, Cpu, Users } from 'lucide-react';
import mypic from './assets/mypic.jpeg';
import barcCert from './assets/Certificates/BARCCertificate.jpeg';
import biCert from './assets/Certificates/Summer Training Completion Certificate Vaibhav Verma_page-0001.jpg';
import cvPdf from './assets/Certificates/VVGenCV2.pdf';
import certDSAUdemy from './assets/Certificates/Mastering DSA.jpg';
import certOOP from './assets/Certificates/OOP neocolab_page-0001.jpg';
import certDSANeo from './assets/Certificates/DSA neocolab_page-0001.jpg';
import certNetFund from './assets/Certificates/The Bits and Bytes of Computer Networking_page-0001.jpg';
import certCpp from './assets/Certificates/learn C++.jpg';
import certPacket from './assets/Certificates/Packet Switching Networks and Algorithms_page-0001.jpg';
import certP2P from './assets/Certificates/Peer-to-Peer Protocols and Local Area Networks_page-0001.jpg';
import certTCPIP from './assets/Certificates/TCP IP and Advanced Topics_page-0001.jpg';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
const NeoCard = ({ children, className = "", bgColor = "bg-white", shadowSize = "shadow-neo-md" }) => (
  <div className={`border-4 border-black ${bgColor} ${shadowSize} p-6 transition-all hover:-translate-y-1 hover:shadow-neo-lg ${className}`}>
    {children}
  </div>
);

const NeoButton = ({ children, className = "", color = "bg-neo-accent" }) => (
  <button className={`border-4 border-black ${color} px-6 py-2 font-black uppercase tracking-tight shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${className}`}>
    {children}
  </button>
);

const Badge = ({ text, color = "bg-neo-secondary", rotate = "rotate-0", className = "" }) => (
  <span className={`inline-block border-2 border-black ${color} px-3 py-1 text-sm font-bold uppercase tracking-widest ${rotate} shadow-[2px_2px_0px_0px_#000] ${className}`}>
    {text}
  </span>
);

/* Certificate button: hover = image preview tooltip, click = open in new tab */
const CertButton = ({ certImage, label = "View Certificate" }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative inline-block">
      <a
        href={certImage}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="inline-flex items-center gap-2 border-4 border-black bg-neo-secondary px-5 py-2 font-black uppercase tracking-tight text-sm shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all select-none"
      >
        <Award className="w-4 h-4" />
        {label}
      </a>
      {/* Image preview tooltip */}
      {hovered && (
        <div
          className="absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          style={{ minWidth: 240 }}
        >
          <div className="border-4 border-black bg-white shadow-neo-md overflow-hidden">
            <img
              src={certImage}
              alt="Certificate preview"
              className="w-60 h-40 object-cover block"
            />
            <p className="text-center font-black uppercase text-xs tracking-widest py-2 px-3 border-t-4 border-black bg-neo-secondary">
              {label}
            </p>
          </div>
          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-black" />
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Side navigation ── */
const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'stats', label: 'Stats' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'internships', label: 'Internships' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'extracurricular', label: 'Extra' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const SideNav = () => {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const observers = [];
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="side-nav" aria-label="Page sections">
      <div className="side-nav-track">
        {NAV_ITEMS.map(({ id, label }, i) => (
          <div key={id} className="side-nav-item">
            {/* Dashed line above (skip first) */}
            {i !== 0 && <div className="side-nav-line" />}
            <button
              onClick={() => scrollTo(id)}
              className={`side-nav-dot ${active === id ? 'active' : ''}`}
              aria-label={label}
            >
              <span className="side-nav-label">{label}</span>
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
};

/* ── Mini Pong Game (Experimental) ── */
const MiniPong = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let ball = { x: canvas.width / 2, y: 30, dx: 3.5, dy: 3.5, radius: 7 };
    let paddle = { x: canvas.width / 2 - 35, y: canvas.height - 20, width: 70, height: 10 };

    let rightPressed = false;
    let leftPressed = false;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#FF6B6B';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();

      // Draw paddle
      ctx.beginPath();
      ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
      ctx.fillStyle = '#FFD93D';
      ctx.fill();
      ctx.stroke();
      ctx.closePath();

      // Logic - Keyboard movement
      if (rightPressed) {
        paddle.x = Math.min(paddle.x + 5, canvas.width - paddle.width);
      } else if (leftPressed) {
        paddle.x = Math.max(paddle.x - 5, 0);
      }

      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collision (left, right, top)
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx = -ball.dx;
      if (ball.y - ball.radius < 0) ball.dy = -ball.dy;

      // Paddle collision
      if (
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
      ) {
        ball.dy = -ball.dy;
        // Shift ball slightly up to prevent clipping
        ball.y = paddle.y - ball.radius;

        // Slightly increase speed
        if (Math.abs(ball.dx) < 8) ball.dx *= 1.05;
        if (Math.abs(ball.dy) < 8) ball.dy *= 1.05;

        setScore(s => s + 1);
      }

      // Game over (falls off bottom)
      if (ball.y + ball.radius > canvas.height) {
        setIsPlaying(false);
        setGameOver(true);
        return;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Mouse Controls
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      let scaleX = canvas.width / rect.width;
      let mouseX = (e.clientX - rect.left) * scaleX;
      let newPaddleX = mouseX - paddle.width / 2;
      if (newPaddleX < 0) newPaddleX = 0;
      if (newPaddleX + paddle.width > canvas.width) newPaddleX = canvas.width - paddle.width;
      paddle.x = newPaddleX;
    };

    // Touch Controls
    const handleTouchMove = (e) => {
      // Prevent scrolling
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      let scaleX = canvas.width / rect.width;
      let touchX = (touch.clientX - rect.left) * scaleX;
      let newPaddleX = touchX - paddle.width / 2;
      if (newPaddleX < 0) newPaddleX = 0;
      if (newPaddleX + paddle.width > canvas.width) newPaddleX = canvas.width - paddle.width;
      paddle.x = newPaddleX;
    };

    // Smooth Keyboard Controls
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') rightPressed = true;
      if (e.key === 'ArrowLeft') leftPressed = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowRight') rightPressed = false;
      if (e.key === 'ArrowLeft') leftPressed = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (gameOver && score > highScore) setHighScore(score);
  }, [gameOver, score, highScore]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="border-4 border-black bg-neo-muted p-4 shadow-neo-md w-full max-w-[320px] transition-all flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-3 font-black uppercase text-sm tracking-widest px-1">
        <span>Score: {score}</span>
        <span>High: {highScore}</span>
      </div>

      <div className="relative w-full border-4 border-black shadow-neo-sm overflow-hidden bg-white">
        {/* Game Area */}
        <canvas
          ref={canvasRef}
          width={280}
          height={200}
          className="w-full h-auto cursor-none bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:16px_16px]"
          style={{ touchAction: 'none' }}
        />

        {/* Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            {gameOver && <p className="font-black text-neo-accent uppercase text-xl mb-2 animate-bounce flex items-center gap-2">Game Over</p>}
            <button
              onClick={startGame}
              className="w-full border-4 border-black bg-neo-accent text-white font-black uppercase py-2 shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md active:translate-y-[2px] active:shadow-none transition-all tracking-widest"
            >
              {gameOver ? 'Play Again' : 'Play Pong'}
            </button>
            <p className="text-[10px] font-bold uppercase mt-3 opacity-50 text-center leading-tight">
              Mouse, Touch, or<br />Arrows to move
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Portfolio() {
  const [carouselWidth, setCarouselWidth] = useState(0);
  const carouselRef = useRef(null);

  // Smooth inertial scrolling setup via Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard Apple-like easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // let native CSS handle mobile inertia
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      setCarouselWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('portfolio-dark-mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('portfolio-dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-neo-bg font-['Space_Grotesk'] text-neo-black p-4 md:p-8 selection:bg-neo-accent selection:text-white ${darkMode ? 'dark dark-transition' : 'dark-transition'}`}>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="dark-toggle"
        aria-label="Toggle dark mode"
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <SideNav />

      {/* --- HERO SECTION --- */}
      <header id="hero" className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 pt-10">
        <div className="lg:col-span-8 flex flex-col justify-center">
          <Badge text="Hi there! 👋" color="bg-neo-muted" rotate="-rotate-2" className="w-fit mb-6 !px-8" />
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-6">
            I'M <span className="text-neo-accent">Vaibhav</span> <br />
            <span className="bg-neo-secondary px-4 border-4 border-black inline-block rotate-1">Verma</span>
          </h1>
          <p className="text-2xl font-bold max-w-2xl mb-8 leading-tight">
            Aspiring Full-Stack & Software Developer | Game Dev Enthusiast
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={cvPdf} target="_blank" rel="noreferrer">
              <NeoButton color="bg-neo-accent">Download CV</NeoButton>
            </a>
            <div className="flex gap-4 items-center ml-4">
              <span className="neo-tooltip" data-tooltip="GitHub">
                <a href="https://github.com/Vaibhav-Verma21" target="_blank" rel="noreferrer"><Github className="w-8 h-8 cursor-pointer hover:text-neo-accent transition-colors" /></a>
              </span>
              <span className="neo-tooltip" data-tooltip="LinkedIn">
                <a href="https://www.linkedin.com/in/vaibhav2101/" target="_blank" rel="noreferrer"><Linkedin className="w-8 h-8 cursor-pointer hover:text-neo-accent transition-colors" /></a>
              </span>
              <span className="neo-tooltip" data-tooltip="Email">
                <a href="mailto:vaibhavverma2115@gmail.com"><Mail className="w-8 h-8 cursor-pointer hover:text-neo-accent transition-colors" /></a>
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 relative mt-16 lg:mt-0 flex justify-center">
          <div className="w-full max-w-[350px] lg:max-w-full border-8 border-black bg-neo-muted rotate-3 shadow-neo-lg overflow-hidden h-[400px]">
            {/* Photograph */}
            <div className="w-full h-full flex items-center justify-center">
              <img src={mypic} alt="Vaibhav Verma" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-24">

        {/* --- ABOUT --- */}
        <section id="about">
          <div>
            <h2 className="text-4xl font-black uppercase mb-8 underline decoration-neo-accent decoration-8 underline-offset-4">About Me</h2>
            <NeoCard className="leading-relaxed text-lg font-bold">
              I’m a Computer Science student who sees web development as more than just code—it's a creative medium. As a Full-Stack Developer, I enjoy crafting experiences that combine clean functionality with thoughtful design. Whether it’s building interactive interfaces, optimizing performance, or experimenting with unconventional ideas, I aim to create products that stand out.<br /><br />
              I’m driven by curiosity, constantly learning new tools and technologies, and turning ideas into real, usable experiences. For me, development isn’t just about making things work—it’s about making them feel right.            </NeoCard>
          </div>
        </section>

        {/* --- STATS --- */}
        <section id="stats">
          <h2 className="text-4xl font-black uppercase mb-8 underline decoration-neo-accent decoration-8 underline-offset-4">Stats</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* GitHub Streak — wider card */}
            <div className="lg:col-span-7 border-4 border-black bg-white p-6 shadow-neo-md overflow-hidden flex justify-center items-center min-h-[220px] hover:-translate-y-1 hover:shadow-neo-lg transition-all">
              <img src="https://github-readme-streak-stats.herokuapp.com/?user=Vaibhav-Verma21&theme=default&hide_border=true&background=ffffff&border=000&stroke=000&ring=000&fire=000&currStreakNum=000&currStreakLabel=000" alt="GitHub Streak" className="w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            {/* LeetCode Stats — narrower card */}
            <div className="lg:col-span-5 border-4 border-black bg-white p-6 shadow-neo-md overflow-hidden flex justify-center items-center min-h-[220px] hover:-translate-y-1 hover:shadow-neo-lg transition-all">
              <img src="https://leetcard.jacoblin.cool/vaibhavverma2115?theme=light&font=Space%20Grotesk&ext=activity" alt="LeetCode Stats" className="w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
          </div>
        </section>

        {/* --- SKILLS --- */}
        <section id="skills">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-4xl font-black uppercase underline decoration-neo-accent decoration-8 underline-offset-4">Skills & Technologies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            <NeoCard bgColor="bg-white" className="flex flex-col min-h-[220px]">
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="w-8 h-8 text-black" />
                <h3 className="text-xl font-black uppercase leading-none">Programming<br />Languages</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['C/C++', 'Java', 'JavaScript', 'PHP', 'Python'].map(s => <Badge key={s} text={s} color="bg-neo-muted border-black text-black" />)}
              </div>
            </NeoCard>

            <NeoCard bgColor="bg-neo-secondary" className="flex flex-col min-h-[220px]">
              <div className="flex items-center gap-3 mb-6">
                <Layers className="w-8 h-8 text-black" />
                <h3 className="text-xl font-black uppercase leading-none">Backend &<br />Frameworks</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['Express', 'LLM Integration', 'Node.js', 'PyTorch', 'Yii'].map(s => <Badge key={s} text={s} color="bg-white border-black text-black" />)}
              </div>
            </NeoCard>

            <NeoCard bgColor="bg-[#DBEAFE]" className="flex flex-col min-h-[220px]">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-8 h-8 text-black" />
                <h3 className="text-xl font-black uppercase leading-none">Databases</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['MongoDB', 'MySQL', 'SQL'].map(s => <Badge key={s} text={s} color="bg-white border-black text-black" />)}
              </div>
            </NeoCard>

            <NeoCard bgColor="bg-neo-muted" className="flex flex-col min-h-[220px]">
              <div className="flex items-center gap-3 mb-6">
                <Wrench className="w-8 h-8 text-black" />
                <h3 className="text-xl font-black uppercase leading-none">Tools &<br />Platforms</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['Figma', 'LaTeX', 'Postman', 'VS Code'].map(s => <Badge key={s} text={s} color="bg-white border-black text-black" />)}
              </div>
            </NeoCard>

            <NeoCard bgColor="bg-neo-accent" className="flex flex-col min-h-[220px] text-white">
              <div className="flex items-center gap-3 mb-6">
                <Cloud className="w-8 h-8 text-white" />
                <h3 className="text-xl font-black uppercase leading-none text-white">Cloud &<br />Deployment</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['Git', 'GitHub', 'Linux', 'Netlify', 'Vercel'].map(s => <Badge key={s} text={s} color="bg-black border-black text-white" />)}
              </div>
            </NeoCard>

            <NeoCard bgColor="bg-white" className="flex flex-col min-h-[220px]">
              <div className="flex items-center gap-3 mb-6">
                <LayoutTemplate className="w-8 h-8 text-black" />
                <h3 className="text-xl font-black uppercase leading-none">Frontend /<br />Web Tech</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['HTML/CSS', 'Next.js', 'Phaser.js', 'React.js', 'Tailwind'].map(s => <Badge key={s} text={s} color="bg-neo-secondary border-black text-black" />)}
              </div>
            </NeoCard>

            <NeoCard bgColor="bg-[#FCA5A5]" className="flex flex-col min-h-[220px]">
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="w-8 h-8 text-black" />
                <h3 className="text-xl font-black uppercase leading-none">Core<br />Concepts</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['DBMS', 'DSA', 'OOP', 'OS'].map(s => <Badge key={s} text={s} color="bg-white border-black text-black" />)}
              </div>
            </NeoCard>

            <NeoCard bgColor="bg-white" className="flex flex-col min-h-[220px]">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-black" />
                <h3 className="text-xl font-black uppercase leading-none">Soft Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['Adaptable', 'Problem Solving', 'Teamwork', 'Time Mgmt'].map(s => <Badge key={s} text={s} color="bg-neo-muted border-black text-black" />)}
              </div>
            </NeoCard>

          </div>
        </section>

        {/* --- PROJECTS --- */}
        <section id="projects">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-5xl font-black uppercase">Projects</h2>
            <a href="https://github.com/Vaibhav-Verma21" target="_blank" rel="noreferrer" className="font-black uppercase text-neo-accent border-b-4 border-neo-accent cursor-pointer hover:pb-2 transition-all">View All Github</a>
          </div>
          <div className="grid grid-cols-1 gap-10">
            {/* Trackr */}
            <NeoCard className="group flex flex-col md:flex-row gap-8 p-0 overflow-hidden relative">
              <div className="md:w-1/3 bg-[#DBEAFE] p-8 flex flex-col justify-center relative border-r-4 border-black">
                <div className="absolute top-4 right-4 text-black opacity-20 text-6xl">01</div>
                <h3 className="text-3xl font-black uppercase mb-2">Trackr</h3>
                <p className="font-bold mb-4">Nov 2025 - Dec 2025</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <Badge text="React" color="bg-white text-black border-black" />
                  <Badge text="Tailwind" color="bg-white text-black border-black" />
                  <Badge text="Node.js" color="bg-white text-black border-black" />
                  <Badge text="MongoDB" color="bg-white text-black border-black" />
                </div>
              </div>
              <div className="md:w-2/3 p-8 flex flex-col">
                <ul className="list-disc pl-5 font-bold space-y-3 mb-6">
                  <li>Built a full-stack task and workforce management platform enabling task assignment, tracking, filtering, and monitoring, improving visibility by ~45%.</li>
                  <li>Created responsive, role-based dashboards using React.js and Tailwind CSS with search, sorting, and attachments.</li>
                  <li>Engineered secure RESTful APIs with Node.js, Express.js, and MongoDB, implementing JWT-based auth and protected routes.</li>
                </ul>
                <div className="mt-auto self-end">
                  <a href="https://github.com/Vaibhav-Verma21/Trackr" target="_blank" rel="noreferrer" className="border-b-4 border-black uppercase font-black hover:pr-4 transition-all flex items-center gap-2"><ExternalLink className="w-5 h-5" /> Repo Link</a>
                </div>
              </div>
            </NeoCard>

            {/* EduSphere */}
            <NeoCard className="group flex flex-col md:flex-row gap-8 p-0 overflow-hidden relative">
              <div className="md:w-1/3 bg-neo-secondary p-8 flex flex-col justify-center relative border-r-4 border-black md:border-r-4">
                <div className="absolute top-4 right-4 text-black opacity-20 text-6xl">02</div>
                <h3 className="text-3xl font-black uppercase mb-2">EduSphere E-Learning</h3>
                <p className="font-bold mb-4">Mar 2025 - May 2025</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <Badge text="PHP" color="bg-white" />
                  <Badge text="MySQL" color="bg-white" />
                  <Badge text="HTML/CSS" color="bg-white" />
                </div>
              </div>
              <div className="md:w-2/3 p-8 flex flex-col">
                <ul className="list-disc pl-5 font-bold space-y-3 mb-6">
                  <li>Built a fully responsive e-learning platform with structured course delivery, video player, and smooth playback.</li>
                  <li>Built a dynamic review and rating system to improve course credibility and user decision-making.</li>
                  <li>Enabled secure premium course purchases by integrating the Razorpay Payment Gateway.</li>
                  <li>Designed accessible and theme-friendly UI using Tailwind CSS, including high-contrast modes.</li>
                </ul>
                <div className="mt-auto self-end">
                  <a href="https://github.com/Vaibhav-Verma21/Edusphere" target="_blank" rel="noreferrer" className="border-b-4 border-black uppercase font-black hover:pr-4 transition-all flex items-center gap-2"><ExternalLink className="w-5 h-5" /> Repo Link</a>
                </div>
              </div>
            </NeoCard>

            {/* AI Email Summarizer */}
            <NeoCard className="group flex flex-col md:flex-row gap-8 p-0 overflow-hidden relative mt-0">
              <div className="md:w-1/3 bg-neo-muted p-8 flex flex-col justify-center relative border-r-4 border-black">
                <div className="absolute top-4 right-4 text-black opacity-20 text-6xl">03</div>
                <h3 className="text-3xl font-black uppercase mb-2">AI Email Summarizer</h3>
                <p className="font-bold mb-4">Feb 2025 - Mar 2025</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <Badge text="Gemini API" color="bg-white" />
                  <Badge text="JS & Tailwind" color="bg-white" />
                </div>
              </div>
              <div className="md:w-2/3 p-8 flex flex-col">
                <ul className="list-disc pl-5 font-bold space-y-3 mb-6">
                  <li>Engineered an AI-powered email summarization tool that converts lengthy emails into concise bullet points.</li>
                  <li>Integrated Google Gemini API to extract tasks, deadlines, and perform sentiment analysis.</li>
                  <li>Added Google Calendar API integration to allow one-click creation of calendar tasks.</li>
                  <li>Deployed on Vercel with real-time processing to manage backend logic and cloud deployment.</li>
                </ul>
                <div className="mt-auto self-end flex gap-6">
                  <a href="https://email-summariser.vercel.app/" target="_blank" rel="noreferrer" className="border-b-4 border-black uppercase font-black hover:pr-4 transition-all flex items-center gap-2"><ExternalLink className="w-5 h-5" /> Live Link</a>
                  <a href="https://github.com/Vaibhav-Verma21/EmailSummariser" target="_blank" rel="noreferrer" className="border-b-4 border-black uppercase font-black hover:pr-4 transition-all flex items-center gap-2"><ExternalLink className="w-5 h-5" /> Repo Link</a>
                </div>
              </div>
            </NeoCard>

            {/* IPC Framework */}
            <NeoCard className="group flex flex-col md:flex-row gap-8 p-0 overflow-hidden relative">
              <div className="md:w-1/3 bg-neo-accent p-8 text-white flex flex-col justify-center relative border-r-4 border-black">
                <div className="absolute top-4 right-4 text-white opacity-20 text-6xl">04</div>
                <h3 className="text-3xl font-black uppercase mb-2">IPC Framework</h3>
                <p className="font-bold mb-4">Jan 2025 - Feb 2025</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <Badge text="C/C++" color="bg-white text-black border-black" />
                  <Badge text="Shared Memory" color="bg-white text-black border-black" />
                  <Badge text="OS Concepts" color="bg-white text-black border-black" />
                </div>
              </div>
              <div className="md:w-2/3 p-8 flex flex-col">
                <ul className="list-disc pl-5 font-bold space-y-3 mb-6">
                  <li>Built an Inter-Process Communication (IPC) simulation using shared memory to enable data exchange between processes.</li>
                  <li>Implemented synchronization techniques to ensure safe concurrent access and prevent race conditions.</li>
                  <li>Simulated real-world OS behavior involving process coordination and communication.</li>
                </ul>
                <div className="mt-auto self-end">
                  <a href="https://github.com/Vaibhav-Verma21/Inter-Process-Communication-Framework" target="_blank" rel="noreferrer" className="border-b-4 border-black uppercase font-black hover:pr-4 transition-all flex items-center gap-2"><ExternalLink className="w-5 h-5" /> Repo Link</a>
                </div>
              </div>
            </NeoCard>

            {/* TravBlog */}
            <NeoCard className="group flex flex-col md:flex-row gap-8 p-0 overflow-hidden relative">
              <div className="md:w-1/3 bg-neo-secondary p-8 flex flex-col justify-center relative border-r-4 border-black">
                <div className="absolute top-4 right-4 text-black opacity-20 text-6xl">05</div>
                <h3 className="text-3xl font-black uppercase mb-2">TravBlog</h3>
                <p className="font-bold mb-4">Sep 2023 - Oct 2023</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <Badge text="HTML" color="bg-white text-black border-black" />
                  <Badge text="CSS" color="bg-white text-black border-black" />
                  <Badge text="SwiperJS" color="bg-white text-black border-black" />
                </div>
              </div>
              <div className="md:w-2/3 p-8 flex flex-col">
                <ul className="list-disc pl-5 font-bold space-y-3 mb-6">
                  <li>Designed and developed a visually engaging travel blogging webpage with a clean, responsive layout.</li>
                  <li>Integrated SwiperJS to implement smooth, touch-friendly scroll-based navigation for blog sections.</li>
                  <li>Crafted a modern UI with custom CSS styling, dynamic image galleries, and mobile-first design principles.</li>
                </ul>
                <div className="mt-auto self-end">
                  <a href="https://github.com/Vaibhav-Verma21" target="_blank" rel="noreferrer" className="border-b-4 border-black uppercase font-black hover:pr-4 transition-all flex items-center gap-2"><ExternalLink className="w-5 h-5" /> Repo Link</a>
                </div>
              </div>
            </NeoCard>
          </div>
        </section>

        {/* --- INTERNSHIP --- */}
        <section id="internships">
          <h2 className="text-4xl font-black uppercase mb-8 flex items-center gap-4">
            <Briefcase className="w-10 h-10" /> Internships & Trainings
          </h2>
          <div className="space-y-12 pl-4 md:pl-8 border-l-8 border-black">
            {/* BARC */}
            <div className="relative">
              <div className="absolute -left-[40px] md:-left-[48px] top-0 w-8 h-8 bg-neo-accent border-4 border-black rotate-45" />
              <NeoCard bgColor="bg-white">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 border-b-4 border-black pb-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase text-neo-accent">Summer Intern</h3>
                    <p className="text-xl font-bold uppercase">Bhabha Atomic Research Centre (BARC)</p>
                  </div>
                  <Badge text="JUN 2025 - JUL 2025" color="bg-neo-muted" />
                </div>
                <h4 className="font-black text-lg mb-2 underline decoration-neo-accent decoration-4">Project: Bank Guarantee Management System</h4>
                <ul className="list-disc pl-5 font-bold space-y-2 mb-6">
                  <li>Designed and developed a Bank Guarantee Management System to digitize and automate BG workflows, reducing manual processing effort by ~40%.</li>
                  <li>Implemented a secure multi-level role-based access system (Admin, Authorized User, General User) using Yii Rights Module.</li>
                  <li>Built production-ready modules including BG entry with advanced multi-parameter search, detailed audit logs, and an expiry reminder engine, reducing BG-related errors by ~25%.</li>
                </ul>
                <div className="flex gap-2 flex-wrap items-center mt-auto">
                  <Badge text="PHP" color="bg-neo-secondary" /><Badge text="Yii Framework" color="bg-neo-secondary" /><Badge text="MySQL" color="bg-neo-secondary" />
                  <div className="ml-auto">
                    <CertButton certImage={barcCert} label="BARC Certificate" />
                  </div>
                </div>
              </NeoCard>
            </div>

            {/* Board Infinity */}
            <div className="relative">
              <div className="absolute -left-[40px] md:-left-[48px] top-0 w-8 h-8 bg-neo-secondary border-4 border-black rotate-12" />
              <NeoCard bgColor="bg-white">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 border-b-4 border-black pb-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase text-neo-secondary">DSA Trainee</h3>
                    <p className="text-xl font-bold uppercase">Board Infinity</p>
                  </div>
                  <Badge text="JUN 2025 - JUL 2025" color="bg-neo-muted" />
                </div>
                <ul className="list-disc pl-5 font-bold space-y-2 mb-6">
                  <li>Mastered core programming & DSA fundamentals: Arrays, Strings, LinkedIn Lists, Stacks, Queues, Trees, Graphs, Sorting, Searching, and DP.</li>
                  <li>Gained interview readiness via competitive programming patterns focusing on time-space complexity optimization.</li>
                  <li>Strengthened hands-on problem solving in C++ and Python through regular exercises and live walkthroughs.</li>
                </ul>
                <div className="flex gap-2 flex-wrap items-center mt-auto">
                  <Badge text="C++" color="bg-neo-secondary" /><Badge text="Python" color="bg-neo-secondary" /><Badge text="DSA" color="bg-neo-secondary" />
                  <div className="ml-auto">
                    <CertButton certImage={biCert} label="Training Certificate" />
                  </div>
                </div>
              </NeoCard>
            </div>
          </div>
        </section>

        {/* --- CERTIFICATIONS --- */}
        <section id="certifications" className="bg-neo-bg p-8 md:p-12 border-4 border-black shadow-neo-lg relative">
          <h2 className="text-4xl lg:text-5xl font-black uppercase mb-8 flex items-center gap-4">
            <Award className="w-12 h-12" /> Certifications
          </h2>

          <p className="text-xl font-bold opacity-60 mb-6 flex justify-between items-center">
            <span>Swipe to explore</span>
            <span className="text-2xl animate-pulse">→</span>
          </p>

          <motion.div ref={carouselRef} className="cursor-grab overflow-hidden py-4 px-2" whileTap={{ cursor: "grabbing" }}>
            <motion.div drag="x" dragConstraints={{ right: 0, left: -carouselWidth }} className="flex gap-8 w-max">
              {[
                { title: "Mastering DSA using C/C++", org: "Udemy", date: "Sep 2025", icon: "🏆", image: certDSAUdemy, link: certDSAUdemy },
                { title: "Object Oriented Programming", org: "Neocolab", date: "Dec 2024", icon: "📚", image: certOOP, link: certOOP },
                { title: "Data Structures & Algorithm", org: "Neocolab", date: "Dec 2024", icon: "🧠", image: certDSANeo, link: certDSANeo },
                { title: "The Bits & Bytes of Computer Networking", org: "Coursera", date: "Oct 2024", icon: "🌐", image: certNetFund, link: certNetFund },
                { title: "Packet Switching Networks & Algorithms", org: "Coursera", date: "Oct 2024", icon: "📡", image: certPacket, link: certPacket },
                { title: "Peer-to-Peer Protocols & LANs", org: "Coursera", date: "Oct 2024", icon: "🔗", image: certP2P, link: certP2P },
                { title: "TCP/IP and Advanced Topics", org: "Coursera", date: "Oct 2024", icon: "🖧", image: certTCPIP, link: certTCPIP },
                { title: "Learn C++ Beginner to Advance", org: "Udemy", date: "Feb 2024", icon: "💻", image: certCpp, link: certCpp },
              ].map((cert, idx) => (
                <motion.div key={idx} className="w-[300px] md:w-[350px] min-h-[450px] bg-white text-black border-4 border-black p-6 flex flex-col hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_white] pointer-events-none">

                  {/* Certificate image */}
                  <div className="w-full h-40 border-4 border-black mb-4 bg-neo-muted overflow-hidden relative group pointer-events-auto">
                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 bg-white border-2 border-black w-10 h-10 flex items-center justify-center text-xl z-10 shadow-neo-sm text-black">{cert.icon}</div>
                  </div>

                  <h3 className="font-black text-xl mb-2 leading-tight min-h-[56px]">{cert.title}</h3>
                  <p className="font-bold opacity-60 mb-6">{cert.org} • {cert.date}</p>

                  <div className="mt-auto pointer-events-auto">
                    {cert.link ? (
                      <a href={cert.link} target="_blank" rel="noreferrer" className="block w-full">
                        <NeoButton color="bg-neo-secondary" className="w-full text-sm py-3 border-2 tracking-widest text-center block">
                          View Certificate
                        </NeoButton>
                      </a>
                    ) : (
                      <NeoButton color="bg-neo-muted" className="w-full text-sm py-3 border-2 tracking-widest text-center block opacity-60 cursor-not-allowed">
                        View Certificate
                      </NeoButton>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* --- EXTRACURRICULAR --- */}
        <section id="extracurricular">
          <h2 className="text-4xl font-black uppercase mb-8 flex items-center gap-4 justify-end">
            Extracurricular <Star className="w-10 h-10 fill-neo-muted" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NeoCard bgColor="bg-neo-secondary">
              <h3 className="text-2xl font-black uppercase mb-2">AKRUTI – Community Development</h3>
              <Badge text="BARC | Jul 2024" color="bg-white" className="mb-4" />
              <p className="font-bold">Contributed to rural health and sustainability initiatives by assisting in water purifier installation and educating farmers on seeds and bio-composting.</p>
            </NeoCard>
            <NeoCard bgColor="bg-neo-accent">
              <h3 className="text-2xl font-black uppercase mb-2 text-white">Pick & Speak Event</h3>
              <Badge text="LPU | Nov 2024" color="bg-white" className="mb-4 border-2" />
              <p className="font-bold text-white">Runner-up - Pick and Speak Competition (Club Level). Actively participated in speaking and coordination.</p>
            </NeoCard>
          </div>
        </section>

        {/* --- EDUCATION --- */}
        <section id="education">
          <h2 className="text-4xl font-black uppercase mb-8 flex items-center gap-4 justify-end">
            Education <GraduationCap className="w-10 h-10" />
          </h2>
          <div className="space-y-4">
            <NeoCard bgColor="bg-neo-muted/20">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black uppercase">B.Tech in CSE</h3>
              </div>
              <p className="font-bold">Lovely Professional University, Since Aug 2023</p>
            </NeoCard>
          </div>
        </section>

      </main>

      {/* --- CONTACT --- */}
      <section id="contact" className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <h2 className="text-5xl md:text-6xl font-black uppercase mb-16 underline decoration-neo-accent decoration-8 underline-offset-4">
          Let's Connect!
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 items-start">

          {/* Left — contact info (Desktop: Col 1 Row 1) */}
          <div className="space-y-8 lg:col-start-1 lg:row-start-1 w-full">
            <a
              href="mailto:vaibhavverma2115@gmail.com"
              className="flex items-center gap-5 group"
            >
              <span className="w-14 h-14 border-4 border-black bg-neo-accent flex items-center justify-center shadow-neo-sm group-hover:-translate-y-1 group-hover:shadow-neo-md transition-all">
                <Mail className="w-6 h-6 text-white" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">Email</p>
                <p className="font-black text-lg">vaibhavverma2115@gmail.com</p>
              </div>
            </a>

            <a
              href="tel:+919405889347"
              className="flex items-center gap-5 group"
            >
              <span className="w-14 h-14 border-4 border-black bg-neo-secondary flex items-center justify-center shadow-neo-sm group-hover:-translate-y-1 group-hover:shadow-neo-md transition-all">
                <span className="text-2xl">📞</span>
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">Phone</p>
                <p className="font-black text-lg">+91 9405889347</p>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/vaibhav2101/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-5 group"
            >
              <span className="w-14 h-14 border-4 border-black bg-neo-muted flex items-center justify-center shadow-neo-sm group-hover:-translate-y-1 group-hover:shadow-neo-md transition-all">
                <Linkedin className="w-6 h-6 text-black" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">LinkedIn</p>
                <p className="font-black text-lg">vaibhav2101</p>
              </div>
            </a>
          </div>

          {/* Right — hand-drawn form box (Desktop: Col 2 Row 1 spans to Row 2) */}
          <div className="relative lg:col-start-2 lg:row-start-1 lg:row-span-2 w-full">
            {/* SVG hand-drawn border */}
            <svg
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <rect
                x="4" y="4"
                width="calc(100% - 8px)" height="calc(100% - 8px)"
                rx="6" ry="6"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="8 4"
                strokeLinecap="round"
                className="text-black opacity-80"
                style={{
                  strokeDasharray: '8 5',
                  filter: 'url(#roughen)',
                }}
              />
              <filter id="roughen">
                <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
              </filter>
            </svg>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const data = new FormData(form);
                fetch("https://docs.google.com/forms/d/e/1FAIpQLSfWVxN8JOL6BQB7QwMrR0cd-MhUXdEAMjuZdNYX4avBmgjIUA/formResponse", {
                  method: "POST",
                  mode: "no-cors",
                  body: data
                }).then(() => {
                  alert("Message sent! Thanks for reaching out.");
                  form.reset();
                }).catch(err => {
                  console.error(err);
                  alert("Something went wrong. Please try again.");
                });
              }}
              className="relative z-10 p-8 md:p-10 space-y-6"
            >
              <div>
                <label className="block font-black uppercase text-sm tracking-widest mb-2">Your Name</label>
                <input
                  type="text"
                  name="entry.1608146007"
                  placeholder="Scribble here…"
                  required
                  className="w-full border-b-4 border-black bg-transparent font-bold text-base py-2 px-1 outline-none placeholder:opacity-40 focus:border-neo-accent transition-colors"
                />
              </div>

              <div>
                <label className="block font-black uppercase text-sm tracking-widest mb-2">Message</label>
                <textarea
                  name="entry.729502842"
                  rows={5}
                  placeholder="What's on your mind?"
                  required
                  className="w-full border-b-4 border-black bg-transparent font-bold text-base py-2 px-1 outline-none placeholder:opacity-40 focus:border-neo-accent transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full border-4 border-black bg-neo-black text-white font-black uppercase tracking-widest py-4 text-base shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md active:translate-y-[2px] active:shadow-none transition-all"
              >
                Send Message ✉️
              </button>
            </form>
          </div>

          {/* Experimental Game Box (Desktop: Col 1 Row 2) */}
          <div className="lg:col-start-1 lg:row-start-2 w-full flex lg:justify-start justify-center">
            <MiniPong />
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t-8 border-black bg-neo-black text-white p-8 mt-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-black uppercase tracking-widest opacity-60 text-sm">Made by Vaibhav Verma</p>
          <div className="flex gap-4">
            <a href="https://github.com/Vaibhav-Verma21" target="_blank" rel="noreferrer"><Github className="w-6 h-6 hover:text-neo-secondary transition-colors" /></a>
            <a href="https://www.linkedin.com/in/vaibhav2101/" target="_blank" rel="noreferrer"><Linkedin className="w-6 h-6 hover:text-neo-secondary transition-colors" /></a>
            <a href="mailto:vaibhavverma2115@gmail.com"><Mail className="w-6 h-6 hover:text-neo-secondary transition-colors" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}