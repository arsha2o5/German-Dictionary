// Simple client-side dictionary and vocab storage
document.addEventListener('DOMContentLoaded', ()=>{

  const input = document.getElementById('wordInput');
  const lookupBtn = document.getElementById('lookupBtn');
  const addBtn = document.getElementById('addVocabBtn');
  const results = document.getElementById('results');
  const vocabListEl = document.getElementById('vocabList');
  const vocabCountEl = document.getElementById('vocabCount');
  const vocabSearchEl = document.getElementById('vocabSearch');

  function renderEmpty(){
    results.innerHTML = '<div class="empty">Enter a German word below to see translation, gender and synonyms.</div>';
  }

  function renderNotFound(w){
    results.innerHTML = `<div class="empty">No entry found for "${w}".</div>`;
  }

  async function fetchWord(word){
    const url = `https://freedictionaryapi.com/api/v1/entries/de/${word}`
    return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data)
      return data})
    .catch(error => {
      console.error("Error fetching word:", error);
    });
  }

  async function renderEntry(entry){

    const data = await fetchWord(entry);

    if (!data) {
      renderNotFound(entry);
      return;
    }

    console.log(data);
    console.log(data.word);

    results.innerHTML = '';
    const german = document.createElement('div'); german.className = 'german'; german.textContent = data.word; 
    const meta = document.createElement('div'); meta.className = 'meta';
    const english = document.createElement('div'); english.className = 'english'; english.textContent = data.entries[0].senses[0].definition;
    const partOfSpeech = document.createElement('div'); partOfSpeech.className = 'partOfSpeech'; partOfSpeech.textContent = data.entries[0].partOfSpeech;
    meta.appendChild(english); meta.appendChild(partOfSpeech);

    const rating = document.createElement('div'); rating.className = 'rating'; rating.textContent = 0;

    results.appendChild(english); results.appendChild(meta); results.appendChild(rating);
  }

  async function lookup(){
    const raw = input.value.trim();
    if(!raw){ 
      renderEmpty(); 
      return; 
    }
    const key = raw;
    if(key) renderEntry(key);
    else renderNotFound(raw);
  }

  async function addToVocab(){
    

    const word = input.value.trim();
    if(!word) return alert('Enter a word first');
    const data = await fetchWord(word);
    
    const wordData = {
      german: data.word,
      english: data.entries[0].senses[0].definition,
      partOfSpeech: data.entries[0].partOfSpeech,
      rating: 0
    }
    console.log(wordData)
    // renderVocabList();

    fetch("http://localhost:8080/api/v1/word", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
        },
      body: JSON.stringify(wordData)
    })
    .then(response => {
      if (!response.ok) throw new Error("Failed to save word");
      return response.json();
    })
    .catch(error => console.warn('Server sync failed:', error));

    addBtn.textContent = '✓';
    setTimeout(()=> addBtn.textContent = '+', 1200);
  }

  // localStorage helpers for vocab
  function renderVocabList(filter){
    let count = 0;
    // for(const k of keys){
    //   const item = v[k];
    //   if(q && !(item.german.toLowerCase().includes(q) || item.english.toLowerCase().includes(q))) continue;
    //   const el = document.createElement('div'); el.className = 'vocab-item';
    //   const left = document.createElement('div'); 
    //   left.innerHTML = `<div class="word">${item.german}</div><div class="meta">${item.english} · ${item.partOfSpeech}</div>`;
    //   const right = document.createElement('div');
    //   const del = document.createElement('button'); 
    //   del.textContent = '✕'; 
    //   del.title = 'Remove'; del.style.border='0'; 
    //   del.style.background='transparent'; 
    //   del.style.color='var(--muted)'; 
    //   del.style.cursor='pointer';

    //   del.addEventListener('click', ()=>{ 
    //     removeVocabItem(k); 
    //     renderVocabList(vocabSearchEl.value); 
    //   });

    //   right.appendChild(del);
    //   el.appendChild(left); 
    //   el.appendChild(right);
    //   vocabListEl.appendChild(el);
    //   count++;
    // }
    vocabCountEl.textContent = count;
    if(count===0) vocabListEl.innerHTML = '<div class="empty">No words yet — add a translation to save it here.</div>';
  }

  // search handling
  vocabSearchEl && vocabSearchEl.addEventListener('input', (e)=> renderVocabList(e.target.value));

  // seed vocab from server (best-effort) then local
  (function initVocab(){
    // try server fetch
    fetch('http://localhost:8080/api/v1/word')
      .then(response=> response.ok ? r.json() : Promise.reject())
      .then(list => {
        // expecting array of items with german/english/partOfSpeech
        const v = loadVocab();
        for(const it of list){
          if(it.german){ v[it.german.toLowerCase()] = {german: it.german, english: it.english||'', partOfSpeech: it.partOfSpeech||'', rating: it.rating||0}; }
        }
        saveVocab(v);
        renderVocabList();
      })
      .catch(()=>{
        // fallback to local only
        renderVocabList();
      });
  })();

  lookupBtn.addEventListener('click', lookup);
  addBtn.addEventListener('click', addToVocab);
  input.addEventListener('keyup', (e)=>{ if(e.key === 'Enter') lookup(); });

  renderEmpty();
  function addPageChanger(buttonID, pagehref){
        document.getElementById(buttonID).addEventListener("click", () => {
        document.body.classList.add("fade-out");
        setTimeout(() => {
            window.location.href = pagehref;
        }, 500);
    });
  }
  addPageChanger("homeBtn", "main_page.html")
  
});
