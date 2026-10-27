(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Waveforms: build bars from data-wave="h1,h2,..." */
  $$('[data-wave]').forEach((el) => {
    el.innerHTML = el.dataset.wave
      .split(',')
      .map((h) => `<i style="height:${parseInt(h, 10)}px"></i>`)
      .join('');
  });

  /* Mobile menu */
  const menuBtn = $('.menu-btn');
  const menu = $('#mobile-menu');
  const setMenu = (open) => {
    menu.hidden = !open;
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $('.ico-open', menuBtn).hidden = open;
    $('.ico-close', menuBtn).hidden = !open;
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      setMenu(false);
      menuBtn.focus();
    }
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });

  /* Demo modes */
  const drafts = { text: 'It was good, thank you!', speech: 'Speaking aloud…', sign: 'Listening to Priya…' };
  const labels = { text: 'SIGN → TEXT', speech: 'SIGN → SPEECH', sign: 'SPEECH → SIGN' };
  const setMode = (mode) => {
    $$('[data-mode-btn]').forEach((b) => {
      const on = b.dataset.modeBtn === mode;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    $$('[data-mode]').forEach((el) => {
      el.hidden = !el.dataset.mode.split(' ').includes(mode);
    });
    $('#draft').textContent = drafts[mode];
    $('#kbd-label').textContent = labels[mode];
  };
  $$('[data-mode-btn]').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.modeBtn)));

  /* Early-access form */
  const form = $('#join-form');
  const done = $('#join-done');
  const err = $('#join-err');
  const roleInput = form.elements.role;
  $$('[data-role]', form).forEach((chip) => {
    chip.addEventListener('click', () => {
      $$('[data-role]', form).forEach((c) => {
        const on = c === chip;
        c.classList.toggle('on', on);
        c.setAttribute('aria-pressed', String(on));
      });
      roleInput.value = chip.dataset.role;
    });
  });
  const showError = (msg) => {
    err.textContent = msg;
    err.hidden = false;
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.elements.email;
    if (!email.value.trim() || !email.checkValidity()) {
      showError('Please enter a valid email address.');
      email.setAttribute('aria-invalid', 'true');
      email.focus();
      return;
    }
    email.removeAttribute('aria-invalid');
    err.hidden = true;
    const submit = $('[type="submit"]', form);
    submit.disabled = true;
    try {
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email: email.value.trim(), role: roleInput.value }),
        });
        if (!res.ok) throw new Error(String(res.status));
      }
      form.hidden = true;
      done.hidden = false;
      done.focus();
    } catch (_) {
      showError('Something went wrong. Please try again in a moment.');
    } finally {
      submit.disabled = false;
    }
  });

  /* Scroll reveal */
  const items = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  }
})();
