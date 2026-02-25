/* =====================
   タイトル文字ずつアニメ
===================== */
(function() {
    const title = document.getElementById('hero-title-text');
    if (!title) return;

    // テキストノードを文字単位に分割（改行・span保持）
    function wrapChars(el) {
        el.childNodes.forEach(node => {
            if (node.nodeType === 3) {
                const chars = [...node.textContent];
                const frag = document.createDocumentFragment();
                chars.forEach(ch => {
                    if (ch === '\n' || ch === ' ') {
                        frag.appendChild(document.createTextNode(ch));
                    } else {
                        const span = document.createElement('span');
                        span.className = 'char';
                        span.textContent = ch;
                        frag.appendChild(span);
                    }
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === 1) {
                wrapChars(node);
            }
        });
    }
    wrapChars(title);

    const chars = title.querySelectorAll('.char');
    chars.forEach((c, i) => {
        c.style.animationDelay = (0.4 + i * 0.07) + 's';
    });
})();

/* =====================
   花びらアニメーション
===================== */
(function() {
    const canvas = document.getElementById('petal-canvas');
    const ctx = canvas.getContext('2d');
    let W, H;
    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const COLORS = ['#F9A8C4','#FFD6E4','#FFB7C5','#FECDD3','#FFC0CB','#FFE4EE','#FADADD'];
    const petals = [];
    const NUM = 32;
    function rnd(a, b) { return a + Math.random() * (b - a); }

    for (let i = 0; i < NUM; i++) {
        petals.push({
            x: rnd(0, window.innerWidth),
            y: rnd(-300, -10),
            size: rnd(6, 14),
            speedX: rnd(-1, 1),
            speedY: rnd(0.7, 1.8),
            rot: rnd(0, Math.PI * 2),
            rotSpeed: rnd(-0.03, 0.03),
            opacity: rnd(0.5, 0.85),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            wobble: rnd(0, Math.PI * 2),
            wobbleSpeed: rnd(0.012, 0.035),
        });
    }

    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        petals.forEach(p => {
            p.wobble += p.wobbleSpeed;
            p.x += p.speedX + Math.sin(p.wobble) * 0.7;
            p.y += p.speedY;
            p.rot += p.rotSpeed;
            if (p.y > H + 20) {
                p.y = -15;
                p.x = rnd(0, W);
            }
            drawPetal(p);
        });
        requestAnimationFrame(animate);
    }
    animate();
})();

/* =====================
   スクロールアニメ（reveal + sec-title下線）
===================== */
(function() {
    const reveals = document.querySelectorAll('.reveal');
    const titles = document.querySelectorAll('.sec-title');

    const obsReveal = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = (i % 3) * 0.08 + 's';
                entry.target.classList.add('visible');
                obsReveal.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => obsReveal.observe(el));

    const obsTitle = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('line-visible');
                obsTitle.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px' });
    titles.forEach(el => obsTitle.observe(el));
})();

/* =====================
   フローティングCTA
===================== */
(function() {
    const btn = document.getElementById('floating-cta');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
})();
