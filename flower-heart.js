/* ============================
   FLOWER HEART BACKGROUND — flower-heart.js
============================ */
document.addEventListener('DOMContentLoaded', () => {
    const flowers = ['🌸', '🌺', '🌷', '🌹', '💮', '🌼'];
    let lastPage7Active = false; // Track state to avoid redundant re-creation

    function createFlowerHeart() {
        const container = document.querySelector('.playlist-page-layout');
        if (!container) return;

        // Remove existing
        const existing = container.querySelector('.flower-heart-bg');
        if (existing) existing.remove();

        const heartDiv = document.createElement('div');
        heartDiv.className = 'flower-heart-bg';
        container.appendChild(heartDiv);

        const rect = container.getBoundingClientRect();
        const W = rect.width;
        const H = container.scrollHeight || rect.height;

        // Skip if container has no dimensions yet (hidden page)
        if (W === 0 || H === 0) return;

        const cx = W / 2;
        const cy = H / 2;

        // Scale: landscape heart (wide, not tall)
        const scaleX = W * 0.030;
        const scaleY = H * 0.022;

        const numFlowers = 60;
        for (let i = 0; i < numFlowers; i++) {
            const t = (i / numFlowers) * Math.PI * 2;

            // Parametric heart curve
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            const px = cx + hx * scaleX;
            const py = cy + hy * scaleY;

            const flower = document.createElement('div');
            flower.className = 'heart-flower-item';
            flower.textContent = flowers[i % flowers.length];
            flower.style.left = px + 'px';
            flower.style.top = py + 'px';
            flower.style.fontSize = (1.4 + Math.random() * 1.2) + 'rem';
            flower.style.animationDelay = (Math.random() * 3) + 's';
            flower.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;

            heartDiv.appendChild(flower);
        }
    }

    // Create when page-7 becomes visible
    const page7El = document.getElementById('page-7');
    if (page7El) {
        const observer = new MutationObserver(() => {
            const isActive = page7El.classList.contains('active');

            // Only recreate when page-7 transitions from inactive to active
            if (isActive && !lastPage7Active) {
                setTimeout(createFlowerHeart, 300);
            }
            lastPage7Active = isActive;
        });
        observer.observe(page7El, { attributes: true, attributeFilter: ['class'] });

        // Also create on load if page-7 is already active
        if (page7El.classList.contains('active')) {
            lastPage7Active = true;
            createFlowerHeart();
        }
    }

    // Debounced resize handler to avoid excessive re-creation
    let resizeTimer;
    window.addEventListener('resize', () => {
        const p7 = document.getElementById('page-7');
        if (p7 && p7.classList.contains('active')) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(createFlowerHeart, 250);
        }
    });
});
