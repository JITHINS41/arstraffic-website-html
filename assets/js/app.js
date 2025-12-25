(function () {
  const root = document.documentElement;
  const body = document.body;
  root.classList.add('dark');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointerMedia = window.matchMedia('(pointer: fine)');
  const pointerState = { x: 0, y: 0 };

  const lockBodyScroll = (lock) => {
    if (!body) return;
    body.classList.toggle('overflow-hidden', !!lock);
  };

  // Mobile menu toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileSolutionsToggle = document.getElementById('mobileSolutionsToggle');
  const mobileSolutionsPanel = document.getElementById('mobileSolutionsPanel');
  const mobileSolutionsIcon = document.getElementById('mobileSolutionsIcon');

  const collapseMobileSolutions = () => {
    if (!mobileSolutionsToggle || !mobileSolutionsPanel) return;
    mobileSolutionsPanel.classList.add('hidden');
    mobileSolutionsToggle.setAttribute('aria-expanded', 'false');
    mobileSolutionsToggle.classList.remove('text-brand-700');
    mobileSolutionsIcon?.classList.remove('rotate-180');
  };
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileNav.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isHidden));
      lockBodyScroll(!isHidden);
      if (isHidden) collapseMobileSolutions();
    });

    // Close on navigation click (mobile)
    mobileNav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        lockBodyScroll(false);
        collapseMobileSolutions();
      })
    );
  }

  if (mobileSolutionsToggle && mobileSolutionsPanel) {
    mobileSolutionsToggle.addEventListener('click', () => {
      const isHidden = mobileSolutionsPanel.classList.toggle('hidden');
      mobileSolutionsToggle.setAttribute('aria-expanded', String(!isHidden));
      mobileSolutionsToggle.classList.toggle('text-brand-700', !isHidden);
      mobileSolutionsIcon?.classList.toggle('rotate-180', !isHidden);
    });
  }

  // Desktop Solutions mega menu
  const solToggle = document.getElementById('solutionsToggle');
  const solPanel = document.getElementById('solutionsPanel');
  let hideTimer;

  function showSolutions() {
    if (!solPanel) return;
    clearTimeout(hideTimer);
    solPanel.classList.remove('hidden');
    solToggle?.setAttribute('aria-expanded', 'true');
  }

  function hideSolutions() {
    if (!solPanel) return;
    solPanel.classList.add('hidden');
    solToggle?.setAttribute('aria-expanded', 'false');
  }

  if (solToggle && solPanel) {
    // Hover/focus interactions
    solToggle.addEventListener('mouseenter', showSolutions);
    solToggle.addEventListener('focus', showSolutions);
      // Confetti effect on "25 Years" click (lightweight, canvas-based)
      const confettiTarget = document.getElementById('anniversaryConfetti');
      if (confettiTarget) {
        confettiTarget.style.cursor = 'pointer';
        confettiTarget.setAttribute('title', 'Celebrate!');

        const spawnConfetti = (x, y) => {
          const canvas = document.createElement('canvas');
          canvas.style.position = 'fixed';
          canvas.style.inset = '0';
          canvas.style.pointerEvents = 'none';
          canvas.style.zIndex = '9999';
          document.body.appendChild(canvas);
          const ctx = canvas.getContext('2d');
          const dpr = Math.max(1, window.devicePixelRatio || 1);
          const resize = () => {
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
          };
          resize();

          const colors = ['#10b981', '#34d399', '#14b8a6', '#06b6d4', '#f59e0b', '#ef4444'];
          const pieces = [];
          const count = 320; // fuller screen
          const originX = x * dpr;
          const originY = y * dpr;
          // Create multiple origins across the screen for a full-screen burst
          const origins = [
            { x: originX, y: originY },
            { x: canvas.width * 0.25, y: canvas.height * 0.35 },
            { x: canvas.width * 0.75, y: canvas.height * 0.35 },
            { x: canvas.width * 0.5, y: canvas.height * 0.2 },
            { x: canvas.width * 0.5, y: canvas.height * 0.6 }
          ];
          for (let i = 0; i < count; i++) {
            const o = origins[i % origins.length];
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 6;
            const size = 2 + Math.random() * 5;
            pieces.push({
              x: o.x,
              y: o.y,
              vx: Math.cos(angle) * speed * dpr,
              vy: Math.sin(angle) * speed * dpr - (2 + Math.random() * 2.5) * dpr,
              size: size * dpr,
              color: colors[Math.floor(Math.random() * colors.length)],
              life: 70 + Math.floor(Math.random() * 50),
              rotation: Math.random() * Math.PI,
              vr: (Math.random() - 0.5) * 0.25
            });
          }

          let frame = 0;
          const gravity = 0.15 * dpr;
          const drag = 0.991;
          const tick = () => {
            frame++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
              p.vx *= drag;
              p.vy = p.vy * drag + gravity;
              p.x += p.vx;
              p.y += p.vy;
              p.rotation += p.vr;
              p.life--;
              const alpha = Math.max(0, Math.min(1, p.life / 80));
              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.translate(p.x, p.y);
              ctx.rotate(p.rotation);
              ctx.fillStyle = p.color;
              // draw as small rotated rectangles (paper bits)
              ctx.fillRect(-p.size * 0.6, -p.size * 0.3, p.size * 1.2, p.size * 0.6);
              ctx.restore();
            });
            // remove dead pieces
            for (let i = pieces.length - 1; i >= 0; i--) {
              if (pieces[i].life <= 0) pieces.splice(i, 1);
            }

            if (pieces.length > 0) {
              requestAnimationFrame(tick);
            } else {
              document.body.removeChild(canvas);
              window.removeEventListener('resize', resize);
            }
          };
          window.addEventListener('resize', resize);
          tick();
        };

        const getClickCenter = (el, evt) => {
          const rect = el.getBoundingClientRect();
          const x = evt.clientX ?? rect.left + rect.width / 2;
          const y = evt.clientY ?? rect.top + rect.height / 2;
          return { x, y };
        };

        // Full-screen confetti: spawn from multiple centers regardless of click point
        confettiTarget.addEventListener('click', (evt) => {
          const { x, y } = getClickCenter(confettiTarget, evt);
          spawnConfetti(x, y);
        });
      }

    solPanel.addEventListener('mouseenter', showSolutions);

    solToggle.addEventListener('mouseleave', () => {
      hideTimer = setTimeout(hideSolutions, 120);
    });
    solToggle.addEventListener('blur', () => {
      hideTimer = setTimeout(hideSolutions, 120);
    });
    solPanel.addEventListener('mouseleave', hideSolutions);

    // Click toggles on desktop as well
    solToggle.addEventListener('click', (e) => {
      // Prevent jumping to #solutions when used as a toggle
      e.preventDefault();
      if (solPanel.classList.contains('hidden')) showSolutions();
      else hideSolutions();
    });

    // Hide on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideSolutions();
    });
  }

  // Simple contact form handler
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
      setStatus('Please fill out all fields.', true);
      return;
    }

    // Simulate async submit
    setStatus('Sending...', false);
    setTimeout(() => {
      setStatus('Thanks! Your message has been sent.', false);
      form.reset();
    }, 800);
  });

  function setStatus(msg, isError) {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle('text-red-600', !!isError);
    status.classList.toggle('text-slate-500', !isError);
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  
  // Lightweight confetti on first load
  function launchConfetti(duration = 2500, count = 90) {
    const layer = document.createElement('div');
    layer.className = 'confetti-layer';
    document.body.appendChild(layer);

    const colors = ['#10b981', '#34d399', '#06b6d4', '#f59e0b', '#ef4444'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const w = 6 + Math.random() * 8;
      const h = 8 + Math.random() * 10;
      el.className = 'confetti';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.setProperty('--sx', (Math.random() * 120 - 60) + 'px');
      el.style.animationDuration = (2.4 + Math.random() * 1.2) + 's';
      el.style.animationDelay = (Math.random() * 0.6) + 's';
      el.style.opacity = String(0.8);
      layer.appendChild(el);
    }

    setTimeout(() => layer.remove(), duration + 1200);
  }

  // Fire once shortly after load
  if (!sessionStorage.getItem('starter:confetti')) {
    setTimeout(() => launchConfetti(2600, 110), 400);
    sessionStorage.setItem('starter:confetti', '1');
  }

  // Animated metrics counters (scroll into view)
  const metricsSection = document.getElementById('metrics');
  const counters = metricsSection?.querySelectorAll('.count-up');
  let metricsStarted = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    const prefersReduced = reduceMotionQuery.matches;
    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400; // ms
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (metricsSection && counters && counters.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !metricsStarted) {
          metricsStarted = true;
          counters.forEach((el) => animateCounter(el));
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(metricsSection);
  }

  function setupPointerTracking() {
    const updateRootVars = () => {
      root.style.setProperty('--pointer-x', pointerState.x.toFixed(3));
      root.style.setProperty('--pointer-y', pointerState.y.toFixed(3));
    };

    const handlePointerMove = (event) => {
      pointerState.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerState.y = (event.clientY / window.innerHeight - 0.5) * 2;
      updateRootVars();
    };

    const resetPointer = () => {
      pointerState.x = 0;
      pointerState.y = 0;
      updateRootVars();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', resetPointer);
    if (typeof pointerMedia.addEventListener === 'function') {
      pointerMedia.addEventListener('change', resetPointer);
    } else if (typeof pointerMedia.addListener === 'function') {
      pointerMedia.addListener(resetPointer);
    }

    updateRootVars();
  }

  function initPointerParallax() {
    if (reduceMotionQuery.matches || !pointerMedia.matches) return;
    const cards = document.querySelectorAll('[data-tilt-card]');
    if (!cards.length) return;

    let currentX = 0;
    let currentY = 0;
    const damp = 0.08;

    const tick = () => {
      currentX += (pointerState.x - currentX) * damp;
      currentY += (pointerState.y - currentY) * damp;

      cards.forEach((card) => {
        const intensity = parseFloat(card.getAttribute('data-tilt-intensity') || '8');
        card.style.setProperty('--tilt-rotate-x', `${currentY * -intensity}deg`);
        card.style.setProperty('--tilt-rotate-y', `${currentX * intensity}deg`);
        card.style.setProperty('--glow-shift-x', `${currentX * 40}px`);
        card.style.setProperty('--glow-shift-y', `${currentY * 40}px`);
      });

      requestAnimationFrame(tick);
    };

    tick();
  }

  function initThreeBackground() {
    const canvas = document.getElementById('sceneCanvas');
    const hasThree = typeof window.THREE !== 'undefined';
    if (!canvas || !hasThree) return;

    if (reduceMotionQuery.matches) {
      canvas.remove();
      return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010818, 0.012);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 600);
    camera.position.set(0, 24, 70);

    const ambient = new THREE.AmbientLight(0x4ecdc4, 0.45);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0x3be8ff, 1.1);
    keyLight.position.set(35, 60, 0);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x0f766e, 1.4, 220);
    rimLight.position.set(-28, 12, -40);
    scene.add(rimLight);

    const asphalt = new THREE.Mesh(
      new THREE.PlaneGeometry(460, 460),
      new THREE.MeshStandardMaterial({ color: 0x030712, metalness: 0.25, roughness: 0.95 })
    );
    asphalt.rotation.x = -Math.PI / 2;
    asphalt.position.y = -22;
    scene.add(asphalt);

    const guidePlane = new THREE.PlaneGeometry(460, 460, 40, 40);
    const guideWire = new THREE.WireframeGeometry(guidePlane);
    const guideMaterial = new THREE.LineBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.32 });
    const guide = new THREE.LineSegments(guideWire, guideMaterial);
    guide.rotation.x = -Math.PI / 2;
    guide.position.y = -21.8;
    scene.add(guide);

    const corridorCurves = [];
    const createTrafficCorridor = (points, colorHex, radius = 0.9) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 180, radius, 24, false);
      const material = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.85,
        transparent: true,
        opacity: 0.92,
        metalness: 0.2,
        roughness: 0.35
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      corridorCurves.push({ curve, mesh });
      return curve;
    };

    const corridorA = createTrafficCorridor([
      new THREE.Vector3(-60, -8, -170),
      new THREE.Vector3(-38, -6, -110),
      new THREE.Vector3(-14, -5, -40),
      new THREE.Vector3(16, -4, 40),
      new THREE.Vector3(42, -3, 120)
    ], 0x10b981, 0.85);

    const corridorB = createTrafficCorridor([
      new THREE.Vector3(70, -6, -200),
      new THREE.Vector3(50, -5, -130),
      new THREE.Vector3(4, -3, -30),
      new THREE.Vector3(-16, -3, 35),
      new THREE.Vector3(-32, -4, 120),
      new THREE.Vector3(-18, -4, 180)
    ], 0x06b6d4, 0.7);

    const corridorC = createTrafficCorridor([
      new THREE.Vector3(-90, 4, -140),
      new THREE.Vector3(-40, 5, -30),
      new THREE.Vector3(0, 6, 60),
      new THREE.Vector3(48, 7, 140),
      new THREE.Vector3(88, 8, 230)
    ], 0xf59e0b, 0.5);

    const corridorD = createTrafficCorridor([
      new THREE.Vector3(120, -2, -160),
      new THREE.Vector3(60, -1, -60),
      new THREE.Vector3(6, 0, 15),
      new THREE.Vector3(-36, 1, 90),
      new THREE.Vector3(-72, 3, 180)
    ], 0xa78bfa, 0.6);

    const vehicleGeometry = new THREE.BoxGeometry(1.6, 0.8, 3.4);
    const vehicles = [];
    const deployVehicles = (curve, count, colorHex, speedRange = [0.045, 0.085]) => {
      for (let i = 0; i < count; i += 1) {
        const material = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.9,
          metalness: 0.55,
          roughness: 0.22
        });
        const mesh = new THREE.Mesh(vehicleGeometry, material);
        mesh.userData = {
          curve,
          progress: Math.random(),
          speed: speedRange[0] + Math.random() * (speedRange[1] - speedRange[0])
        };
        scene.add(mesh);
        vehicles.push(mesh);
      }
    };

    deployVehicles(corridorA, 28, 0x34d399, [0.05, 0.095]);
    deployVehicles(corridorB, 24, 0x06b6d4, [0.045, 0.09]);
    deployVehicles(corridorC, 18, 0xfbbf24, [0.04, 0.075]);
    deployVehicles(corridorD, 16, 0xa78bfa, [0.04, 0.08]);

    const laneLines = [];
    const lanePositions = [-18, -12, -6, 0, 6, 12, 18];
    lanePositions.forEach((xPos, idx) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(xPos, -21.4, -240),
        new THREE.Vector3(xPos, -21.4, 180)
      ]);
      const material = new THREE.LineDashedMaterial({
        color: idx % 2 === 0 ? 0xf8fafc : 0x94a3b8,
        dashSize: 3.2,
        gapSize: 1.8,
        linewidth: 1,
        transparent: true,
        opacity: 0.5
      });
      const line = new THREE.Line(geometry, material);
      line.computeLineDistances();
      scene.add(line);
      laneLines.push({ line, speed: 0.18 + idx * 0.015 });
    });

    const signalNodes = [];
    const signalGeometry = new THREE.CylinderGeometry(0.45, 0.45, 6, 18, 1, true);
    const signalPositions = [
      [-28, -18.5, -60],
      [12, -18.5, -15],
      [-6, -18.5, 25],
      [26, -18.5, 70],
      [-24, -18.5, 110]
    ];
    signalPositions.forEach((pos, idx) => {
      const material = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.45 + idx * 0.05,
        transparent: true,
        opacity: 0.65
      });
      const mesh = new THREE.Mesh(signalGeometry, material);
      mesh.position.set(pos[0], pos[1], pos[2]);
      scene.add(mesh);
      signalNodes.push(mesh);
    });

    const telemetryCount = window.innerWidth > 1024 ? 900 : 520;
    const telemetryGeometry = new THREE.BufferGeometry();
    const telemetryPositions = new Float32Array(telemetryCount * 3);
    const telemetrySpeeds = new Float32Array(telemetryCount);
    for (let i = 0; i < telemetryCount; i += 1) {
      telemetryPositions[i * 3] = (Math.random() - 0.5) * 200;
      telemetryPositions[i * 3 + 1] = Math.random() * 30 - 10;
      telemetryPositions[i * 3 + 2] = -Math.random() * 240;
      telemetrySpeeds[i] = 20 + Math.random() * 26;
    }
    telemetryGeometry.setAttribute('position', new THREE.BufferAttribute(telemetryPositions, 3));
    const telemetryMaterial = new THREE.PointsMaterial({
      color: 0xfef3c7,
      size: 0.85,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    const telemetryPoints = new THREE.Points(telemetryGeometry, telemetryMaterial);
    scene.add(telemetryPoints);

    const aerialPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-60, 20, -120),
      new THREE.Vector3(-10, 28, -40),
      new THREE.Vector3(40, 26, 0),
      new THREE.Vector3(70, 24, 70),
      new THREE.Vector3(20, 22, 130),
      new THREE.Vector3(-40, 24, 40)
    ], true, 'catmullrom', 0.6);

    const aerialPods = [];
    const podGeometry = new THREE.SphereGeometry(0.9, 24, 24);
    for (let i = 0; i < 6; i += 1) {
      const material = new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.8,
        metalness: 0.3,
        roughness: 0.35
      });
      const pod = new THREE.Mesh(podGeometry, material);
      pod.userData = {
        curve: aerialPath,
        progress: i / 6,
        speed: 0.015 + Math.random() * 0.02
      };
      scene.add(pod);
      aerialPods.push(pod);
    }

    const clock = new THREE.Clock();
    let animationFrame;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      camera.position.x += (pointerState.x * 28 - camera.position.x) * 0.02;
      camera.position.y += (14 - pointerState.y * 12 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      corridorCurves.forEach(({ mesh }, idx) => {
        const pulse = 0.78 + Math.sin(elapsed * (0.8 + idx * 0.2)) * 0.12;
        mesh.material.opacity = pulse;
        mesh.material.emissiveIntensity = 0.7 + Math.sin(elapsed * (1 + idx * 0.15)) * 0.12;
      });

      vehicles.forEach((vehicle) => {
        const data = vehicle.userData;
        data.progress = (data.progress + delta * data.speed) % 1;
        const point = data.curve.getPointAt(data.progress);
        const tangent = data.curve.getTangentAt(data.progress);
        vehicle.position.copy(point);
        const lookTarget = point.clone().add(tangent);
        vehicle.lookAt(lookTarget);
        vehicle.rotation.x = 0;
      });

      laneLines.forEach(({ line, speed }) => {
        line.material.dashOffset -= delta * speed;
      });

      const telemetryAttr = telemetryGeometry.attributes.position;
      const telemetryArray = telemetryAttr.array;
      for (let i = 0; i < telemetryCount; i += 1) {
        telemetryArray[i * 3 + 2] += telemetrySpeeds[i] * delta;
        if (telemetryArray[i * 3 + 2] > 90) {
          telemetryArray[i * 3 + 2] = -240;
          telemetryArray[i * 3] = (Math.random() - 0.5) * 200;
          telemetryArray[i * 3 + 1] = Math.random() * 30 - 10;
        }
      }
      telemetryAttr.needsUpdate = true;

      aerialPods.forEach((pod) => {
        const data = pod.userData;
        data.progress = (data.progress + delta * data.speed) % 1;
        const point = data.curve.getPointAt(data.progress);
        const tangent = data.curve.getTangentAt(data.progress);
        pod.position.copy(point);
        pod.lookAt(point.clone().add(tangent));
      });

      signalNodes.forEach((node, idx) => {
        const wave = Math.sin(elapsed * (1.4 + idx * 0.17));
        node.scale.y = 0.85 + Math.abs(wave) * 0.25;
        node.material.emissiveIntensity = 0.45 + Math.max(0, wave) * 0.55;
      });

      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    animate();
  }

  function initTrafficGame() {
    const canvas = document.getElementById('trafficGame');
    const statusEl = document.getElementById('trafficStatus');
    if (!canvas || !statusEl) return;

    if (reduceMotionQuery.matches) {
      canvas.classList.add('opacity-40');
      statusEl.textContent = 'Traffic lab disabled because reduced motion is enabled.';
      const resetBtn = document.getElementById('trafficReset');
      resetBtn?.setAttribute('disabled', 'true');
      return;
    }

    const ctx = canvas.getContext('2d');
    const speedEl = document.getElementById('trafficSpeed');
    const distanceEl = document.getElementById('trafficDistance');
    const avoidedEl = document.getElementById('trafficAvoided');
    const collisionsEl = document.getElementById('trafficCollisions');
    const resetBtn = document.getElementById('trafficReset');

    const lanes = 3;
    let width = canvas.clientWidth;
    let height = canvas.clientWidth * 0.6;
    let laneWidth = width / lanes;
    let laneGap = 200;
    const player = { lane: 1, x: 0, y: 0, width: 40, height: 80, targetX: 0 };
    let enemies = [];
    const laneCooldowns = new Array(lanes).fill(0);
    let spawnTimer = 0.4;
    let speed = 90;
    let distance = 0;
    let avoided = 0;
    let collisions = 0;
    let running = false;
    let lastTime = performance.now();
    const activeKeys = new Set();

    const laneCenter = (lane) => laneWidth * lane + laneWidth / 2;
    const getCriticalLanes = () => {
      const blocked = new Set();
      const depth = laneGap * 0.9;
      enemies.forEach((enemy) => {
        if (enemy.y < depth) {
          blocked.add(enemy.lane);
        }
      });
      return blocked;
    };

    const updateReadouts = () => {
      if (speedEl) speedEl.textContent = `${Math.round(speed)} km/h`;
      if (distanceEl) distanceEl.textContent = `${distance.toFixed(2)} km`;
      if (avoidedEl) avoidedEl.textContent = String(avoided);
      if (collisionsEl) collisionsEl.textContent = String(collisions);
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = Math.min(rect.width * 0.62, 420);
      laneWidth = width / lanes;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.8);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      canvas.style.height = `${height}px`;
      player.width = laneWidth * 0.45;
      player.height = height * 0.22;
      player.y = height - player.height - 18;
      player.targetX = laneCenter(player.lane) - player.width / 2;
      player.x = player.targetX;
      laneGap = height * 0.48;
    };

    const changeLane = (offset) => {
      const nextLane = Math.min(lanes - 1, Math.max(0, player.lane + offset));
      if (nextLane === player.lane) return;
      player.lane = nextLane;
      player.targetX = laneCenter(player.lane) - player.width / 2;
    };

    const spawnEnemy = () => {
      const openLanes = [0, 1, 2].filter((lane) =>
        laneCooldowns[lane] <= 0 &&
        !enemies.some((enemy) => enemy.lane === lane && enemy.y < laneGap)
      );
      if (!openLanes.length) return false;
      const criticalLanes = getCriticalLanes();
      if (criticalLanes.size >= lanes - 1) return false;
      const laneChoice = openLanes[Math.floor(Math.random() * openLanes.length)];
      const enemyWidth = laneWidth * (0.38 + Math.random() * 0.15);
      const enemyHeight = height * (0.18 + Math.random() * 0.05);
      enemies.push({
        lane: laneChoice,
        x: laneCenter(laneChoice) - enemyWidth / 2,
        y: -enemyHeight - 40,
        width: enemyWidth,
        height: enemyHeight,
        speed: speed * (0.45 + Math.random() * 0.18)
      });
      laneCooldowns[laneChoice] = 0.8 + Math.random() * 0.35;
      return true;
    };

    const checkCollision = (a, b) => (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );

    const resetGame = (resetCollisions = false) => {
      enemies = [];
      laneCooldowns.fill(0);
      spawnTimer = 0.4;
      speed = 90;
      distance = 0;
      avoided = 0;
      player.lane = 1;
      player.targetX = laneCenter(player.lane) - player.width / 2;
      player.x = player.targetX;
      if (resetCollisions) collisions = 0;
      running = false;
      canvas.classList.remove('ring-rose-500/70');
      statusEl.textContent = 'Press an arrow key to initialize the flow.';
      updateReadouts();
    };

    const update = (delta) => {
      if (!running) return;
      if (activeKeys.has('ArrowUp')) speed = Math.min(speed + 110 * delta, 180);
      else if (activeKeys.has('ArrowDown')) speed = Math.max(speed - 150 * delta, 40);
      else speed += (100 - speed) * delta * 0.6;

      player.x += (player.targetX - player.x) * Math.min(1, delta * 12);
      distance += (speed / 3600) * delta;

      spawnTimer -= delta;
      laneCooldowns.forEach((_, idx) => {
        laneCooldowns[idx] = Math.max(0, laneCooldowns[idx] - delta);
      });
      if (spawnTimer <= 0) {
        const spawned = spawnEnemy();
        const clampSpeed = Math.min(speed, 160);
        spawnTimer = spawned
          ? Math.max(0.3, 0.95 - clampSpeed / 260)
          : 0.12;
      }

      let collisionDetected = false;
      const survivors = [];
      enemies.forEach((enemy) => {
        enemy.y += (enemy.speed + speed * 0.35) * delta;
        if (enemy.y > height + enemy.height) {
          avoided += 1;
          return;
        }
        if (checkCollision(player, enemy)) {
          collisionDetected = true;
        }
        survivors.push(enemy);
      });
      enemies = survivors;

      if (collisionDetected) {
        collisions += 1;
        running = false;
        statusEl.textContent = 'Collision! Press reset or tap an arrow key to try again.';
        canvas.classList.add('ring-rose-500/70');
      } else {
        statusEl.textContent = 'Keep traffic flowing — avoid the red vehicles.';
      }

      updateReadouts();
    };

    const drawCar = (x, y, w, h, color) => {
      const radius = Math.min(14, w * 0.35);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius * 0.8);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius * 0.8);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(15,23,42,0.95)';
      ctx.fillRect(x + w * 0.18, y + h * 0.12, w * 0.64, h * 0.2);
      ctx.fillStyle = 'rgba(15,23,42,0.7)';
      ctx.fillRect(x + w * 0.2, y + h * 0.52, w * 0.6, h * 0.3);

      ctx.fillStyle = 'rgba(15,23,42,0.95)';
      const wheelHeight = h * 0.12;
      const wheelWidth = w * 0.18;
      ctx.fillRect(x + w * 0.05, y + h * 0.2, wheelWidth, wheelHeight);
      ctx.fillRect(x + w - wheelWidth - w * 0.05, y + h * 0.2, wheelWidth, wheelHeight);
      ctx.fillRect(x + w * 0.05, y + h - wheelHeight - h * 0.1, wheelWidth, wheelHeight);
      ctx.fillRect(x + w - wheelWidth - w * 0.05, y + h - wheelHeight - h * 0.1, wheelWidth, wheelHeight);

      ctx.fillStyle = 'rgba(253,224,71,0.8)';
      ctx.fillRect(x + w * 0.08, y + h * 0.05, w * 0.14, h * 0.08);
      ctx.fillRect(x + w - w * 0.22, y + h * 0.05, w * 0.14, h * 0.08);
      ctx.fillStyle = 'rgba(248,113,113,0.9)';
      ctx.fillRect(x + w * 0.12, y + h - h * 0.12, w * 0.12, h * 0.07);
      ctx.fillRect(x + w - w * 0.24, y + h - h * 0.12, w * 0.12, h * 0.07);
    };

    const render = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#010a16');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < lanes; i += 1) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(15,118,110,0.08)' : 'rgba(8,47,73,0.12)';
        ctx.fillRect(i * laneWidth, 0, laneWidth, height);
      }

      ctx.strokeStyle = 'rgba(148,163,184,0.35)';
      ctx.setLineDash([20, 18]);
      ctx.lineWidth = 2;
      for (let i = 1; i < lanes; i += 1) {
        ctx.beginPath();
        ctx.moveTo(i * laneWidth, 0);
        ctx.lineTo(i * laneWidth, height);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      drawCar(player.x, player.y, player.width, player.height, '#34d399');
      enemies.forEach((enemy) => drawCar(enemy.x, enemy.y, enemy.width, enemy.height, '#f87171'));

      ctx.fillStyle = 'rgba(16,185,129,0.08)';
      ctx.fillRect(0, height - 60, width, 60);
    };

    const loop = (now) => {
      const delta = Math.min(0.05, (now - lastTime) / 1000 || 0);
      lastTime = now;
      update(delta);
      render();
      requestAnimationFrame(loop);
    };

    const handleKeyDown = (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      if (!running) {
        resetGame(false);
        running = true;
      }
      if (event.key === 'ArrowLeft' && !event.repeat) changeLane(-1);
      if (event.key === 'ArrowRight' && !event.repeat) changeLane(1);
      activeKeys.add(event.key);
    };

    const handleKeyUp = (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      activeKeys.delete(event.key);
    };

    canvas.addEventListener('pointerdown', () => canvas.focus({ preventScroll: true }));
    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('focus', () => {
      if (!running) statusEl.textContent = 'Use arrow keys to weave through live traffic.';
    });

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('blur', () => {
      if (running) {
        running = false;
        statusEl.textContent = 'Paused — click the simulator to continue.';
      }
    });

    resetBtn?.addEventListener('click', (event) => {
      event.preventDefault();
      resetGame(true);
      canvas.focus({ preventScroll: true });
    });

    resizeCanvas();
    resetGame(true);
    lastTime = performance.now();
    render();
    requestAnimationFrame(loop);
    setTimeout(() => canvas.focus({ preventScroll: true }), 400);
  }

  setupPointerTracking();
  initPointerParallax();
  initThreeBackground();
  initTrafficGame();

})();
