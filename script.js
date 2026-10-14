/* ═══════════════════════════════════════════════════════════════
   Manika's Little World — Main Script
   A dreamy, gentle, premium digital sanctuary.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM Cache ───
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ─── State ───
  const state = {
    currentSection: 'home',
    breatheRunning: false,
    breathePaused: false,
    breatheTimer: null,
    breatheSessionTimer: null,
    breatheStartTime: 0,
    breathePausedElapsed: 0,
    breathePhase: 'idle', // idle | inhale | exhale | done
    currentAudio: null,
    audioPlaying: false,
    selectedSound: null,
    reducedMotion: false,
    ambienceIntensity: 70,
    editingEntryId: null,
    particleTimers: [],
    atmosphereParticleTimers: [],
  };

  // ─── Gentle Reminders ───
  const reminders = [
    "You don't have to figure everything out today.",
    "Rest is allowed, even when your to-do list isn't finished.",
    "Take things one little step at a time.",
    "You are allowed to have difficult days.",
    "Not every problem needs to be solved this very moment.",
    "Be as kind to yourself as you are to the people you love.",
    "It's okay to pause and begin again.",
    "You're doing better than you think you are.",
    "Some days, just getting through is enough.",
    "The world won't fall apart if you take a break.",
    "Your worth isn't measured by your productivity.",
    "It's okay to say 'I need a moment.'",
    "You are more than the sum of your worries.",
    "A deep breath is always a good place to start.",
    "You don't owe anyone perfection.",
    "Even flowers need a little rain to grow.",
    "Slow progress is still progress.",
    "You are allowed to outgrow the things that no longer serve you.",
    "Being gentle with yourself is not a weakness.",
    "Tomorrow is a fresh page whenever you're ready for it.",
  ];

  // ─── Letter Data ───
  const letters = [
    {
      title: "Open when you're stressed",
      icon: "🌿",
      greeting: "Hey, Manika 🤍",
      body: `If today feels like too much, you don't have to sort everything out right now. Take a little break, drink some water if you need it, and give yourself permission to slow down.\n\nYou don't have to be strong every second of the day. You're allowed to rest, and you're allowed to have days when things don't go perfectly.\n\nI hope this little corner gives you a moment of peace.`,
      signoff: "With love, your little brother. 🫂",
    },
    {
      title: "Open when you're tired",
      icon: "😴",
      greeting: "Hey, Manika 🤍",
      body: `I know you work so hard, and sometimes it feels like the tiredness just won't go away. But you don't have to push through every single moment.\n\nIf you can, close your eyes for a minute. Let your shoulders relax. You've done enough for today.\n\nRest isn't something you have to earn — it's something you deserve, simply because you're human.`,
      signoff: "Your little brother is cheering for you, always. 💤🤍",
    },
    {
      title: "Open when today feels difficult",
      icon: "🌧️",
      greeting: "Hey, Manika 🤍",
      body: `Some days are just hard, and there's no magic way to make them easier. But I want you to know that difficult days don't last forever, even when it feels like they might.\n\nYou don't have to pretend everything is fine. It's okay to feel however you're feeling right now. Just know that this moment will pass, and brighter ones are waiting.\n\nI'm really proud of you for getting through today.`,
      signoff: "Sending you a warm hug from your little brother. 🧸🤍",
    },
    {
      title: "Open when you need a smile",
      icon: "🌷",
      greeting: "Surprise! 🌷",
      body: `This is your reminder that even on an ordinary day, you deserve a little happiness.\n\nI hope something small makes you smile today. Maybe a beautiful song, a favourite snack, a funny memory, or simply a quiet moment where everything feels a little lighter.\n\nYou make the world a softer place just by being in it, and I hope you never forget that.`,
      signoff: "Sending you a tiny virtual hug from your little brother. 🤍",
    },
    {
      title: "Open when you feel overwhelmed",
      icon: "🌊",
      greeting: "Hey, Manika 🤍",
      body: `When everything feels like it's happening at once, it can be hard to know where to start. So let me remind you: you don't have to do everything at once.\n\nPick one small thing. Just one. And when that's done, pick the next one. You don't need a perfect plan — you just need to take one tiny step.\n\nAnd if even that feels like too much right now, it's okay to just sit here for a while. This little world isn't going anywhere.`,
      signoff: "One step at a time. Your little brother believes in you. 🌸",
    },
    {
      title: "Open when you need a little encouragement",
      icon: "✨",
      greeting: "Hey, Manika 🤍",
      body: `I know you might not always hear this enough, so here it is: you are capable of amazing things.\n\nNot because you have to be perfect, and not because you have to prove anything to anyone. But because you have a quiet strength that carries you through even the hardest days.\n\nWhatever you're facing right now, I believe you'll find your way through it. And even if you stumble, that's perfectly okay too.`,
      signoff: "Your biggest fan, your little brother. 💪🤍",
    },
    {
      title: "Open when you need to remember you're appreciated",
      icon: "💛",
      greeting: "Hey, Manika 🤍",
      body: `Sometimes we get so caught up in everything we have to do that we forget to notice the things we've already done.\n\nSo here's a reminder: you matter. The little things you do for the people around you, the way you care, the way you keep going — it all matters more than you know.\n\nYou don't always need a big reason to feel appreciated. You deserve it simply for being you.`,
      signoff: "Grateful to have you as my sister. Your little brother. 🌻🤍",
    },
    {
      title: "Open when you want a peaceful moment",
      icon: "🕊️",
      greeting: "Hey, Manika 🤍",
      body: `This is your permission slip to do absolutely nothing for a few minutes.\n\nNo tasks, no replies, no thinking about what comes next. Just this moment, right here.\n\nLet your mind be quiet. Let your shoulders drop. Let the world wait for a little while.\n\nYou've earned this moment of peace, and I hope it wraps around you like a warm blanket.`,
      signoff: "With all the love in the world, your little brother. 🌙🤍",
    },
  ];

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  function init() {
    // Check system reduced-motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    state.reducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', (e) => {
      state.reducedMotion = e.matches;
      $('#setting-motion').checked = e.matches;
      updateAmbientParticles();
    });

    // Set up setting toggles
    $('#setting-motion').checked = state.reducedMotion;

    initWelcomeScreen();
    initNavigation();
    initSettings();
    initHome();
    initBreathe();
    initLetters();
    initJournal();
    initPeacefulCorner();

    // Start ambient particles
    if (!state.reducedMotion) {
      createAmbientParticles();
    }

    // Welcome petals
    if (!state.reducedMotion) {
      createWelcomePetals();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // WELCOME SCREEN
  // ═══════════════════════════════════════════════════════════════

  function initWelcomeScreen() {
    const welcomeScreen = $('#welcome-screen');
    const enterBtn = $('#enter-btn');
    const mainApp = $('#main-app');

    enterBtn.addEventListener('click', () => {
      welcomeScreen.classList.add('leaving');

      setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        mainApp.setAttribute('aria-hidden', 'false');

        // Trigger fade-in
        requestAnimationFrame(() => {
          mainApp.classList.add('visible');
        });
      }, 800);
    });
  }

  function createWelcomePetals() {
    const container = $('.welcome-particles');
    if (!container) return;

    const count = 15;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if ($('#welcome-screen').classList.contains('hidden')) return;
        const petal = document.createElement('div');
        petal.className = 'welcome-petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (8 + Math.random() * 8) + 's';
        petal.style.animationDelay = '0s';
        petal.style.width = (8 + Math.random() * 8) + 'px';
        petal.style.height = petal.style.width;
        container.appendChild(petal);

        petal.addEventListener('animationend', () => petal.remove());
      }, i * 600);
    }

    // Keep creating petals
    const petalInterval = setInterval(() => {
      if ($('#welcome-screen').classList.contains('hidden')) {
        clearInterval(petalInterval);
        return;
      }
      if (container.children.length > 20) return;
      const petal = document.createElement('div');
      petal.className = 'welcome-petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = (8 + Math.random() * 8) + 's';
      petal.style.width = (8 + Math.random() * 8) + 'px';
      petal.style.height = petal.style.width;
      container.appendChild(petal);
      petal.addEventListener('animationend', () => petal.remove());
    }, 1200);

    state.particleTimers.push(petalInterval);
  }

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════════════

  function initNavigation() {
    // Desktop nav
    $$('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navigateTo(link.dataset.section);
      });
    });

    // Mobile nav
    $$('.mobile-nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        navigateTo(btn.dataset.section);
      });
    });

    // Shortcut cards on home
    $$('.shortcut-card').forEach((card) => {
      card.addEventListener('click', () => {
        navigateTo(card.dataset.goto);
      });
    });
  }

  function navigateTo(sectionId) {
    if (state.currentSection === sectionId) return;
    state.currentSection = sectionId;

    // Update desktop nav
    $$('.nav-link').forEach((link) => {
      const isActive = link.dataset.section === sectionId;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-selected', isActive);
    });

    // Update mobile nav
    $$('.mobile-nav-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.section === sectionId);
    });

    // Show/hide sections
    $$('.page-section').forEach((section) => {
      const id = section.id.replace('section-', '');
      const isActive = id === sectionId;
      section.classList.toggle('active', isActive);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close settings if open
    closeSettings();
  }

  // ═══════════════════════════════════════════════════════════════
  // SETTINGS
  // ═══════════════════════════════════════════════════════════════

  function initSettings() {
    const toggleBtn = $('#settings-toggle');
    const panel = $('#settings-panel');
    const closeBtn = $('#settings-close');

    toggleBtn.addEventListener('click', () => {
      const isHidden = panel.classList.contains('hidden');
      if (isHidden) {
        panel.classList.remove('hidden');
        toggleBtn.setAttribute('aria-expanded', 'true');
      } else {
        closeSettings();
      }
    });

    closeBtn.addEventListener('click', closeSettings);

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('hidden') &&
          !panel.contains(e.target) &&
          !toggleBtn.contains(e.target)) {
        closeSettings();
      }
    });

    // Sound toggle
    $('#setting-sound').addEventListener('change', (e) => {
      if (!e.target.checked && state.audioPlaying) {
        pauseAudio();
      }
    });

    // Volume
    $('#setting-volume').addEventListener('input', (e) => {
      if (state.currentAudio) {
        state.currentAudio.volume = e.target.value / 100;
      }
      $('#audio-volume').value = e.target.value;
    });

    // Ambience
    $('#setting-ambience').addEventListener('input', (e) => {
      state.ambienceIntensity = parseInt(e.target.value);
      updateAmbientParticles();
    });

    // Reduced motion
    $('#setting-motion').addEventListener('change', (e) => {
      state.reducedMotion = e.target.checked;
      updateAmbientParticles();
      updateAtmosphereEffects();
    });

    // Reset journal
    $('#settings-reset-journal').addEventListener('click', () => {
      showConfirm(
        'Delete all journal entries?',
        'This will permanently remove all saved entries from this browser. This cannot be undone.',
        () => {
          clearAllJournalEntries();
          closeSettings();
        }
      );
    });

    // Revisit welcome
    $('#settings-revisit-welcome').addEventListener('click', () => {
      closeSettings();
      showWelcomeAgain();
    });
  }

  function closeSettings() {
    $('#settings-panel').classList.add('hidden');
    $('#settings-toggle').setAttribute('aria-expanded', 'false');
  }

  function showWelcomeAgain() {
    const welcomeScreen = $('#welcome-screen');
    const mainApp = $('#main-app');

    mainApp.classList.remove('visible');

    setTimeout(() => {
      mainApp.classList.add('hidden');
      mainApp.setAttribute('aria-hidden', 'true');

      welcomeScreen.classList.remove('hidden', 'leaving');

      if (!state.reducedMotion) {
        createWelcomePetals();
      }
    }, 400);
  }

  // ═══════════════════════════════════════════════════════════════
  // HOME
  // ═══════════════════════════════════════════════════════════════

  function initHome() {
    showRandomReminder();
    $('#new-reminder-btn').addEventListener('click', showRandomReminder);
  }

  function showRandomReminder() {
    const textEl = $('#reminder-text');
    const index = Math.floor(Math.random() * reminders.length);

    // Fade transition
    textEl.style.opacity = '0';
    setTimeout(() => {
      textEl.textContent = `"${reminders[index]}"`;
      textEl.style.opacity = '1';
    }, 300);
  }

  // ═══════════════════════════════════════════════════════════════
  // BREATHE
  // ═══════════════════════════════════════════════════════════════

  function initBreathe() {
    $('#breathe-start').addEventListener('click', startBreathe);
    $('#breathe-pause').addEventListener('click', pauseBreathe);
    $('#breathe-stop').addEventListener('click', stopBreathe);
  }

  function startBreathe() {
    if (state.breathePaused) {
      // Resume
      state.breathePaused = false;
      state.breatheRunning = true;
      $('#breathe-pause').textContent = 'Pause';
      $('#breathe-pause').disabled = false;

      // Adjust start time for elapsed
      state.breatheStartTime = Date.now() - state.breathePausedElapsed;

      runBreatheCycle();
      startBreatheDurationTimer();
      updateBreatheElapsed();
      return;
    }

    state.breatheRunning = true;
    state.breathePaused = false;
    state.breatheStartTime = Date.now();
    state.breathePausedElapsed = 0;

    $('#breathe-start').disabled = true;
    $('#breathe-pause').disabled = false;
    $('#breathe-stop').disabled = false;
    $$('.breathe-select').forEach(s => s.disabled = true);

    runBreatheCycle();
    startBreatheDurationTimer();
    updateBreatheElapsed();
  }

  function pauseBreathe() {
    state.breathePaused = true;
    state.breatheRunning = false;
    state.breathePausedElapsed = Date.now() - state.breatheStartTime;

    clearTimeout(state.breatheTimer);
    clearTimeout(state.breatheSessionTimer);

    $('#breathe-pause').textContent = 'Resume';
    $('#breathe-start').disabled = false;
    $('#breathe-phase').textContent = 'Paused — take your time';

    const orb = $('#breathe-orb');
    orb.classList.remove('inhaling', 'exhaling');
    orb.querySelector('.breathe-orb-inner').style.transform = '';
  }

  function stopBreathe() {
    state.breatheRunning = false;
    state.breathePaused = false;
    state.breathePausedElapsed = 0;

    clearTimeout(state.breatheTimer);
    clearTimeout(state.breatheSessionTimer);

    const orb = $('#breathe-orb');
    orb.classList.remove('inhaling', 'exhaling');
    orb.querySelector('.breathe-orb-inner').style.transform = '';
    orb.querySelector('.breathe-orb-inner').style.transition = '';

    $('#breathe-phase').textContent = 'Ready when you are';
    $('#breathe-elapsed').textContent = '';
    $('#breathe-start').disabled = false;
    $('#breathe-start').textContent = 'Start';
    $('#breathe-pause').disabled = true;
    $('#breathe-pause').textContent = 'Pause';
    $('#breathe-stop').disabled = true;
    $$('.breathe-select').forEach(s => s.disabled = false);

    state.breathePhase = 'idle';
  }

  function runBreatheCycle() {
    if (!state.breatheRunning) return;

    const inhaleTime = parseInt($('#breathe-inhale').value) * 1000;
    const exhaleTime = parseInt($('#breathe-exhale').value) * 1000;
    const orb = $('#breathe-orb');
    const orbInner = orb.querySelector('.breathe-orb-inner');

    // Inhale
    state.breathePhase = 'inhale';
    orb.classList.remove('exhaling');
    orb.classList.add('inhaling');
    $('#breathe-phase').textContent = 'Breathe in gently…';

    if (!state.reducedMotion) {
      orbInner.style.transition = `transform ${inhaleTime}ms ease-in-out`;
      orbInner.style.transform = 'scale(1.4)';
    } else {
      orbInner.style.transition = `background ${inhaleTime}ms ease`;
      orbInner.style.background = 'radial-gradient(circle at 35% 35%, #F4BFD1 0%, #F8DCE8 40%, #E8E0F7 80%, rgba(232,224,247,0.8) 100%)';
    }

    state.breatheTimer = setTimeout(() => {
      if (!state.breatheRunning) return;

      // Exhale
      state.breathePhase = 'exhale';
      orb.classList.remove('inhaling');
      orb.classList.add('exhaling');
      $('#breathe-phase').textContent = 'Breathe out slowly…';

      if (!state.reducedMotion) {
        orbInner.style.transition = `transform ${exhaleTime}ms ease-in-out`;
        orbInner.style.transform = 'scale(1)';
      } else {
        orbInner.style.transition = `background ${exhaleTime}ms ease`;
        orbInner.style.background = 'radial-gradient(circle at 35% 35%, var(--sakura) 0%, var(--blush) 40%, var(--lavender) 80%, rgba(232,224,247,0.5) 100%)';
      }

      state.breatheTimer = setTimeout(() => {
        runBreatheCycle(); // Loop
      }, exhaleTime);

    }, inhaleTime);
  }

  function startBreatheDurationTimer() {
    const durationSec = parseInt($('#breathe-duration').value);
    if (durationSec === 0) return; // Infinite

    clearTimeout(state.breatheSessionTimer);

    const remaining = (durationSec * 1000) - state.breathePausedElapsed;

    state.breatheSessionTimer = setTimeout(() => {
      finishBreathe();
    }, remaining);
  }

  function finishBreathe() {
    state.breatheRunning = false;
    clearTimeout(state.breatheTimer);
    clearTimeout(state.breatheSessionTimer);

    const orb = $('#breathe-orb');
    orb.classList.remove('inhaling', 'exhaling');
    orb.querySelector('.breathe-orb-inner').style.transform = '';
    orb.querySelector('.breathe-orb-inner').style.transition = 'transform 1s ease';

    state.breathePhase = 'done';
    $('#breathe-phase').textContent = 'Well done. You gave yourself a gentle moment. 🌸';
    $('#breathe-start').disabled = false;
    $('#breathe-start').textContent = 'Start Again';
    $('#breathe-pause').disabled = true;
    $('#breathe-stop').disabled = true;
    $$('.breathe-select').forEach(s => s.disabled = false);
  }

  function updateBreatheElapsed() {
    if (!state.breatheRunning && !state.breathePaused) return;

    const elapsed = state.breathePaused
      ? state.breathePausedElapsed
      : Date.now() - state.breatheStartTime;

    const secs = Math.floor(elapsed / 1000);
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    $('#breathe-elapsed').textContent = `${mins}:${String(remainSecs).padStart(2, '0')}`;

    if (state.breatheRunning) {
      requestAnimationFrame(updateBreatheElapsed);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // LITTLE LETTERS
  // ═══════════════════════════════════════════════════════════════

  function initLetters() {
    const grid = $('#envelopes-grid');

    letters.forEach((letter, index) => {
      const card = document.createElement('button');
      card.className = 'envelope-card glass-card';
      card.setAttribute('aria-label', letter.title);
      card.innerHTML = `
        <span class="envelope-icon" aria-hidden="true">${letter.icon}</span>
        <p class="envelope-title">${letter.title}</p>
        <p class="envelope-hint">tap to open 🤍</p>
      `;

      card.addEventListener('click', () => openLetter(index));
      grid.appendChild(card);
    });

    // Close modal
    $('#letter-close').addEventListener('click', closeLetter);
    $('.letter-modal-overlay').addEventListener('click', closeLetter);

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!$('#letter-modal').classList.contains('hidden')) {
          closeLetter();
        }
        if (!$('#confirm-dialog').classList.contains('hidden')) {
          hideConfirm();
        }
      }
    });
  }

  function openLetter(index) {
    const letter = letters[index];
    const body = $('#letter-body');

    body.innerHTML = `
      <span class="letter-greeting">${letter.greeting}</span>
      <p>${letter.body.replace(/\n/g, '<br>')}</p>
      <span class="letter-signoff">${letter.signoff}</span>
    `;

    const modal = $('#letter-modal');
    modal.classList.remove('hidden');
    $('#letter-close').focus();
  }

  function closeLetter() {
    $('#letter-modal').classList.add('hidden');
  }

  // ═══════════════════════════════════════════════════════════════
  // JOURNAL
  // ═══════════════════════════════════════════════════════════════

  function initJournal() {
    // Privacy notice
    const privacyDismissed = safeGetItem('mlw_journal_privacy_dismissed');
    if (privacyDismissed === 'true') {
      $('#journal-privacy').classList.add('hidden');
    }

    $('#journal-privacy-dismiss').addEventListener('click', () => {
      $('#journal-privacy').classList.add('hidden');
      safeSetItem('mlw_journal_privacy_dismissed', 'true');
    });

    // Character counter
    $('#journal-body').addEventListener('input', () => {
      const len = $('#journal-body').value.length;
      $('#journal-char-count').textContent = `${len} character${len !== 1 ? 's' : ''}`;
    });

    // Save
    $('#journal-save').addEventListener('click', saveJournalEntry);

    // New entry
    $('#journal-new').addEventListener('click', () => {
      state.editingEntryId = null;
      $('#journal-title').value = '';
      $('#journal-body').value = '';
      $('#journal-char-count').textContent = '0 characters';
      $('#journal-title').focus();
    });

    // Render existing entries
    renderJournalEntries();
  }

  function getJournalEntries() {
    try {
      const raw = safeGetItem('mlw_journal_entries');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveJournalEntries(entries) {
    safeSetItem('mlw_journal_entries', JSON.stringify(entries));
  }

  function saveJournalEntry() {
    const title = $('#journal-title').value.trim();
    const body = $('#journal-body').value.trim();

    if (!title && !body) return;

    const entries = getJournalEntries();
    const now = new Date().toISOString();

    if (state.editingEntryId) {
      // Edit existing
      const entry = entries.find(e => e.id === state.editingEntryId);
      if (entry) {
        entry.title = title;
        entry.body = body;
        entry.updatedAt = now;
      }
      state.editingEntryId = null;
    } else {
      // New entry
      entries.unshift({
        id: 'j_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        title: title || 'Untitled',
        body: body,
        createdAt: now,
        updatedAt: now,
      });
    }

    saveJournalEntries(entries);
    renderJournalEntries();

    // Clear editor
    $('#journal-title').value = '';
    $('#journal-body').value = '';
    $('#journal-char-count').textContent = '0 characters';

    // Show save message
    showSaveMessage();
  }

  function showSaveMessage() {
    const msg = $('#journal-save-msg');
    msg.classList.remove('hidden');
    setTimeout(() => {
      msg.classList.add('hidden');
    }, 2500);
  }

  function renderJournalEntries() {
    const list = $('#journal-entries-list');
    const entries = getJournalEntries();

    if (entries.length === 0) {
      list.innerHTML = '<p class="journal-empty-state">No entries yet. Take your time. 🌷</p>';
      return;
    }

    list.innerHTML = '';

    entries.forEach((entry) => {
      const card = document.createElement('div');
      card.className = 'journal-entry-card glass-card';
      card.setAttribute('role', 'article');

      const date = new Date(entry.createdAt);
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });

      const preview = entry.body.length > 120
        ? entry.body.substring(0, 120) + '…'
        : entry.body;

      card.innerHTML = `
        <p class="journal-entry-title">${escapeHtml(entry.title)}</p>
        <p class="journal-entry-preview">${escapeHtml(preview)}</p>
        <div class="journal-entry-meta">
          <span class="journal-entry-date">${dateStr}</span>
          <div class="journal-entry-actions">
            <button class="edit-entry-btn" data-id="${entry.id}" aria-label="Edit entry">Edit</button>
            <button class="delete-entry-btn" data-id="${entry.id}" aria-label="Delete entry">Delete</button>
          </div>
        </div>
      `;

      // Open entry on card click (not button area)
      card.addEventListener('click', (e) => {
        if (e.target.closest('.journal-entry-actions')) return;
        loadEntryToEditor(entry.id);
      });

      list.appendChild(card);
    });

    // Edit buttons
    $$('.edit-entry-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        loadEntryToEditor(btn.dataset.id);
      });
    });

    // Delete buttons
    $$('.delete-entry-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showConfirm(
          'Delete this entry?',
          'This cannot be undone.',
          () => deleteJournalEntry(btn.dataset.id)
        );
      });
    });
  }

  function loadEntryToEditor(id) {
    const entries = getJournalEntries();
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    state.editingEntryId = id;
    $('#journal-title').value = entry.title;
    $('#journal-body').value = entry.body;
    $('#journal-char-count').textContent = `${entry.body.length} characters`;

    // Scroll to editor
    $('#journal-title').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deleteJournalEntry(id) {
    let entries = getJournalEntries();
    entries = entries.filter(e => e.id !== id);
    saveJournalEntries(entries);

    if (state.editingEntryId === id) {
      state.editingEntryId = null;
      $('#journal-title').value = '';
      $('#journal-body').value = '';
      $('#journal-char-count').textContent = '0 characters';
    }

    renderJournalEntries();
  }

  function clearAllJournalEntries() {
    safeRemoveItem('mlw_journal_entries');
    state.editingEntryId = null;
    $('#journal-title').value = '';
    $('#journal-body').value = '';
    $('#journal-char-count').textContent = '0 characters';
    renderJournalEntries();
  }

  // ═══════════════════════════════════════════════════════════════
  // PEACEFUL CORNER
  // ═══════════════════════════════════════════════════════════════

  function initPeacefulCorner() {
    // Theme buttons
    $$('.theme-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.theme-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const theme = btn.dataset.theme;
        setAtmosphereTheme(theme);
      });
    });

    // Audio select buttons
    $$('.audio-select-btn').forEach((btn) => {
      btn.addEventListener('click', () => selectSound(btn.dataset.sound));
    });

    // Audio controls
    $('#audio-play').addEventListener('click', toggleAudioPlayback);
    $('#audio-mute').addEventListener('click', toggleMute);
    $('#audio-volume').addEventListener('input', (e) => {
      if (state.currentAudio) {
        state.currentAudio.volume = e.target.value / 100;
      }
      $('#setting-volume').value = e.target.value;
    });

    // Initialize default theme effects
    updateAtmosphereEffects();
  }

  function setAtmosphereTheme(theme) {
    const atm = $('#peaceful-atmosphere');
    atm.className = 'peaceful-atmosphere theme-' + theme;
    updateAtmosphereEffects();
  }

  function updateAtmosphereEffects() {
    const effectsContainer = $('#atmosphere-effects');
    if (!effectsContainer) return;

    // Clear existing
    effectsContainer.innerHTML = '';
    state.atmosphereParticleTimers.forEach(clearInterval);
    state.atmosphereParticleTimers = [];

    if (state.reducedMotion) return;

    const atm = $('#peaceful-atmosphere');
    const themeClass = [...atm.classList].find(c => c.startsWith('theme-'));
    const theme = themeClass ? themeClass.replace('theme-', '') : 'sakura';

    const intensity = state.ambienceIntensity / 100;
    const count = Math.floor(12 * intensity);

    switch (theme) {
      case 'sakura':
        createAtmospherePetals(effectsContainer, count);
        break;
      case 'rain':
        createAtmosphereRain(effectsContainer, count * 3);
        break;
      case 'lavender':
        createAtmosphereFireflies(effectsContainer, count);
        break;
      case 'sunrise':
        createAtmosphereSunrays(effectsContainer, Math.floor(count / 2));
        createAtmosphereFireflies(effectsContainer, Math.floor(count / 2));
        break;
      case 'moonlight':
        createAtmosphereStars(effectsContainer, count * 2);
        break;
    }
  }

  function createAtmospherePetals(container, count) {
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'atm-particle atm-petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
      petal.style.animationDuration = (6 + Math.random() * 6) + 's';
      petal.style.animationDelay = (Math.random() * 6) + 's';
      container.appendChild(petal);
    }
  }

  function createAtmosphereRain(container, count) {
    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div');
      drop.className = 'atm-particle atm-raindrop';
      drop.style.left = Math.random() * 100 + '%';
      drop.style.animationDuration = (0.6 + Math.random() * 0.6) + 's';
      drop.style.animationDelay = (Math.random() * 2) + 's';
      container.appendChild(drop);
    }
  }

  function createAtmosphereStars(container, count) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'atm-particle atm-star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDuration = (2 + Math.random() * 3) + 's';
      star.style.animationDelay = (Math.random() * 3) + 's';
      container.appendChild(star);
    }
  }

  function createAtmosphereFireflies(container, count) {
    for (let i = 0; i < count; i++) {
      const ff = document.createElement('div');
      ff.className = 'atm-particle atm-firefly';
      ff.style.left = (10 + Math.random() * 80) + '%';
      ff.style.top = (10 + Math.random() * 80) + '%';
      ff.style.setProperty('--drift', (Math.random() * 40 - 20) + 'px');
      ff.style.setProperty('--drift-y', (Math.random() * 30 - 15) + 'px');
      ff.style.animationDuration = (3 + Math.random() * 4) + 's';
      ff.style.animationDelay = (Math.random() * 3) + 's';
      container.appendChild(ff);
    }
  }

  function createAtmosphereSunrays(container, count) {
    for (let i = 0; i < count; i++) {
      const ray = document.createElement('div');
      ray.className = 'atm-particle atm-sunray';
      ray.style.left = (10 + Math.random() * 80) + '%';
      ray.style.top = '0';
      ray.style.animationDuration = (3 + Math.random() * 4) + 's';
      ray.style.animationDelay = (Math.random() * 3) + 's';
      ray.style.transform = `rotate(${-10 + Math.random() * 20}deg)`;
      container.appendChild(ray);
    }
  }

  // ─── Audio ───

  const audioFiles = {
    rain: 'assets/audio/rain.mp3',
    forest: 'assets/audio/forest.mp3',
    water: 'assets/audio/water.mp3',
  };

  function selectSound(soundId) {
    // Update UI
    $$('.audio-select-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.sound === soundId);
      btn.setAttribute('aria-pressed', btn.dataset.sound === soundId);
    });

    state.selectedSound = soundId;

    // Stop current audio if different
    if (state.currentAudio) {
      state.currentAudio.pause();
      state.currentAudio = null;
      state.audioPlaying = false;
    }

    // Enable controls
    $('#audio-play').disabled = false;
    $('#audio-play').textContent = 'Play';
    $('#audio-mute').disabled = false;
    $('#audio-volume').disabled = false;

    const soundNames = { rain: 'Gentle Rain', forest: 'Soft Forest', water: 'Flowing Water' };
    $('#audio-status').textContent = `Selected: ${soundNames[soundId]}. Tap Play to start.`;
    $('#audio-missing-msg').classList.add('hidden');
  }

  function toggleAudioPlayback() {
    if (!state.selectedSound) return;

    if (state.audioPlaying && state.currentAudio) {
      pauseAudio();
      return;
    }

    // Check if sound toggle is off
    if (!$('#setting-sound').checked) {
      $('#setting-sound').checked = true;
    }

    playAudio();
  }

  function playAudio() {
    if (!state.selectedSound) return;

    const filePath = audioFiles[state.selectedSound];

    if (!state.currentAudio || state.currentAudio.src !== new URL(filePath, window.location.href).href) {
      state.currentAudio = new Audio(filePath);
      state.currentAudio.loop = true;
      state.currentAudio.volume = parseInt($('#audio-volume').value) / 100;

      state.currentAudio.addEventListener('error', () => {
        $('#audio-status').textContent = 'Audio file not found.';
        $('#audio-missing-msg').classList.remove('hidden');
        $('#audio-play').textContent = 'Play';
        state.audioPlaying = false;
      });
    }

    state.currentAudio.play().then(() => {
      state.audioPlaying = true;
      $('#audio-play').textContent = 'Pause';
      const soundNames = { rain: 'Gentle Rain', forest: 'Soft Forest', water: 'Flowing Water' };
      $('#audio-status').textContent = `Playing: ${soundNames[state.selectedSound]}`;
    }).catch(() => {
      $('#audio-status').textContent = 'Audio file not found.';
      $('#audio-missing-msg').classList.remove('hidden');
      state.audioPlaying = false;
    });
  }

  function pauseAudio() {
    if (state.currentAudio) {
      state.currentAudio.pause();
    }
    state.audioPlaying = false;
    $('#audio-play').textContent = 'Play';
    $('#audio-status').textContent = 'Paused. Tap Play to resume.';
  }

  function toggleMute() {
    if (!state.currentAudio) return;
    state.currentAudio.muted = !state.currentAudio.muted;
    $('#audio-mute').textContent = state.currentAudio.muted ? 'Unmute' : 'Mute';
  }

  // ═══════════════════════════════════════════════════════════════
  // AMBIENT PARTICLES
  // ═══════════════════════════════════════════════════════════════

  function createAmbientParticles() {
    const container = $('#ambient-particles');
    if (!container || state.reducedMotion) return;

    const intensity = state.ambienceIntensity / 100;

    // Create a few of each type
    const petalCount = Math.floor(6 * intensity);
    const glowCount = Math.floor(8 * intensity);
    const bokehCount = Math.floor(4 * intensity);

    function spawnParticle(type) {
      if (state.reducedMotion) return;

      const p = document.createElement('div');
      p.className = `ambient-particle ${type}`;
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = '-20px';

      const duration = (12 + Math.random() * 16) + 's';
      const driftX = (Math.random() * 80 - 40) + 'px';
      const driftRot = (Math.random() * 360) + 'deg';
      const opacity = 0.3 + Math.random() * 0.4;

      p.style.setProperty('--drift-x', driftX);
      p.style.setProperty('--drift-rot', driftRot);
      p.style.setProperty('--particle-opacity', opacity);
      p.style.animationDuration = duration;

      container.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }

    // Spawn initial batch
    for (let i = 0; i < petalCount; i++) {
      setTimeout(() => spawnParticle('petal'), Math.random() * 4000);
    }
    for (let i = 0; i < glowCount; i++) {
      setTimeout(() => spawnParticle('glow'), Math.random() * 5000);
    }
    for (let i = 0; i < bokehCount; i++) {
      setTimeout(() => spawnParticle('bokeh'), Math.random() * 6000);
    }

    // Continuously spawn
    const spawnInterval = setInterval(() => {
      if (state.reducedMotion) {
        clearInterval(spawnInterval);
        return;
      }
      if (container.children.length > 30) return;

      const types = ['petal', 'glow', 'glow', 'bokeh'];
      spawnParticle(types[Math.floor(Math.random() * types.length)]);
    }, 2000);

    state.particleTimers.push(spawnInterval);
  }

  function updateAmbientParticles() {
    const container = $('#ambient-particles');
    if (!container) return;

    // Clear existing
    container.innerHTML = '';
    state.particleTimers.forEach(clearInterval);
    state.particleTimers = [];

    if (!state.reducedMotion) {
      createAmbientParticles();
    }

    // Also update atmosphere effects
    updateAtmosphereEffects();
  }

  // ═══════════════════════════════════════════════════════════════
  // CONFIRM DIALOG
  // ═══════════════════════════════════════════════════════════════

  let confirmCallback = null;

  function showConfirm(title, desc, onConfirm) {
    $('#confirm-title').textContent = title;
    $('#confirm-desc').textContent = desc;
    confirmCallback = onConfirm;
    $('#confirm-dialog').classList.remove('hidden');

    const cancelBtn = $('#confirm-cancel');
    const okBtn = $('#confirm-ok');

    // Remove old listeners (simple re-bind)
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
    okBtn.replaceWith(okBtn.cloneNode(true));

    $('#confirm-cancel').addEventListener('click', hideConfirm);
    $('#confirm-ok').addEventListener('click', () => {
      if (confirmCallback) confirmCallback();
      hideConfirm();
    });
    $('.confirm-overlay').addEventListener('click', hideConfirm);

    $('#confirm-cancel').focus();
  }

  function hideConfirm() {
    $('#confirm-dialog').classList.add('hidden');
    confirmCallback = null;
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Safe localStorage wrappers
  function safeGetItem(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  function safeRemoveItem(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // BOOT
  // ═══════════════════════════════════════════════════════════════

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
