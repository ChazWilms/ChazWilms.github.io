/**
 * BLUE HURT GIRL - Interactive Engine (app.js)
 * High-performance 60fps particle canvas & Jinx spray-splatter effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initGlitchEffects();
  initPaintSplatters();
});

/* ==========================================================================
   1. HIGH-PERFORMANCE DYNAMIC CANVAS (NEON PARTICLES & GLOWING CLOUDS)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  
  let particles = [];
  const maxParticles = 60;
  
  // Mouse position tracker
  const mouse = {
    x: null,
    y: null,
    radius: 120
  };
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle Class representing Jinx's chaotic energy (cyan sparks & purple/pink mist)
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 4 + 1; // particle size
      this.speedX = Math.random() * 0.8 - 0.4;
      this.speedY = Math.random() * -0.6 - 0.1; // Float slowly upward
      this.alpha = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 185 : 325; // Cyan (185) or Hot Pink (325)
      this.oscillationSpeed = Math.random() * 0.02 + 0.005;
      this.angle = Math.random() * Math.PI * 2;
    }
    
    update() {
      this.y += this.speedY;
      
      // Horizontal wave oscillation
      this.angle += this.oscillationSpeed;
      this.x += Math.sin(this.angle) * 0.3 + this.speedX;
      
      // Mouse repulsion physics
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 4;
          this.y += Math.sin(angle) * force * 4;
        }
      }
      
      // Wrap around edges
      if (this.y < -10) {
        this.y = height + 10;
        this.x = Math.random() * width;
      }
      if (this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      
      // Radial glow gradient for premium Jinx smoke/spark illusion
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 3
      );
      
      const color = `hsla(${this.hue}, 100%, 65%, `;
      gradient.addColorStop(0, color + '1)');
      gradient.addColorStop(0.3, color + '0.4)');
      gradient.addColorStop(1, color + '0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

/* ==========================================================================
   2. INTERACTIVE GLITCH TITLE EMULATOR
   ========================================================================= */
function initGlitchEffects() {
  const glitches = document.querySelectorAll('.glitch-text');
  
  glitches.forEach((el) => {
    // Periodically trigger a stronger visual glitch effect
    setInterval(() => {
      if (Math.random() > 0.7) {
        el.style.transform = `skew(${(Math.random() * 6 - 3)}deg) translate(${(Math.random() * 4 - 2)}px, ${(Math.random() * 2 - 1)}px)`;
        el.style.textShadow = Math.random() > 0.5 
          ? '0 0 15px rgba(255,0,127,0.9), 3px -2px rgba(0,240,255,0.7)' 
          : '0 0 15px rgba(0,240,255,0.9), -3px 2px rgba(255,0,127,0.7)';
          
        setTimeout(() => {
          el.style.transform = 'none';
          el.style.textShadow = '0 0 10px rgba(0, 240, 255, 0.6)';
        }, 120);
      }
    }, 1500);
  });
}

/* ==========================================================================
   3. JINX-STYLE SPRAY SPLATTER & DRIP SIMULATOR (EASTER EGG)
   ========================================================================== */
function initPaintSplatters() {
  const colors = [
    '#00f0ff', // Cyan
    '#ff007f', // Magenta/Pink
    '#bd00ff', // Violet Purple
    '#39ff14', // Neon Green
    '#ffff00'  // Toxic Yellow
  ];

  window.addEventListener('click', (e) => {
    // Don't splatter if clicking interactive buttons, links, or tracks
    const target = e.target;
    if (
      target.closest('a') || 
      target.closest('iframe') || 
      target.closest('button') || 
      target.closest('.track-card')
    ) {
      return;
    }

    createSplatter(e.clientX, e.clientY);
  });

  function createSplatter(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 30 + 15; // Splatter size
    
    // 1. Create primary splatter droplet
    const splatter = document.createElement('div');
    splatter.className = 'paint-splatter';
    splatter.style.left = `${x}px`;
    splatter.style.top = `${y}px`;
    splatter.style.width = `${size}px`;
    splatter.style.height = `${size}px`;
    splatter.style.background = color;
    
    // Generate complex chaotic paint splatter outline using CSS clip-path
    const clipPoints = [];
    const numPoints = 8 + Math.floor(Math.random() * 6);
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const r = 35 + Math.random() * 20; // Wavy radii
      const px = Math.floor(50 + Math.cos(angle) * r);
      const py = Math.floor(50 + Math.sin(angle) * r);
      clipPoints.push(`${px}% ${py}%`);
    }
    splatter.style.clipPath = `polygon(${clipPoints.join(', ')})`;
    splatter.style.boxShadow = `0 0 15px ${color}`;
    
    document.body.appendChild(splatter);

    // 2. Create minor splash dots (1 to 3 splats radiating out)
    const sparksCount = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < sparksCount; i++) {
      const splash = document.createElement('div');
      splash.className = 'paint-splatter';
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 40 + 20;
      const sparkSize = Math.random() * 6 + 3;
      
      splash.style.left = `${x + Math.cos(angle) * distance}px`;
      splash.style.top = `${y + Math.sin(angle) * distance}px`;
      splash.style.width = `${sparkSize}px`;
      splash.style.height = `${sparkSize}px`;
      splash.style.background = color;
      
      // Simple organic oval splat
      splash.style.borderRadius = `${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}%`;
      document.body.appendChild(splash);
      
      setTimeout(() => splash.remove(), 600);
    }

    // 3. Create paint drip trailing downward (50% chance if click is high enough)
    if (Math.random() > 0.4 && y < window.innerHeight - 150) {
      const drip = document.createElement('div');
      drip.className = 'paint-drip';
      
      // Drip offset slightly from center of click
      const offset = Math.random() * (size / 2) - (size / 4);
      drip.style.left = `${x + offset}px`;
      drip.style.top = `${y + size / 4}px`;
      drip.style.background = color;
      drip.style.boxShadow = `0 0 8px ${color}`;
      drip.style.width = `${Math.random() * 2 + 2}px`;
      
      document.body.appendChild(drip);
      setTimeout(() => drip.remove(), 1500);
    }

    // Clean up main splatter element
    setTimeout(() => {
      splatter.remove();
    }, 600);
  }
}
