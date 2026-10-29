(() => {
  'use strict';
  const data = window.ISLAND_CONTENT;
  const $ = s => document.querySelector(s);
  const prefix = `retro-showroom:${document.body.dataset.style}:`;
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(prefix + key)) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(prefix + key, JSON.stringify(value)); return true; } catch { return false; } };
  const node = (tag, cls, text) => { const el = document.createElement(tag); if (cls) el.className = cls; if (text !== undefined) el.textContent = text; return el; };
  const toast = node('div', 'site-toast'); toast.setAttribute('role', 'status'); toast.hidden = true; document.body.append(toast);
  let toastTimer;
  function notify(message) { clearTimeout(toastTimer); toast.textContent = message; toast.hidden = false; toastTimer = setTimeout(() => { toast.hidden = true; }, 4500); }
  let lastFortune = -1;
  function fortune() { lastFortune = (lastFortune + 1 + Math.floor(Math.random() * (data.surprises.length - 1))) % data.surprises.length; return data.surprises[lastFortune]; }
  document.querySelectorAll('[data-fortune]').forEach(b => b.addEventListener('click', () => notify(fortune())));
  const modal = node('dialog', 'treasure-dialog'); modal.id = 'treasure-dialog'; modal.setAttribute('aria-labelledby', 'treasure-title');
  modal.innerHTML = '<div class="dialog-bar"><span>OPEN / PERSONAL COLLECTION</span><button type="button" class="dialog-close" aria-label="Close collection">×</button></div><div class="dialog-content"><span class="dialog-label"></span><h2 id="treasure-title"></h2><p class="dialog-description"></p><div class="dialog-note"></div><button type="button" class="dialog-done">Keep exploring</button></div>';
  document.body.append(modal);
  let openingElement;
  function openItem(item, source) { openingElement = source; modal.querySelector('.dialog-label').textContent = item.label; $('#treasure-title').textContent = item.title; modal.querySelector('.dialog-description').textContent = item.description; modal.querySelector('.dialog-note').textContent = item.note; modal.showModal(); }
  modal.querySelectorAll('button').forEach(b => b.addEventListener('click', () => modal.close()));
  modal.addEventListener('close', () => { if (openingElement?.isConnected) openingElement.focus(); });
  modal.addEventListener('click', e => { if (e.target !== modal) return; const r = modal.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) modal.close(); });
  const collection = $('[data-collections]');
  function render(category = 'all') {
    if (!collection) return;
    collection.replaceChildren();
    data.collections.filter(item => category === 'all' || item.category === category).forEach((item, index) => {
      const button = node('button', `treasure treasure-${item.category}`); button.type = 'button'; button.setAttribute('aria-haspopup', 'dialog'); button.setAttribute('aria-label', `Open collection: ${item.title}`);
      const image = node('img'); image.src = `shared/assets/${item.art}`; image.alt = ''; image.width = 240; image.height = 148;
      const art = node('span', 'treasure-art'); art.append(image);
      const copy = node('span', 'treasure-copy'); copy.append(node('span', 'treasure-label', item.label), node('strong', '', item.title), node('span', 'treasure-subtitle', item.subtitle));
      button.append(art, copy, node('span', 'treasure-arrow', collection.dataset.format === 'files' ? 'Open ↗' : '↗'));
      button.addEventListener('click', () => openItem(item, button)); collection.append(button);
    });
    const status = $('[data-filter-status]'); if (status) status.textContent = `Showing ${collection.children.length} items`;
  }
  render();
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-filter]').forEach(b => { b.setAttribute('aria-pressed', String(b === button)); b.classList.toggle('selected', b === button); }); render(button.dataset.filter); }));
  const journal = $('[data-journal]');
  if (journal) data.journal.forEach(item => { const details = node('details', 'journal-item'); const summary = node('summary'); summary.append(node('span', '', item.date), document.createTextNode(item.title)); details.append(summary, node('p', '', item.text)); journal.append(details); });
  function clock() { document.querySelectorAll('[data-clock]').forEach(el => { el.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date()); }); }
  clock(); setInterval(clock, 30000);

  const form = $('[data-note-form]');
  if (form) {
    const raw = read('notes', []);
    let notes = Array.isArray(raw) ? raw.filter(n => n && typeof n.id === 'string' && typeof n.message === 'string' && typeof n.name === 'string').slice(0, 30).map(n => ({id:n.id,name:n.name.slice(0,16),message:n.message.slice(0,180)})) : [];
    const list = $('[data-notes]'); const feedback = $('[data-note-message]');
    function showNotes() {
      list.replaceChildren();
      if (!notes.length) list.append(node('p', 'no-notes', 'No notes yet. The first one is yours.'));
      notes.forEach(note => {
        const entry = node('article', 'local-note'); entry.append(node('p', '', note.message));
        const footer = node('footer'); footer.append(node('span', '', `— ${note.name}`)); const remove = node('button', '', 'Remove'); remove.type = 'button'; remove.setAttribute('aria-label', `Remove the local note by ${note.name}`);
        remove.addEventListener('click', () => { notes = notes.filter(n => n.id !== note.id); const ok = save('notes', notes); showNotes(); feedback.textContent = ok ? 'Local note removed.' : 'Removed for now. Browser storage could not be updated.'; });
        footer.append(remove); entry.append(footer); list.append(entry);
      });
    }
    showNotes();
    form.elements.message.addEventListener('input', () => form.elements.message.setCustomValidity(''));
    form.addEventListener('submit', e => {
      e.preventDefault(); const message = form.elements.message.value.trim().slice(0,180);
      if (!message) { form.elements.message.setCustomValidity('Write a little something first.'); form.elements.message.reportValidity(); return; }
      if (notes.length >= 30) { feedback.textContent = 'You have 30 notes. Remove one to make room.'; return; }
      notes.unshift({id:crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,name:form.elements.name.value.trim().slice(0,16) || 'A wanderer',message});
      const ok = save('notes', notes); form.elements.message.value = ''; showNotes(); feedback.textContent = ok ? 'Saved in this browser.' : 'Visible for now. Storage is unavailable, so this note will not persist.';
    });
  }

  const tracks = [
    {name:'Afternoon Walk',beat:400,notes:[72,76,79,76,74,72,67,0,69,72,76,72,67,64,67,0],bass:[48,53]},
    {name:'Rain at the Window',beat:500,notes:[69,72,76,0,74,72,69,0,65,69,72,0,71,67,64,0],bass:[45,41]}
  ];
  let context, master, filter, playing = false, timer, track = 0, step = 0, requestId = 0;
  const voices = new Set();
  function playerUI() { document.querySelectorAll('[data-track]').forEach(el => el.textContent = tracks[track].name); document.querySelectorAll('[data-play]').forEach(b => { b.textContent = playing ? 'Ⅱ Pause' : '▶ Play'; b.setAttribute('aria-pressed',String(playing)); }); document.querySelectorAll('[data-audio-status]').forEach(el => el.textContent = playing ? 'Playing · Original synthesized melody' : 'Press play · Original synthesized melody'); document.querySelectorAll('[data-player]').forEach(el => el.classList.toggle('playing',playing)); }
  function pause() { requestId++; clearInterval(timer); for (const v of voices) { try { v.stop(); } catch {} } playing = false; playerUI(); }
  function tone(midi, duration, level, type='triangle') { if (!midi) return; const t=context.currentTime; const v=context.createOscillator(); const g=context.createGain(); v.type=type; v.frequency.value=440*2**((midi-69)/12); g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(level,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+duration); v.connect(g);g.connect(filter);voices.add(v);v.onended=()=>{voices.delete(v);v.disconnect();g.disconnect();};v.start(t);v.stop(t+duration+.04); }
  function tick() { const tune=tracks[track];tone(tune.notes[step%tune.notes.length],.65,.18);if(step%8===0)tone(tune.bass[Math.floor(step/8)%2],2.5,.09,'sine');step++; }
  async function play() {
    const request=++requestId;
    try {
      if(!context){const Engine=window.AudioContext||window.webkitAudioContext;if(!Engine)throw new Error('Audio unavailable');context=new Engine();master=context.createGain();master.gain.value=Number($('[data-volume]')?.value||20)/100*.4;filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1800;filter.connect(master);master.connect(context.destination);}
      await context.resume();if(request!==requestId)return;clearInterval(timer);playing=true;tick();timer=setInterval(tick,tracks[track].beat);playerUI();
    } catch { pause();notify('Audio is unavailable in this browser. You can still explore the desktop.'); }
  }
  document.querySelectorAll('[data-play]').forEach(b=>b.addEventListener('click',()=>playing?pause():play()));
  document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>{const resume=playing;pause();track=(track+1)%tracks.length;step=0;playerUI();if(resume)play();}));
  document.querySelectorAll('[data-volume]').forEach(el=>el.addEventListener('input',()=>{if(master)master.gain.setTargetAtTime(Number(el.value)/100*.4,context.currentTime,.05);}));
  playerUI();window.addEventListener('pagehide',pause);
  window.RetroUI=Object.freeze({data,read,save,notify,fortune,play,pause,openItem});
})();
