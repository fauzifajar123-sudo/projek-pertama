// playlist.js — Playlist Lagu (Page 7)
document.addEventListener('DOMContentLoaded', () => {
    const playlistAudio = document.getElementById('playlist-audio');
    const bgMusic = document.getElementById('bg-music');
    const songCards = document.querySelectorAll('.pl-song-card');
    const btnBack = document.getElementById('btn-playlist-back');

    if (!playlistAudio || songCards.length === 0) return; // Safety check

    let currentSongIndex = -1;
    let isPlaying = false;

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function loadSong(index) {
        const card = songCards[index];
        if (!card) return;

        const src = card.getAttribute('data-src');
        if (!src) return; // No source URL provided

        playlistAudio.src = src;

        // Update active state
        songCards.forEach((c, i) => {
            c.classList.remove('pl-active');
            const btn = c.querySelector('.pl-play-btn');
            if (btn) btn.textContent = '▶';
            // Reset progress
            const fill = c.querySelector('.pl-mini-progress-fill');
            if (fill) fill.style.width = '0%';
            const dur = c.querySelector('.pl-song-duration');
            if (dur && i !== index) dur.textContent = dur.getAttribute('data-original-duration') || dur.textContent;
        });

        card.classList.add('pl-active');
        currentSongIndex = index;
    }

    function playSong(index) {
        if (currentSongIndex !== index) {
            loadSong(index);
        }

        // Pause background music
        if (bgMusic && !bgMusic.paused) {
            bgMusic.pause();
            const mIconOn = document.getElementById('music-icon-on');
            const mIconOff = document.getElementById('music-icon-off');
            if (mIconOn) mIconOn.style.display = 'none';
            if (mIconOff) mIconOff.style.display = 'block';
        }

        playlistAudio.play().then(() => {
            isPlaying = true;
            const card = songCards[currentSongIndex];
            if (card) {
                const btn = card.querySelector('.pl-play-btn');
                if (btn) btn.textContent = '⏸';
            }
        }).catch((err) => {
            // Audio failed to play — reset state so user can retry
            console.warn('Playlist audio play failed:', err.message);
            isPlaying = false;
            const card = songCards[currentSongIndex];
            if (card) {
                const btn = card.querySelector('.pl-play-btn');
                if (btn) btn.textContent = '▶';
            }
        });
    }

    function pauseSong() {
        playlistAudio.pause();
        isPlaying = false;
        if (currentSongIndex >= 0 && currentSongIndex < songCards.length) {
            const btn = songCards[currentSongIndex].querySelector('.pl-play-btn');
            if (btn) btn.textContent = '▶';
        }
    }

    function nextSong() {
        let next = currentSongIndex + 1;
        if (next >= songCards.length) next = 0;
        playSong(next);
    }

    // Store original durations
    songCards.forEach(card => {
        const dur = card.querySelector('.pl-song-duration');
        if (dur) dur.setAttribute('data-original-duration', dur.textContent);
    });

    // Click handlers
    songCards.forEach((card, index) => {
        function handleClick(e) {
            e.stopPropagation();
            if (currentSongIndex === index && isPlaying) {
                pauseSong();
            } else {
                playSong(index);
            }
        }

        card.addEventListener('click', handleClick);
    });

    // Update progress
    playlistAudio.addEventListener('timeupdate', () => {
        if (currentSongIndex < 0 || currentSongIndex >= songCards.length) return;
        const card = songCards[currentSongIndex];
        if (!card) return;

        const fill = card.querySelector('.pl-mini-progress-fill');
        const dur = card.querySelector('.pl-song-duration');

        const { duration, currentTime } = playlistAudio;
        if (!isNaN(duration) && duration > 0) {
            const percent = (currentTime / duration) * 100;
            if (fill) fill.style.width = percent + '%';
            if (dur) dur.textContent = formatTime(currentTime);
        }
    });

    // Handle audio errors gracefully
    playlistAudio.addEventListener('error', () => {
        console.warn('Playlist audio failed to load');
        isPlaying = false;
        if (currentSongIndex >= 0 && currentSongIndex < songCards.length) {
            const btn = songCards[currentSongIndex].querySelector('.pl-play-btn');
            if (btn) btn.textContent = '▶';
        }
    });

    // Song ended — play next
    playlistAudio.addEventListener('ended', nextSong);

    // Pause when going back
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            if (isPlaying) pauseSong();
        });
    }

    // Stop playback when leaving page-7
    const page7 = document.getElementById('page-7');
    if (page7) {
        const observerPlaylist = new MutationObserver(() => {
            if (!page7.classList.contains('active') && isPlaying) {
                pauseSong();
            }
        });
        observerPlaylist.observe(page7, { attributes: true, attributeFilter: ['class'] });
    }
});
