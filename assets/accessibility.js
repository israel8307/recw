(() => {
  const root = document.documentElement;
  const key = 'recw-accessibility';
  const defaults = { size: '100', contrast: false, links: false, motion: false };
  let saved;
  try { saved = JSON.parse(localStorage.getItem(key)); } catch {}
  const prefs = { ...defaults, ...saved };
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'a11y-launcher';
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.innerHTML = '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="4" r="1.5"/><path d="m4 8 8 1 8-1m-8 1v5m0 0-4 7m4-7 4 7"/></svg><span>נגישות</span>';
  const panel = document.createElement('dialog');
  panel.className = 'a11y-panel';
  panel.setAttribute('aria-labelledby', 'a11y-title');
  panel.innerHTML = `
    <div class="a11y-heading"><h2 id="a11y-title">אפשרויות נגישות</h2>
    <button type="button" data-close autofocus aria-label="סגירת אפשרויות נגישות">×</button></div>
    <label>גודל טקסט <select data-pref="size">
      <option value="100">100%</option><option value="125">125%</option>
      <option value="150">150%</option><option value="200">200%</option>
    </select></label>
    <label><input type="checkbox" data-pref="contrast"> ניגודיות גבוהה</label>
    <label><input type="checkbox" data-pref="links"> הדגשת קישורים</label>
    <label><input type="checkbox" data-pref="motion"> הפחתת תנועה</label>
    <button type="button" data-reset>איפוס התאמות</button>`;
  const controls = [...panel.querySelectorAll('[data-pref]')];

  function apply() {
    root.dataset.textSize = ['100', '125', '150', '200'].includes(prefs.size) ? prefs.size : '100';
    for (const name of ['contrast', 'links', 'motion']) {
      root.toggleAttribute('data-a11y-' + name, prefs[name] === true);
    }
    for (const control of controls) {
      const name = control.dataset.pref;
      if (control.type === 'checkbox') control.checked = prefs[name] === true;
      else control.value = root.dataset.textSize;
    }
  }

  function save() {
    apply();
    try { localStorage.setItem(key, JSON.stringify(prefs)); } catch {}
  }

  launcher.addEventListener('click', () => panel.showModal());
  panel.querySelector('[data-close]').addEventListener('click', () => panel.close());
  panel.addEventListener('close', () => launcher.focus());
  panel.querySelector('[data-reset]').addEventListener('click', () => {
    Object.assign(prefs, defaults);
    save();
  });
  panel.addEventListener('change', (event) => {
    const control = event.target;
    if (!control.dataset.pref) return;
    prefs[control.dataset.pref] = control.type === 'checkbox' ? control.checked : control.value;
    save();
  });
  document.body.append(launcher, panel);
  apply();
})();
