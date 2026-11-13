(() => {
  const root = document.documentElement;
  const base = new URL('../', document.currentScript.src);
  const en = root.lang.startsWith('en');
  const t = (he, english) => en ? english : he;
  const key = 'recw-accessibility';
  const defaults = {size:'100', theme:'dark', contrast:false, links:false, motion:false};
  let saved; try { saved=JSON.parse(localStorage.getItem(key)); } catch {}
  const prefs={...defaults,...saved};
  if (!['100','125','150'].includes(prefs.size)) prefs.size='150';
  if (!['light','dark'].includes(prefs.theme)) prefs.theme='dark';
  const launcher=document.createElement('button');
  launcher.type='button'; launcher.className='a11y-launcher';
  launcher.setAttribute('aria-label',t('אפשרויות נגישות','Accessibility options'));
  launcher.title=t('נגישות','Accessibility'); launcher.setAttribute('aria-haspopup','dialog');
  launcher.innerHTML='<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="4" r="1.5"/><path d="m4 8 8 1 8-1m-8 1v5m0 0-4 7m4-7 4 7"/></svg>';
  const panel=document.createElement('dialog'); panel.className='a11y-panel';
  panel.setAttribute('aria-labelledby','a11y-title');
  panel.innerHTML=`<div class="a11y-heading"><h2 id="a11y-title">${t('אפשרויות נגישות','Accessibility')}</h2><button type="button" data-close autofocus aria-label="${t('סגירה','Close')}">×</button></div>
  <label>${t('גודל טקסט','Text size')} <select data-pref="size"><option value="100">100%</option><option value="125">125%</option><option value="150">150%</option></select></label>
  <label>${t('תצוגה','Appearance')} <select data-pref="theme"><option value="dark">${t('כהה','Dark')}</option><option value="light">${t('בהירה','Light')}</option></select></label>
  <label><input type="checkbox" data-pref="contrast">${t('ניגודיות גבוהה','High contrast')}</label>
  <label><input type="checkbox" data-pref="links">${t('הדגשת קישורים','Highlight links')}</label>
  <label><input type="checkbox" data-pref="motion">${t('הפחתת תנועה','Reduce motion')}</label>
  <button type="button" data-reset>${t('איפוס התאמות','Reset preferences')}</button>`;
  function apply() {
    root.dataset.textSize=prefs.size; root.dataset.theme=prefs.theme;
    for(const name of ['contrast','links','motion']) root.toggleAttribute('data-a11y-'+name,prefs[name]===true);
    for(const c of panel.querySelectorAll('[data-pref]')) {if(c.type==='checkbox') c.checked=prefs[c.dataset.pref]===true; else c.value=prefs[c.dataset.pref];}
  }
  function save(){apply();try{localStorage.setItem(key,JSON.stringify(prefs));}catch{}}
  launcher.onclick=()=>panel.showModal(); panel.querySelector('[data-close]').onclick=()=>panel.close();
  panel.addEventListener('close',()=>launcher.focus());
  panel.querySelector('[data-reset]').onclick=()=>{Object.assign(prefs,defaults);save();};
  panel.onchange=e=>{const c=e.target;if(!c.dataset.pref)return;prefs[c.dataset.pref]=c.type==='checkbox'?c.checked:c.value;save();};
  document.body.append(launcher,panel); apply();
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const android=/Android/i.test(navigator.userAgent);
  const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
  if(android||(ios&&!standalone)) {
    const install=document.createElement(android?'a':'button');
    install.className='install-launcher';
    install.setAttribute('aria-label',android?t('הורדת isrRec לאנדרואיד','Download isrRec for Android'):t('הוספת האתר למסך הבית','Add website to Home Screen'));
    install.title=install.getAttribute('aria-label');
    install.innerHTML='<svg aria-hidden="true" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></svg>';
    if(android){install.href=new URL('RecW.apk',base);install.download='isrRec.apk';}
    else {
      install.type='button';install.setAttribute('aria-haspopup','dialog');
      const help=document.createElement('dialog');help.className='a11y-panel';help.setAttribute('aria-labelledby','install-title');
      help.innerHTML=`<h2 id="install-title">${t('הוספת האתר למסך הבית','Add website to Home Screen')}</h2><p>${t('פתחו את האתר ב־Safari, לחצו על שיתוף ובחרו ״הוסף למסך הבית״.','Open this website in Safari, tap Share, then choose Add to Home Screen.')}</p><p>${t('זהו קיצור דרך לאתר. אפליקציית ההקלטה זמינה לאנדרואיד בלבד.','This adds a website shortcut. The recording app is available for Android only.')}</p><button type="button" autofocus>${t('סגירה','Close')}</button>`;
      help.querySelector('button').onclick=()=>help.close();help.addEventListener('close',()=>install.focus());install.onclick=()=>help.showModal();document.body.append(help);
    }
    document.body.append(install);
  }
})();
