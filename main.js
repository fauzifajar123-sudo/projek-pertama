/* ============================
   BIRTHDAY WEBSITE — script.js
============================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── DOM REFS ─── */
    const pages = document.querySelectorAll('.page');
    const envelope = document.getElementById('envelope');
    const envWrapper = document.getElementById('envelope-wrapper');
    const clickHint = document.getElementById('click-hint');
    const btnSurprise = document.getElementById('btn-surprise');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const iconOn = document.getElementById('music-icon-on');
    const iconOff = document.getElementById('music-icon-off');

    /* ─── STATE ─── */
    let currentPage = 'page-1';
    let musicPlaying = false;
    let envelopeOpened = false;

    /* ─── PAGE NAVIGATION ─── */
    function goTo(pageId) {
        const current = document.getElementById(currentPage);
        const next = document.getElementById(pageId);
        if (!next || pageId === currentPage) return;

        if (current) {
            current.classList.add('exit');
            current.classList.remove('active');
        }

        setTimeout(() => {
            if (current) current.classList.remove('exit');
            next.classList.add('active');
            currentPage = pageId;

            // Trigger confetti on entering page-2
            if (pageId === 'page-2') launchConfetti(80);

            // After typing animation finishes on page-4, make text scrollable
            if (pageId === 'page-4') {
                const typingText = document.querySelector('.typing-text');
                if (typingText) {
                    typingText.classList.remove('done');
                    setTimeout(() => {
                        typingText.classList.add('done');
                    }, 4200); // slightly after the 4s animation
                }
            }

            // Trigger animation if entering page-5
            if(pageId === "page-5"){
                setTimeout(() => {
                    if(window.startPage5Animation){
                        window.startPage5Animation();
                    }
                }, 300);
            }
        }, 400);
    }

    // Expose goTo globally so inline handlers or other scripts can use it
    window.goTo = goTo;

    /* ─── MEMORY CARDS ─── */
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.dataset.page;
            if (target) goTo(target);
        });
    });

    /* ─── BACK BUTTONS ─── */
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.page;
            if (target) goTo(target);
        });
    });

    /* ─── ENVELOPE OPEN ─── */
    function openEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;

        if (envelope) envelope.classList.add('opening');
        if (envWrapper) envWrapper.classList.add('opening');
        if (clickHint) clickHint.style.opacity = '0';

        // Try to start background music on interaction
        tryPlayMusic();

        // Show the "Buka Kejutan" button after animation
        setTimeout(() => {
            if (btnSurprise) {
                btnSurprise.classList.remove('hidden');
                btnSurprise.classList.add('visible');
            }
        }, 1200);
    }

    if (envWrapper) {
        envWrapper.addEventListener('click', openEnvelope);
    }

    if (btnSurprise) {
        btnSurprise.addEventListener('click', () => {
            launchConfetti(120);
            setTimeout(() => goTo('page-2'), 300);
        });
    }

    /* ─── BACKGROUND MUSIC ─── */
    if (bgMusic) {
        bgMusic.volume = 0.25;
    }

    function tryPlayMusic() {
        if (musicPlaying || !bgMusic) return;
        const p = bgMusic.play();
        if (p !== undefined) {
            p.then(() => {
                musicPlaying = true;
                updateMusicUI();
            }).catch(() => {
                // Autoplay blocked — user must click music button
            });
        }
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (!bgMusic) return;
            if (musicPlaying) {
                bgMusic.pause();
                musicPlaying = false;
            } else {
                bgMusic.play().then(() => {
                    musicPlaying = true;
                }).catch(() => { });
            }
            updateMusicUI();
        });
    }

    function updateMusicUI() {
        if (iconOn) iconOn.style.display = musicPlaying ? 'block' : 'none';
        if (iconOff) iconOff.style.display = musicPlaying ? 'none' : 'block';
    }

    /* ─── FLOATING PETALS ─── */
    const petalsContainer = document.getElementById('petals-container');
    const petalSymbols = ['🌹', '🌸', '❤️', '✨', '💕', '🌺'];

    function createPetal() {
        if (!petalsContainer || currentPage !== 'page-1') return;
        const el = document.createElement('span');
        el.classList.add('petal');
        el.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.top = '-20px';
        el.style.fontSize = (Math.random() * 0.8 + 0.6) + 'rem';
        el.style.animationDuration = (Math.random() * 8 + 8) + 's';
        el.style.animationDelay = (Math.random() * 5) + 's';
        petalsContainer.appendChild(el);
        setTimeout(() => el.remove(), 18000);
    }
    setInterval(createPetal, 1200);
    for (let i = 0; i < 5; i++) createPetal();

    /* ─── CONFETTI ─── */
    const confettiCanvas = document.getElementById('confetti-canvas');
    const ctx = confettiCanvas ? confettiCanvas.getContext('2d') : null;

    function resizeConfettiCanvas() {
        if (!confettiCanvas) return;
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }

    if (confettiCanvas) {
        resizeConfettiCanvas();
        window.addEventListener('resize', resizeConfettiCanvas);
    }

    let confettiParticles = [];
    let confettiRunning = false;

    function launchConfetti(count = 100) {
        if (!confettiCanvas || !ctx) return;
        const colors = ['#c41e3a', '#ff6b8a', '#ffb3c1', '#d4a537', '#f0c65a', '#ffffff', '#8B0000'];
        for (let i = 0; i < count; i++) {
            confettiParticles.push({
                x: Math.random() * confettiCanvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                angle: Math.random() * 360,
                spin: (Math.random() - 0.5) * 10,
                shape: Math.random() > 0.5 ? 'rect' : 'circle',
                life: 1,
                decay: Math.random() * 0.005 + 0.003,
            });
        }
        if (!confettiRunning) animateConfetti();
    }

    // Expose launchConfetti globally
    window.launchConfetti = launchConfetti;

    function animateConfetti() {
        if (!confettiCanvas || !ctx) return;
        if (confettiParticles.length === 0) { confettiRunning = false; return; }
        confettiRunning = true;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles = confettiParticles.filter(p => p.life > 0 && p.y < confettiCanvas.height + 20);
        confettiParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05;
            p.vx *= 0.99;
            p.angle += p.spin;
            p.life -= p.decay;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * Math.PI / 180);
            ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });
        requestAnimationFrame(animateConfetti);
    }

    /* ─── CATCH THE HEARTS GAME ─── */
    const catchCanvas = document.getElementById('catch-canvas');
    const catchCtx = catchCanvas ? catchCanvas.getContext('2d') : null;
    const btnCatchStart = document.getElementById('btn-catch-start');
    const catchOverlay = document.getElementById('catch-overlay');
    const scoreVal = document.getElementById('catch-score-val');
    const livesVal = document.getElementById('catch-lives-val');
    const catchOverlayTitle = document.getElementById('catch-overlay-title');
    const catchOverlayDesc = document.getElementById('catch-overlay-desc');
    const catchFinalScore = document.getElementById('catch-final-score');

    let catchGameRunning = false;
    let catchScore = 0;
    let catchLives = 3;
    let catchItems = [];
    let catchBasket = { x: 0, y: 0, width: 120, height: 80 };
    let catchAnimationFrame;
    let lastItemTime = 0;
    let itemSpawnRate = 1000;

    // Image and Emojis mapping
    const PANDU_IMAGES = [];
    for (let i = 1; i <= 5; i++) {
        const img = new Image();
        img.src = `script/pandu${i}.jpeg`;
        PANDU_IMAGES.push(img);
    }
    const BAD_ITEMS = ['💔', '💣', '💩'];

    function resizeCatchCanvas() {
        if (!catchCanvas) return;
        const rect = catchCanvas.parentElement.getBoundingClientRect();
        catchCanvas.width = rect.width;
        catchCanvas.height = rect.height;
        catchBasket.y = catchCanvas.height - catchBasket.height - 20;
        if (catchBasket.x === 0 || catchBasket.x > catchCanvas.width) {
            catchBasket.x = catchCanvas.width / 2 - catchBasket.width / 2;
        }
    }

    if (catchCanvas) {
        window.addEventListener('resize', resizeCatchCanvas);
        resizeCatchCanvas();

        // Mouse control
        catchCanvas.addEventListener('mousemove', (e) => {
            if (!catchGameRunning) return;
            const rect = catchCanvas.getBoundingClientRect();
            catchBasket.x = e.clientX - rect.left - catchBasket.width / 2;
        });

        // Touch control
        catchCanvas.addEventListener('touchmove', (e) => {
            if (!catchGameRunning) return;
            e.preventDefault(); // Prevent scrolling while playing
            const rect = catchCanvas.getBoundingClientRect();
            catchBasket.x = e.touches[0].clientX - rect.left - catchBasket.width / 2;
        }, { passive: false });
    }

    function updateCatchUI() {
        if (scoreVal) scoreVal.innerText = catchScore;
        let hearts = '';
        for (let i = 0; i < Math.max(0, catchLives); i++) hearts += '❤️';
        if (livesVal) livesVal.innerText = hearts || '💀';
    }

    function spawnCatchItem() {
        if (!catchCanvas) return;
        const isBad = Math.random() < 0.2; // 20% chance bad
        let itemImg = null;
        let itemEmoji = null;

        if (!isBad) {
            itemImg = PANDU_IMAGES[Math.floor(Math.random() * PANDU_IMAGES.length)];
        } else {
            itemEmoji = BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)];
        }

        catchItems.push({
            x: Math.random() * (catchCanvas.width - 100) + 50, // Keep padding
            y: -80,
            size: Math.random() * 25 + 75, // 75-100px for much larger visibility
            img: itemImg,
            emoji: itemEmoji,
            isBad: isBad,
            speed: Math.random() * 2 + 3 + (catchScore * 0.02) // Speed increases over time
        });
    }

    function drawCatchGame() {
        if (!catchCanvas || !catchCtx) return;
        catchCtx.clearRect(0, 0, catchCanvas.width, catchCanvas.height);

        // Draw Basket (a stylized shape or emoji)
        catchCtx.font = "80px Arial";
        catchCtx.textAlign = "center";
        catchCtx.textBaseline = "middle";
        catchCtx.fillText("🧺", catchBasket.x + catchBasket.width / 2, catchBasket.y + catchBasket.height / 2);

        // Draw and update items
        const now = Date.now();
        if (now - lastItemTime > itemSpawnRate) {
            spawnCatchItem();
            lastItemTime = now;
            itemSpawnRate = Math.max(400, 1000 - catchScore * 5); // Speeds up spawn rate
        }

        for (let i = catchItems.length - 1; i >= 0; i--) {
            let item = catchItems[i];
            item.y += item.speed;

            if (item.img && item.img.complete) {
                catchCtx.save();
                
                const imgX = item.x - item.size / 2;
                const imgY = item.y - item.size / 2;
                
                // Calculate square crop (object-fit: cover equivalent)
                const imgRatio = item.img.width / item.img.height;
                let sx, sy, sWidth, sHeight;
                
                if (imgRatio > 1) {
                    // Landscape
                    sHeight = item.img.height;
                    sWidth = sHeight;
                    sx = (item.img.width - sWidth) / 2;
                    sy = 0;
                } else {
                    // Portrait or square
                    sWidth = item.img.width;
                    sHeight = sWidth;
                    sx = 0;
                    sy = (item.img.height - sHeight) / 2;
                }
                
                // Draw image proportionally without stretching
                catchCtx.drawImage(item.img, sx, sy, sWidth, sHeight, imgX, imgY, item.size, item.size);
                
                // Add a cute border
                catchCtx.lineWidth = 3;
                catchCtx.strokeStyle = '#ff6b8a';
                catchCtx.strokeRect(imgX, imgY, item.size, item.size);
                
                catchCtx.restore();
            } else if (item.emoji) {
                catchCtx.font = item.size + "px Arial";
                catchCtx.fillText(item.emoji, item.x, item.y);
            }

            // Detect Catch Collision
            if (
                item.y + item.size / 2 >= catchBasket.y &&
                item.y - item.size / 2 <= catchBasket.y + catchBasket.height &&
                item.x >= catchBasket.x - catchBasket.width / 4 &&
                item.x <= catchBasket.x + catchBasket.width + catchBasket.width / 4
            ) {
                // Caught
                if (item.isBad) {
                    catchLives--;
                    updateCatchUI();
                    // Shake effect using inline keyframes
                    if (catchCanvas) {
                        catchCanvas.style.transform = 'translateX(-5px)';
                        setTimeout(() => { catchCanvas.style.transform = 'translateX(5px)'; }, 50);
                        setTimeout(() => { catchCanvas.style.transform = 'translateX(-3px)'; }, 100);
                        setTimeout(() => { catchCanvas.style.transform = 'translateX(3px)'; }, 150);
                        setTimeout(() => { catchCanvas.style.transform = 'translateX(0)'; }, 200);
                    }
                } else {
                    catchScore += 10;
                    updateCatchUI();
                }
                // Remove caught item
                catchItems.splice(i, 1);
            } else if (item.y > catchCanvas.height + 50) {
                // Missed
                catchItems.splice(i, 1);
            }
        }

        if (catchLives <= 0) {
            endCatchGame();
            return;
        }

        if (catchGameRunning) {
            catchAnimationFrame = requestAnimationFrame(drawCatchGame);
        }
    }

    function startCatchGame() {
        catchScore = 0;
        catchLives = 3;
        catchItems = [];
        itemSpawnRate = 1000;
        lastItemTime = Date.now();
        updateCatchUI();
        if (catchOverlay) catchOverlay.classList.add('hidden');
        if (catchFinalScore) catchFinalScore.classList.add('hidden');
        catchGameRunning = true;
        resizeCatchCanvas();
        drawCatchGame();
    }

    function endCatchGame() {
        catchGameRunning = false;
        cancelAnimationFrame(catchAnimationFrame);
        if (catchOverlay) {
            catchOverlay.classList.remove('hidden');
            if (catchOverlayTitle) catchOverlayTitle.innerText = "Game Over! 💔";
            if (catchOverlayDesc) catchOverlayDesc.innerText = "Nyawa kamu habis. Coba lagi?";
            if (btnCatchStart) btnCatchStart.innerText = "Main Lagi";
        }
        if (catchFinalScore) {
            catchFinalScore.classList.remove('hidden');
            const scoreSpan = catchFinalScore.querySelector('span');
            if (scoreSpan) scoreSpan.innerText = catchScore;
        }
    }

    if (btnCatchStart) {
        btnCatchStart.addEventListener('click', startCatchGame);
    }

    const page6 = document.getElementById('page-6');
    if (page6) {
        const observerCatch = new MutationObserver(() => {
            if (!page6.classList.contains('active')) {
                catchGameRunning = false;
                if (catchOverlay) {
                    catchOverlay.classList.remove('hidden'); // Show start screen when returning
                    if (catchOverlayTitle) catchOverlayTitle.innerText = "Tangkap Hati & Kado!";
                    if (catchOverlayDesc) catchOverlayDesc.innerText = "Geser keranjang ke kiri dan kanan untuk menangkap, pastikan tidak mengambil hati yang retak (💔)!";
                    if (btnCatchStart) btnCatchStart.innerText = "Mulai Main";
                    if (catchFinalScore) catchFinalScore.classList.add('hidden');
                }
            } else if (!catchGameRunning) {
                resizeCatchCanvas();
            }
        });
        observerCatch.observe(page6, { attributes: true, attributeFilter: ['class'] });
    }


    /* ─── KEYBOARD NAVIGATION ─── */
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            if (currentPage === 'page-1' && !envelopeOpened) { openEnvelope(); return; }
            if (currentPage === 'page-1' && envelopeOpened && btnSurprise) { btnSurprise.click(); return; }
        }
        if (e.key === 'Escape') {
            if (['page-3', 'page-4', 'page-5', 'page-6', 'page-7'].includes(currentPage)) goTo('page-2');
        }
    });

    /* ─── TOUCH SWIPE ─── */
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return; // tap, ignore

        // Swipe left — go back to page-2 from sub-pages
        if (dx < -50 && Math.abs(dy) < Math.abs(dx)) {
            if (['page-3', 'page-4', 'page-5', 'page-6', 'page-7'].includes(currentPage)) {
                goTo('page-2');
            }
        }

        // Swipe up on page-1 — open envelope or go to page-2
        if (dy < -50 && Math.abs(dx) < Math.abs(dy)) {
            if (currentPage === 'page-1' && !envelopeOpened) {
                openEnvelope();
            } else if (currentPage === 'page-1' && envelopeOpened && btnSurprise) {
                btnSurprise.click();
            }
        }
    }, { passive: true });

    /* ─── INIT CONFETTI ON LOAD ─── */
    setTimeout(() => launchConfetti(60), 600);

    /* ─── GLOBAL MUSIC LISTENER ─── */
    document.body.addEventListener("click", () => {
        const music = document.getElementById("bg-music");
        if(music) music.play().catch(()=>{});
    }, { once: true });

}); // end DOMContentLoaded


/* ─── PAGE 5 ANIMATION ─── */
            window.startPage5Animation = function() {
                const envFlap = document.getElementById('env-flap-page5');
                const letter = document.getElementById('letter-page5');
                const envWrapper = document.getElementById('env-wrapper-page5');
                
                if (!envFlap || !letter || !envWrapper) return;

                // Pastikan class reset terlebih dahulu (jika dibuka ulang)
                envWrapper.style.animation = 'none';
                envWrapper.offsetHeight; // trigger reflow
                envWrapper.style.animation = 'riseStutter 3.2s 0.5s ease-out forwards';
                
                envFlap.classList.remove('open');
                letter.classList.remove('slide-out');

                // Hilangkan semua debu emas yang mungkin masih ada dari animasi sebelumnya
                document.querySelectorAll('.magic-dust').forEach(d => d.remove());

                // Urutan buka amplop
                setTimeout(() => {
                    // 1. Secara ajaib amplop terbuka sendiri
                    envFlap.classList.add('open');
                    
                    // 2. Segera setelah amplop kebuka, surat keluar dan debu emas beterbangan
                    setTimeout(() => {
                        letter.classList.add('slide-out');
                        createDust();
                    }, 700);

                }, 4000);

                function createDust() {
                    for(let i=0; i<30; i++) {
                        let dust = document.createElement('div');
                        dust.className = 'magic-dust';
                        
                        dust.style.left = '50%';
                        dust.style.top = '30%';
                        
                        let angle = Math.random() * Math.PI * 2;
                        let dist = 80 + Math.random() * 150; 
                        let tx = Math.cos(angle) * dist + 'px';
                        let ty = Math.sin(angle) * dist + 'px';
                        
                        dust.style.setProperty('--tx', tx);
                        dust.style.setProperty('--ty', ty);
                        
                        dust.style.animation = `poof ${1 + Math.random()}s ${Math.random()*0.3}s ease-out forwards`;
                        
                        envWrapper.appendChild(dust);
                        setTimeout(()=> dust.remove(), 2000);
                    }
                }
            };
