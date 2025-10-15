document.addEventListener('DOMContentLoaded', () => {
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  function openChat(){
    chatPanel.setAttribute('aria-hidden','false');
    chatInput.focus();
  }
  function closeChat(){
    chatPanel.setAttribute('aria-hidden','true');
  }

  chatToggle.addEventListener('click', ()=>{
    const hidden = chatPanel.getAttribute('aria-hidden') === 'true';
    if(hidden) openChat(); else closeChat();
  });
  chatClose.addEventListener('click', closeChat);

  chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const v = chatInput.value.trim();
    if(!v) return;
    const userMsg = document.createElement('div');
    userMsg.className = 'msg user';
    userMsg.textContent = v;
    chatMessages.appendChild(userMsg);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Demo AI reply (simulate async)
    setTimeout(()=>{
      const ai = document.createElement('div');
      ai.className = 'msg system';
      ai.textContent = `AI: I heard "${v}" — try asking for a translation, example sentence, or a mnemonic.`;
      chatMessages.appendChild(ai);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600 + Math.random()*600);
  });

    function addPageChanger(buttonID, pagehref){
        document.getElementById(buttonID).addEventListener("click", () => {
        document.body.classList.add("fade-out");
        setTimeout(() => {
            window.location.href = pagehref;
        }, 500); // match transition time
    });
    }
    addPageChanger("dictionaryBtn", "dictionary_page.html")
    addPageChanger("dictionaryBtn", "dictionary_page.html")

    
});
