(() => {
    const browser = document.getElementById('showreel-browser');
    if (!browser) return;

    const tabsEl = document.getElementById('sr-tabs');
    const subtabsEl = document.getElementById('sr-subtabs');
    const descEl = document.getElementById('sr-desc');
    const railEl = document.getElementById('sr-rail');
    const nowTag = document.getElementById('sr-now-tag');
    const nowTitle = document.getElementById('sr-now-title');
    const nowDate = document.getElementById('sr-now-date');
    const nowCollaborators = document.getElementById('sr-now-collaborators');
    const nowCount = document.getElementById('sr-now-count');
    const player = document.getElementById('sr-player');
    const video = player.querySelector('.vp-video');
    const ytBox = player.querySelector('.vp-yt');
    const ytFallback = player.querySelector('.vp-yt-fallback');
    const ytFallbackBtn = player.querySelector('.vp-yt-fallback-btn');
    const emptyBox = player.querySelector('.vp-empty');
    const bigPlay = player.querySelector('.vp-big-play');
    const playBtn = player.querySelector('.vp-play');
    const muteBtn = player.querySelector('.vp-mute');
    const volumeWrap = player.querySelector('.vp-volume');
    const volumeRange = player.querySelector('.vp-volume-range');
    const popoutBtn = player.querySelector('.vp-popout');
    const popoutFloat = player.querySelector('.vp-popout-float');
    const fsBtn = player.querySelector('.vp-fs');
    const barEl = player.querySelector('.vp-bar');
    const scrub = player.querySelector('.vp-scrub');
    const scrubFill = player.querySelector('.vp-scrub-fill');
    const timeEl = player.querySelector('.vp-time');
    const warnBox = document.getElementById('sr-warn');
    const warnList = document.getElementById('sr-warn-list');
    const warnContinue = document.getElementById('sr-warn-continue');

    const WARNING_COPY = {
        volume: {
            title: 'Volume Warning',
            text: 'This trailer has sudden loud audio. Lower your volume before continuing.',
            chip: 'Volume',
        },
        epileptic: {
            title: 'Epilepsy Warning',
            text: 'Contains rapid flashes and intense visual effects that may trigger seizures for people with photosensitive epilepsy.',
            chip: 'Epilepsy',
        },
    };

    const paintIcons = () => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({
                attrs: {
                    'stroke-width': '1.75',
                    width: '16',
                    height: '16',
                },
            });
        }
    };

    const bindCursorWrap = (element) => {
        element.addEventListener('mouseenter', () => {
            window.setCursorWrapElement?.(element, 'box');
        });
        element.addEventListener('mouseleave', (event) => {
            window.clearCursorWrapElement?.(event);
        });
    };

    let data = null;
    let catId = null;
    let subId = null;
    let items = [];
    let index = 0;
    let mode = 'empty'; // video | youtube | empty
    let scrubbing = false;
    let lastVolume = 1;
    let ytWatchdog = null;
    let warnActive = false;
    let warnPendingAutoplay = false;

    const itemWarnings = (item) => {
        if (!item || !Array.isArray(item.warnings)) return [];
        return item.warnings.filter((key) => WARNING_COPY[key]);
    };

    const hideWarn = () => {
        warnActive = false;
        warnPendingAutoplay = false;
        player.classList.remove('is-warn');
        if (warnBox) warnBox.hidden = true;
        if (warnList) warnList.innerHTML = '';
    };

    const showWarn = (item, { pendingAutoplay = false } = {}) => {
        const keys = itemWarnings(item);
        if (!keys.length || !warnBox || !warnList) {
            hideWarn();
            return false;
        }

        warnActive = true;
        warnPendingAutoplay = !!pendingAutoplay;
        warnList.innerHTML = keys.map((key) => {
            const copy = WARNING_COPY[key];
            return `<li class="vp-warn-item">
                <span class="vp-warn-item-title">${escapeAttr(copy.title)}</span>
                <p class="vp-warn-item-text">${escapeAttr(copy.text)}</p>
            </li>`;
        }).join('');
        warnBox.hidden = false;
        player.classList.add('is-warn');
        bigPlay.setAttribute('hidden', '');
        return true;
    };

    const warnChipsHtml = (item) => {
        const keys = itemWarnings(item);
        if (!keys.length) return '';
        return `<span class="sr-thumb-warn">${keys.map((key) =>
            `<span class="sr-thumb-warn-chip">${escapeAttr(WARNING_COPY[key].chip)}</span>`
        ).join('')}</span>`;
    };

    const fmt = (s) => {
        if (!Number.isFinite(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${String(sec).padStart(2, '0')}`;
    };

    const formatDate = (value) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return '';
        const [year, month, day] = value.split('-');
        return `${day}.${month}.${year}`;
    };

    const activeCollaborators = (item) => {
        if (Array.isArray(item?.collaborators) && item.collaborators.length) return item.collaborators;
        const category = data?.categories?.find((categoryItem) => categoryItem.id === catId);
        const subtab = category?.subtabs?.find((sub) => sub.id === subId);
        return subtab?.collaborators || category?.collaborators || [];
    };

    const collaboratorsHtml = (item) => activeCollaborators(item).map((person) =>
        `<a class="sr-now-collaborator" href="${escapeAttr(person.url)}" target="_blank" rel="noopener noreferrer">
            <img src="${escapeAttr(person.avatar)}" alt="" loading="lazy" width="24" height="24">
            <span>${escapeAttr(person.name)}</span>
        </a>`
    ).join('');

    const escapeAttr = (s) => String(s)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');

    const sourceUrl = (item) => {
        if (!item) return null;
        if (item.url) return item.url;
        if (item.type === 'youtube') return `https://www.youtube.com/watch?v=${item.id || item.src}`;
        if (item.src && item.src.includes('/lotb/')) {
            return `https://www.tiktok.com/@lotb.net/video/${item.id}`;
        }
        if (item.id) return `https://www.tiktok.com/@f1shyondrugs312/video/${item.id}`;
        return null;
    };

    const popoutTitle = (item, url) => {
        if (!item || !url) return '';
        if (item.type === 'youtube') return 'Open on YouTube';
        if (/tiktok\.com/i.test(url)) return 'Open on TikTok';
        if (/youtube\.com|youtu\.be/i.test(url)) return 'Open on YouTube';
        return 'Open project';
    };

    const setPopout = (item) => {
        const url = sourceUrl(item);
        const title = popoutTitle(item, url);
        const isYt = item && item.type === 'youtube';

        // Bar popout only for local videos (YouTube uses native controls + float link)
        if (popoutBtn) {
            if (!url || isYt) {
                popoutBtn.hidden = true;
                popoutBtn.removeAttribute('href');
            } else {
                popoutBtn.hidden = false;
                popoutBtn.href = url;
                popoutBtn.title = title;
            }
        }

        if (popoutFloat) {
            if (!url) {
                popoutFloat.hidden = true;
                popoutFloat.removeAttribute('href');
            } else {
                popoutFloat.hidden = false;
                popoutFloat.href = url;
                popoutFloat.title = title;
            }
        }
    };

    const setPlayingUI = (playing) => {
        playBtn.classList.toggle('is-playing', playing);
        player.classList.toggle('is-playing', playing);
        if (playing || mode !== 'video') {
            bigPlay.setAttribute('hidden', '');
        } else {
            bigPlay.removeAttribute('hidden');
        }
    };

    const syncVolumeUI = () => {
        const muted = video.muted || video.volume === 0;
        muteBtn.classList.toggle('is-muted', muted);
        player.classList.toggle('is-muted', muted);
        const shown = muted ? 0 : video.volume;
        volumeRange.value = String(shown);
        volumeRange.style.setProperty('--vp-vol', `${shown * 100}%`);
    };

    const setVolume = (value) => {
        const vol = Math.min(Math.max(Number(value), 0), 1);
        video.volume = vol;
        if (vol > 0) {
            lastVolume = vol;
            video.muted = false;
        } else {
            video.muted = true;
        }
        syncVolumeUI();
    };

    const stopLocal = () => {
        video.pause();
        video.removeAttribute('src');
        video.load();
        setPlayingUI(false);
    };

    const clearYt = () => {
        if (ytWatchdog) {
            clearTimeout(ytWatchdog);
            ytWatchdog = null;
        }
        ytBox.innerHTML = '';
        ytBox.hidden = true;
        ytFallback.hidden = true;
        player.classList.remove('is-yt-fallback');
    };

    const showYtFallback = (item) => {
        if (ytWatchdog) {
            clearTimeout(ytWatchdog);
            ytWatchdog = null;
        }
        ytBox.innerHTML = '';
        ytBox.hidden = true;
        mode = 'youtube';
        video.hidden = true;
        video.style.display = 'none';
        bigPlay.setAttribute('hidden', '');
        barEl.hidden = true;
        ytFallback.hidden = false;
        player.classList.add('is-yt-fallback');
        player.classList.remove('is-youtube');
        const url = sourceUrl(item);
        ytFallbackBtn.href = url || '#';
        setPopout(item);
        paintIcons();
    };

    const setAspect = (aspect) => {
        player.dataset.aspect = aspect || '16:9';
    };

    const updateTime = () => {
        const cur = video.currentTime || 0;
        const dur = video.duration || 0;
        timeEl.textContent = `${fmt(cur)} / ${fmt(dur)}`;
        const pct = dur ? (cur / dur) * 100 : 0;
        if (!scrubbing) scrubFill.style.width = `${pct}%`;
    };

    const loadItem = (i, { autoplay = false } = {}) => {
        hideWarn();

        if (!items.length) {
            mode = 'empty';
            stopLocal();
            clearYt();
            player.classList.remove('is-youtube', 'is-yt-fallback');
            player.classList.add('is-empty');
            video.hidden = true;
            video.style.display = 'none';
            bigPlay.setAttribute('hidden', '');
            barEl.hidden = true;
            popoutBtn.hidden = true;
            if (popoutFloat) popoutFloat.hidden = true;
            nowTag.textContent = catId === 'still' ? 'Still' : 'Empty';
            nowTitle.textContent = catId === 'still' ? 'Logos & layouts' : 'No clips in this tab';
            if (nowDate) {
                nowDate.textContent = '';
                nowDate.removeAttribute('datetime');
                nowDate.hidden = true;
            }
            if (nowCollaborators) nowCollaborators.innerHTML = '';
            nowCount.textContent = '';
            emptyBox.querySelector('.vp-empty-label').textContent =
                catId === 'still' ? 'COMING SOON' : 'NOTHING HERE';
            emptyBox.querySelector('.vp-empty-hint').textContent =
                catId === 'still' ? 'Logos & layouts land here later' : 'Pick another category';
            setAspect('16:9');
            return;
        }

        index = ((i % items.length) + items.length) % items.length;
        const item = items[index];
        player.classList.remove('is-empty');
        nowTag.textContent = item.tag || '';
        nowTitle.textContent = item.title || '';
        if (nowDate) {
            const formattedDate = formatDate(item.date);
            nowDate.textContent = formattedDate ? `Published ${formattedDate}` : '';
            nowDate.dateTime = item.date || '';
            nowDate.hidden = !formattedDate;
        }
        if (nowCollaborators) nowCollaborators.innerHTML = collaboratorsHtml(item);
        nowCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
        setAspect(item.aspect || '16:9');
        setPopout(item);

        [...railEl.children].forEach((el, idx) => {
            el.classList.toggle('is-active', idx === index);
        });
        const active = railEl.children[index];
        if (active && typeof active.scrollIntoView === 'function') {
            try {
                const vertical = window.matchMedia('(min-width: 1100px)').matches;
                active.scrollIntoView({
                    behavior: 'smooth',
                    inline: vertical ? 'nearest' : 'center',
                    block: vertical ? 'nearest' : 'nearest',
                });
            } catch (_) { /* ignore */ }
        }

        if (item.type === 'youtube') {
            mode = 'youtube';
            stopLocal();
            video.pause();
            video.removeAttribute('src');
            video.load();
            video.hidden = true;
            video.style.display = 'none';
            bigPlay.setAttribute('hidden', '');
            player.classList.add('is-youtube');
            player.classList.remove('is-yt-fallback', 'is-empty');

            // Known non-embeddable (from showreel.json) or runtime fallback
            if (item.embeddable === false) {
                showYtFallback(item);
                return;
            }

            clearYt();
            player.classList.add('is-youtube');
            barEl.hidden = true;
            ytBox.hidden = false;
            ytFallback.hidden = true;
            const auto = autoplay ? '1' : '0';
            ytBox.innerHTML = `<iframe
                id="sr-yt-frame"
                src="https://www.youtube-nocookie.com/embed/${item.src}?rel=0&modestbranding=1&playsinline=1&autoplay=${auto}"
                title="${escapeAttr(item.title)}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                loading="lazy"
            ></iframe>`;

            // YouTube posts error codes via postMessage when embedding is blocked
            const onMsg = (event) => {
                if (!String(event.origin || '').includes('youtube')) return;
                let payload = event.data;
                if (typeof payload === 'string') {
                    try { payload = JSON.parse(payload); } catch (_) { return; }
                }
                if (!payload || payload.event !== 'onError') return;
                const code = Number(payload.info);
                // 101 / 150 = embedding disabled by owner
                if (code === 101 || code === 150 || code === 100 || code === 2) {
                    window.removeEventListener('message', onMsg);
                    showYtFallback(item);
                }
            };
            window.addEventListener('message', onMsg);
            setTimeout(() => window.removeEventListener('message', onMsg), 10000);
            return;
        }

        mode = 'video';
        clearYt();
        player.classList.remove('is-youtube', 'is-yt-fallback');
        barEl.hidden = false;
        video.hidden = false;
        video.style.display = '';
        video.src = item.src;
        video.load();
        setPlayingUI(false);
        bigPlay.removeAttribute('hidden');
        updateTime();

        const needsWarn = showWarn(item, { pendingAutoplay: autoplay });
        if (needsWarn) {
            video.pause();
            setPlayingUI(false);
            return;
        }

        if (autoplay) {
            video.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
        }
    };

    const togglePlay = () => {
        if (mode !== 'video' || warnActive) return;
        if (video.paused) {
            video.play().then(() => setPlayingUI(true)).catch(() => {});
        } else {
            video.pause();
            setPlayingUI(false);
        }
    };

    const seekFromEvent = (e) => {
        if (mode !== 'video' || !video.duration) return;
        const rect = scrub.getBoundingClientRect();
        const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        scrubFill.style.width = `${x * 100}%`;
        video.currentTime = x * video.duration;
        updateTime();
    };

    const getActiveItems = () => {
        const cat = data.categories.find((c) => c.id === catId);
        if (!cat) return { items: [], desc: '', empty: true };
        if (cat.subtabs) {
            const sub = cat.subtabs.find((s) => s.id === subId) || cat.subtabs[0];
            return { items: sub.items || [], desc: cat.desc, empty: false, sub };
        }
        return { items: cat.items || [], desc: cat.desc, empty: !!cat.empty };
    };

    const renderRail = () => {
        railEl.innerHTML = '';
        if (!items.length) {
            railEl.innerHTML = '<div class="sr-rail-empty">Nothing here yet — placeholders only.</div>';
            return;
        }

        items.forEach((item, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `sr-thumb sr-thumb--${item.aspect === '9:16' ? 'portrait' : 'wide'}`;
            btn.dataset.index = String(i);

            const badge = item.type === 'youtube' && item.embeddable === false
                ? '<span class="sr-thumb-badge">YT only</span>'
                : '';
            const warnBadge = warnChipsHtml(item);
            const date = formatDate(item.date);
            const dateHtml = date
                ? `<time class="sr-thumb-date" datetime="${item.date}">${date}</time>`
                : '';

            if (item.type === 'youtube') {
                btn.innerHTML = `
                    <div class="sr-thumb-media">
                        <img src="https://i.ytimg.com/vi/${item.src}/hqdefault.jpg" alt="" loading="lazy">
                        <span class="sr-thumb-play"></span>
                        ${badge}
                        ${warnBadge}
                    </div>
                    <span class="sr-thumb-meta">
                        <span class="sr-thumb-tag">${escapeAttr(item.tag)}</span>
                        <span class="sr-thumb-title">${escapeAttr(item.title)}</span>
                        ${dateHtml}
                    </span>`;
            } else {
                btn.innerHTML = `
                    <div class="sr-thumb-media">
                        <video muted playsinline preload="metadata" src="${escapeAttr(item.src)}"></video>
                        <span class="sr-thumb-play"></span>
                        ${warnBadge}
                    </div>
                    <span class="sr-thumb-meta">
                        <span class="sr-thumb-tag">${escapeAttr(item.tag)}</span>
                        <span class="sr-thumb-title">${escapeAttr(item.title)}</span>
                        ${dateHtml}
                    </span>`;
            }

            btn.addEventListener('click', () => loadItem(i, { autoplay: true }));
            railEl.appendChild(btn);
        });
    };

    const renderSubtabs = (cat) => {
        if (!cat.subtabs) {
            subtabsEl.hidden = true;
            subtabsEl.innerHTML = '';
            subId = null;
            return;
        }
        subtabsEl.hidden = false;
        subtabsEl.innerHTML = '';
        if (!subId || !cat.subtabs.some((s) => s.id === subId)) {
            subId = cat.subtabs[0].id;
        }
        cat.subtabs.forEach((sub) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'sr-subtab' + (sub.id === subId ? ' is-active' : '');
            btn.textContent = `${sub.label} (${sub.items.length})`;
            bindCursorWrap(btn);
            btn.addEventListener('click', () => {
                subId = sub.id;
                refresh();
            });
            subtabsEl.appendChild(btn);
        });
    };

    const refresh = () => {
        const cat = data.categories.find((c) => c.id === catId);
        [...tabsEl.children].forEach((el) => {
            el.classList.toggle('is-active', el.dataset.id === catId);
        });
        renderSubtabs(cat);
        const active = getActiveItems();
        items = active.items;
        descEl.textContent = active.desc || '';
        renderRail();
        loadItem(0, { autoplay: false });
    };

    const renderTabs = () => {
        tabsEl.innerHTML = '';
        data.categories.forEach((cat) => {
            const count = cat.subtabs
                ? cat.subtabs.reduce((n, s) => n + s.items.length, 0)
                : (cat.items || []).length;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'sr-tab';
            btn.dataset.id = cat.id;
            btn.setAttribute('role', 'tab');
            btn.innerHTML = `<span class="sr-tab-label">${cat.label}</span><span class="sr-tab-count">${cat.empty ? 'soon' : count}</span>`;
            bindCursorWrap(btn);
            btn.addEventListener('click', () => {
                if (catId === cat.id) return;
                catId = cat.id;
                subId = cat.subtabs ? cat.subtabs[0].id : null;
                refresh();
            });
            tabsEl.appendChild(btn);
        });
    };

    // Player events
    bigPlay.addEventListener('click', togglePlay);
    playBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateTime);
    video.addEventListener('ended', () => {
        setPlayingUI(false);
        if (items.length > 1) loadItem(index + 1, { autoplay: true });
    });
    video.addEventListener('play', () => {
        if (warnActive) {
            video.pause();
            setPlayingUI(false);
            return;
        }
        setPlayingUI(true);
    });
    video.addEventListener('pause', () => setPlayingUI(false));

    if (warnContinue) {
        warnContinue.addEventListener('click', () => {
            if (!warnActive) return;
            const shouldPlay = warnPendingAutoplay;
            hideWarn();
            if (mode === 'video') {
                bigPlay.removeAttribute('hidden');
                if (shouldPlay) {
                    video.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
                } else {
                    setPlayingUI(false);
                }
            }
        });
    }

    muteBtn.addEventListener('click', () => {
        if (video.muted || video.volume === 0) {
            video.muted = false;
            video.volume = lastVolume > 0 ? lastVolume : 1;
        } else {
            lastVolume = video.volume || 1;
            video.muted = true;
        }
        syncVolumeUI();
    });

    volumeRange.addEventListener('input', () => setVolume(volumeRange.value));
    volumeRange.addEventListener('click', (e) => e.stopPropagation());
    volumeWrap.addEventListener('pointerdown', (e) => e.stopPropagation());

    const isFullscreen = () => !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.webkitCurrentFullScreenElement ||
        (typeof video.webkitDisplayingFullscreen === 'boolean' && video.webkitDisplayingFullscreen)
    );

    const isPlayerFullscreen = () => {
        const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement;
        return !!(fsEl && (fsEl === player || player.contains(fsEl)));
    };

    let fsControlsTimer = null;
    let fsPointerOnBar = false;
    let fsMoveBound = false;

    const clearFsControlsTimer = () => {
        if (fsControlsTimer) {
            clearTimeout(fsControlsTimer);
            fsControlsTimer = null;
        }
    };

    const showFsControls = () => {
        if (!player.classList.contains('is-native-fs') && !isPlayerFullscreen()) return;
        player.classList.add('is-fs-controls');
        clearFsControlsTimer();
        fsControlsTimer = setTimeout(() => {
            if (fsPointerOnBar) {
                showFsControls();
                return;
            }
            player.classList.remove('is-fs-controls');
        }, 2500);
    };

    const onFsMouseMove = () => showFsControls();

    const bindFsMove = () => {
        if (fsMoveBound) return;
        fsMoveBound = true;
        document.addEventListener('mousemove', onFsMouseMove, { passive: true });
        document.addEventListener('pointermove', onFsMouseMove, { passive: true });
    };

    const unbindFsMove = () => {
        if (!fsMoveBound) return;
        fsMoveBound = false;
        document.removeEventListener('mousemove', onFsMouseMove);
        document.removeEventListener('pointermove', onFsMouseMove);
    };

    const syncFullscreenUI = () => {
        const on = isFullscreen();
        const playerFs = isPlayerFullscreen();
        player.classList.toggle('is-native-fs', playerFs);
        if (playerFs) {
            bindFsMove();
            showFsControls();
            fsBtn?.setAttribute('aria-label', 'Exit fullscreen');
        } else {
            unbindFsMove();
            player.classList.remove('is-fs-controls');
            clearFsControlsTimer();
            fsPointerOnBar = false;
            fsBtn?.setAttribute('aria-label', 'Fullscreen');
            // If some other element (e.g. <video>) got fullscreen, leave it —
            // desktop path always targets the player.
            if (!on) {
                /* exited */
            }
        }
    };

    const exitFullscreen = () => {
        if (typeof video.webkitExitFullscreen === 'function' && video.webkitDisplayingFullscreen) {
            video.webkitExitFullscreen();
            return;
        }
        const exit = document.exitFullscreen
            || document.webkitExitFullscreen
            || document.webkitCancelFullScreen;
        exit?.call(document);
    };

    const enterFullscreen = () => {
        // iOS Safari: only <video> supports fullscreen (not arbitrary elements)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        if (isIOS && typeof video.webkitEnterFullscreen === 'function') {
            const go = () => {
                try {
                    video.controls = true;
                    video.webkitEnterFullscreen();
                } catch (_) { /* ignore */ }
            };
            if (video.paused) {
                video.play().then(go).catch(go);
            } else {
                go();
            }
            return;
        }

        // Always fullscreen the whole player so the bottom bar stays available
        const req = player.requestFullscreen
            || player.webkitRequestFullscreen
            || player.webkitRequestFullScreen;

        if (!req) return;
        const result = req.call(player);
        if (result && typeof result.catch === 'function') {
            result.catch(() => {});
        }
    };

    const toggleFullscreen = () => {
        if (mode !== 'video') return;
        if (isFullscreen()) exitFullscreen();
        else enterFullscreen();
    };

    fsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFullscreen();
    });

    // Keep UI in sync when user exits via native controls (esp. iOS)
    video.addEventListener('webkitbeginfullscreen', () => {
        video.controls = true;
        player.classList.add('is-native-fs');
    });
    video.addEventListener('webkitendfullscreen', () => {
        video.controls = false;
        player.classList.remove('is-native-fs');
        player.classList.remove('is-fs-controls');
        clearFsControlsTimer();
        unbindFsMove();
    });
    document.addEventListener('fullscreenchange', syncFullscreenUI);
    document.addEventListener('webkitfullscreenchange', syncFullscreenUI);

    player.addEventListener('mousemove', () => {
        if (player.classList.contains('is-native-fs')) showFsControls();
    });
    player.addEventListener('pointerdown', () => {
        if (player.classList.contains('is-native-fs')) showFsControls();
    });
    barEl.addEventListener('pointerenter', () => {
        fsPointerOnBar = true;
        if (player.classList.contains('is-native-fs')) showFsControls();
    });
    barEl.addEventListener('pointerleave', () => {
        fsPointerOnBar = false;
        if (player.classList.contains('is-native-fs')) showFsControls();
    });

    scrub.addEventListener('pointerdown', (e) => {
        scrubbing = true;
        scrub.setPointerCapture(e.pointerId);
        seekFromEvent(e);
    });
    scrub.addEventListener('pointermove', (e) => {
        if (!scrubbing) return;
        seekFromEvent(e);
    });
    scrub.addEventListener('pointerup', () => { scrubbing = false; });
    scrub.addEventListener('pointercancel', () => { scrubbing = false; });

    const scrollRail = (dir) => {
        const vertical = window.matchMedia('(min-width: 1100px)').matches;
        const amount = 280 * dir;
        railEl.scrollBy(vertical
            ? { top: amount, behavior: 'smooth' }
            : { left: amount, behavior: 'smooth' });
    };

    document.getElementById('sr-rail-prev').addEventListener('click', () => scrollRail(-1));
    document.getElementById('sr-rail-next').addEventListener('click', () => scrollRail(1));

    document.addEventListener('keydown', (e) => {
        if (!player.offsetParent) return;
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) return;

        if (e.key === ' ' && mode === 'video') {
            e.preventDefault();
            togglePlay();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            loadItem(index + 1, { autoplay: mode === 'video' });
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            loadItem(index - 1, { autoplay: mode === 'video' });
        } else if ((e.key === 'm' || e.key === 'M') && mode === 'video') {
            muteBtn.click();
        } else if ((e.key === 'f' || e.key === 'F') && mode === 'video') {
            toggleFullscreen();
        }
    });

    fetch('media/showreel.json')
        .then((r) => r.json())
        .then((json) => {
            data = json;
            catId = data.categories[0].id;
            paintIcons();
            renderTabs();
            browser.hidden = false;
            refresh();
            video.volume = 1;
            syncVolumeUI();
            paintIcons();
        })
        .catch((err) => {
            console.error('Showreel failed to load', err);
            browser.hidden = false;
            descEl.textContent = 'Could not load showreel data.';
        });
})();
