(() => {
  if (document.getElementById('snowCanvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'snowCanvas';
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '0'
  });
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  const enabled = localStorage.getItem('auraaParticlesEnabled');
  if (enabled === 'false') return;

  let flakesCount = parseInt(localStorage.getItem('auraaParticleCount'), 10);
  if (isNaN(flakesCount)) flakesCount = 15;
  flakesCount = Math.min(Math.max(flakesCount, 5), 100);

  const flakes = Array.from({ length: flakesCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5 + 0.5,
    speedY: Math.random() * 0.5 + 0.2,
    speedX: (Math.random() - 0.5) * 0.3
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    for (const flake of flakes) {
      ctx.moveTo(flake.x, flake.y);
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    }
    ctx.fill();
    update();
    requestAnimationFrame(draw);
  }

  function update() {
    for (const flake of flakes) {
      flake.y += flake.speedY;
      flake.x += flake.speedX;

      if (flake.y > height) {
        flake.y = 0;
        flake.x = Math.random() * width;
      }

      if (flake.x > width) flake.x = 0;
      if (flake.x < 0) flake.x = width;
    }
  }

  draw();
})();
