// Cleaned client-side dictionary and vocab storage
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('wordInput');
  const lookupBtn = document.getElementById('lookupBtn');
  const addBtn = document.getElementById('addVocabBtn');
  const results = document.getElementById('results');
  const vocabListEl = document.getElementById('vocabList');
  const vocabCountEl = document.getElementById('vocabCount');
  const vocabSearchEl = document.getElementById('vocabSearch');

  const VOCAB_KEY = 'my_vocab_v1';

  function renderEmpty() {
    if (!results) return;
    results.innerHTML = '<div class="empty">Enter a German word below to see translation, gender and synonyms.</div>';
  }

  function renderNotFound(w) {
    if (!results) return;
    results.innerHTML = `<div class="empty">No entry found for "${w}".</div>`;
  }

  async function fetchWord(word) {
    try {
      const url = `https://freedictionaryapi.com/api/v1/entries/de/${encodeURIComponent(word)}`;
      const resp = await fetch(url);
      if (!resp.ok) return null;
      return await resp.json();
    } catch (e) {
      console.warn('fetchWord error', e);
      return null;
    }
  }

  async function renderEntry(word) {
    if (!results) return;
    results.innerHTML = '<div class="empty">Loading…</div>';
    const data = await fetchWord(word);
    if (!data) { renderNotFound(word); return; }
    results.innerHTML = '';
    const german = document.createElement('div');
    german.className = 'german';
    german.textContent = data.word || word;
    const meta = document.createElement('div');
    meta.className = 'meta';
    const english = document.createElement('div');
    english.className = 'english';
    english.textContent = (data.entries && data.entries[0] && data.entries[0].senses && data.entries[0].senses[0]) ? data.entries[0].senses[0].definition : '';
    const partOfSpeech = document.createElement('div');
    partOfSpeech.className = 'partOfSpeech';
    partOfSpeech.textContent = (data.entries && data.entries[0]) ? data.entries[0].partOfSpeech : '';
    meta.appendChild(english);
    meta.appendChild(partOfSpeech);
    const rating = document.createElement('div');
    rating.className = 'rating';
    rating.textContent = 0;
    results.appendChild(german);
    results.appendChild(meta);
    results.appendChild(rating);
  }

  async function lookup() {
    if (!input) return;
    const raw = input.value.trim();
    if (!raw) { renderEmpty(); return; }
    await renderEntry(raw);
  }

  async function addToVocab() {
    if (!input) return;
    const word = input.value.trim();
    if (!word) return alert('Enter a word first');
    const data = await fetchWord(word);
    if (!data) return alert('Could not fetch translation for that word');
    const english = (data.entries && data.entries[0] && data.entries[0].senses && data.entries[0].senses[0]) ? data.entries[0].senses[0].definition.replace(/(\([^)]*\)|\[[^\]]*\])\s*/g, '').trim() : '';
    const partOfSpeech = (data.entries && data.entries[0]) ? data.entries[0].partOfSpeech : '';
    let gender = '';
    try {
      if (partOfSpeech === 'noun' && data.entries[0].senses[0] && Array.isArray(data.entries[0].senses[0].tags)) {
        for (const t of data.entries[0].senses[0].tags) {
          if (t === 'masculine') gender = 'M';
          if (t === 'feminine') gender = 'F';
          if (t === 'neuter') gender = 'N';
        }
      }
    } catch (e) { /* ignore */ }

    const wordData = {
      german: data.word || word,
      english: english,
      partOfSpeech: partOfSpeech,
      gender: gender,
      rating: 0
    };

    // save locally immediately for instant UI
    saveVocabItem((wordData.german||word), wordData);
    renderVocabList(vocabSearchEl && vocabSearchEl.value);

    // best-effort server sync
    fetch('http://localhost:8080/api/v1/word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wordData)
    }).catch(err => console.warn('Server sync failed:', err));

    if (addBtn) {
      addBtn.textContent = '✓';
      setTimeout(() => addBtn.textContent = '+', 1200);
    }
  }

  /* localStorage helpers */
  function loadVocab() {
    try { const raw = localStorage.getItem(VOCAB_KEY); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
  }

  function saveVocab(v) { try { localStorage.setItem(VOCAB_KEY, JSON.stringify(v)); } catch (e) { /* ignore */ } }

  function saveVocabItem(key, item) { const v = loadVocab(); v[key] = item; saveVocab(v); }

  function removeVocabItem(key) {
    const v = loadVocab();
    if (v && v[key]) delete v[key];
    saveVocab(v);
    // attempt backend delete (best-effort)
    fetch(`http://localhost:8080/api/v1/word`, { 
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ german: key })     
    })
      .then(r => { if (!r.ok) throw new Error('delete failed'); })
      .catch(() => { /* ignore backend failure */ });
  }

  function renderVocabList(filter) {
    if (!vocabListEl || !vocabCountEl) return;
    const v = loadVocab() || {};
    const keys = Object.keys(v).sort();
    const q = (filter || '')
    vocabListEl.innerHTML = '';
    let count = 0;
    for (const k of keys) {
      const item = v[k];
      const german = (item.german || '')
      const english = (item.english || '')
      if (q && !(german.includes(q) || english.includes(q))) continue;

      const box = document.createElement('div'); box.className = 'vocab-item';

      const wordEl = document.createElement('div'); wordEl.className = 'word'; wordEl.textContent = item.german || k;
      const metaEl = document.createElement('div'); metaEl.className = 'meta'; metaEl.textContent = item.english || '';

      const del = document.createElement('button'); del.className = 'delete-btn'; del.setAttribute('aria-label','Remove word'); del.textContent = '✕';
      del.addEventListener('click', (e) => { e.stopPropagation(); removeVocabItem(k); renderVocabList(vocabSearchEl && vocabSearchEl.value); });

      box.appendChild(wordEl);
      box.appendChild(metaEl);
      box.appendChild(del);

      vocabListEl.appendChild(box);
      count++;
    }

    vocabCountEl.textContent = count;
    if (count === 0) vocabListEl.innerHTML = '<div class="empty">No words yet — add a translation to save it here.</div>';
  }

  // search handling
  if (vocabSearchEl) vocabSearchEl.addEventListener('input', (e) => renderVocabList(e.target.value));

  // init: load local vocab, then try to fetch server list and merge
  (function initVocab(){
    // load local first
    try { renderVocabList(); } catch (e) { /* ignore */ }
    // try server
    fetch('http://localhost:8080/api/v1/word')
      .then(resp => resp.ok ? resp.json() : Promise.reject())
      .then(list => {
        try {
          const v = loadVocab();
          if (Array.isArray(list)) {
            for (const it of list) {
              if (it.german) v[it.german] = {
                german: it.german,
                english: it.english || '',
                partOfSpeech: it.partOfSpeech || it.part_of_speech || '',
                gender: it.gender || '',
                rating: it.rating || 0
              };
            }
            saveVocab(v);
          }
        } catch (e) { /* ignore merge errors */ }
        renderVocabList();
      })
      .catch(()=>{ renderVocabList(); });
  })();

  if (lookupBtn) lookupBtn.addEventListener('click', lookup);
  if (addBtn) addBtn.addEventListener('click', addToVocab);
  if (input) input.addEventListener('keyup', (e) => { if (e.key === 'Enter') lookup(); });

  renderEmpty();

  function addPageChanger(buttonID, pagehref){
    const btn = document.getElementById(buttonID);
    if (!btn) return;
    btn.addEventListener('click', () => { document.body.classList.add('fade-out'); setTimeout(()=> window.location.href = pagehref, 500); });
  }
  addPageChanger('homeBtn','main_page.html');
});
