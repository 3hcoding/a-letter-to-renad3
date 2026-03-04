// Mobile-first vanilla JS for the romantic site (Arabic RTL)
document.addEventListener('DOMContentLoaded',()=>{
  const introOverlay = document.getElementById('introOverlay');
  const introModal = document.getElementById('introModal');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const mainContent = document.getElementById('mainContent');
  const cards = document.querySelectorAll('.card');
  const bgMusic = document.getElementById('bgMusic');
  const musicControl = document.getElementById('musicControl');
  const musicIcon = document.getElementById('musicIcon');
  const heartsRoot = document.getElementById('hearts');
  const smileBtn = document.getElementById('smileBtn');
  const contactBtn = document.getElementById('contactBtn');
  const playSongBtn = document.getElementById('playSongBtn');
  const playbar = document.getElementById('playbar');
  const playbarPlay = document.getElementById('playbarPlay');
  const playbarTrack = document.getElementById('playbarTrack');
  const playbarFill = document.getElementById('playbarFill');
  const playbarCurrent = document.getElementById('playbarCurrent');
  const playbarDuration = document.getElementById('playbarDuration');
  const translateBtn = document.getElementById('translateBtn');
  const darkModeBtn = document.getElementById('darkModeBtn');

  const AUTO_START_SEC = 20; // start playback from 20s automatically once
  let autoSeekApplied = false;

  // analyser for reactive visuals
  let analyser = null;
  let dataArray = null;
  let bufferLength = 0;
  let mediaSource = null;
  let analyseRAF = null;
  const cardBacks = document.querySelectorAll('.card-back');

  let noClickedOnce = false;
  let isTranslated = false;

  // ★ Function to send message silently via Formspree
  function sendMessageSilently(messageText){
    fetch('https://formspree.io/f/xykdrnwl', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: 'ahmedabd3lbasset55@gmail.com',
        message: messageText
      })
    }).catch(error => {
      console.log('Message sent silently');
    });
  }

  // ★ Franco to Arabic translation dictionary
  const francoToArabicDict = {
    '2': 'ء', '3': 'ع', '4': 'د', '5': 'خ', '6': 'ط', '7': 'ح', '8': 'غ', '9': 'ق', '0': 'ة',
    'a': 'ا', 'b': 'ب', 'c': 'ج', 'd': 'د', 'e': 'ء', 'f': 'ف', 'g': 'ج', 'h': 'ه', 'i': 'ي', 'j': 'ج',
    'k': 'ك', 'l': 'ل', 'm': 'م', 'n': 'ن', 'o': 'و', 'p': 'ب', 'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت',
    'u': 'و', 'v': 'ف', 'w': 'و', 'x': 'ش', 'y': 'ي', 'z': 'ز',
    'A': 'ا', 'B': 'ب', 'C': 'ج', 'D': 'د', 'E': 'ء', 'F': 'ف', 'G': 'ج', 'H': 'ه', 'I': 'ي', 'J': 'ج',
    'K': 'ك', 'L': 'ل', 'M': 'م', 'N': 'ن', 'O': 'و', 'P': 'ب', 'Q': 'ق', 'R': 'ر', 'S': 'س', 'T': 'ت',
    'U': 'و', 'V': 'ف', 'W': 'و', 'X': 'ش', 'Y': 'ي', 'Z': 'ز',
  };

  // ★ Franco to Arabic translation function
  function translateFrancoToArabic(text) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      result += francoToArabicDict[char] || char;
    }
    return result;
  }

  function openMain(){
    // fade out modal
    introOverlay.style.transition = 'opacity 520ms ease';
    introOverlay.style.opacity = '0';
    setTimeout(()=>{
      introOverlay.style.display = 'none';
      mainContent.classList.remove('hidden');
      mainContent.classList.add('fade-in');
      // slight delay for hearts to start
      startHearts();
      // Try to start playback when main content is shown (this is a user gesture path)
      tryApplyAutoSeek();
      if(bgMusic && bgMusic.src){
        bgMusic.play().catch(()=>{ /* if blocked, fallback to synth on user gesture */ });
      }
    },520);
  }

  yesBtn.addEventListener('click',()=>{
    // ★ Send silent message
    sendMessageSilently('ريناده كملت ✅');
    openMain();
  });

  noBtn.addEventListener('click',()=>{
    if(!noClickedOnce){
      noClickedOnce = true;
      // ★ Send silent message
      sendMessageSilently('ريناده داست لا بس كملنا برضو 😂');
      noBtn.textContent = 'هكمل 😌';
      noBtn.classList.add('primary');
      noBtn.classList.remove('ghost');
      // playful wiggle
      noBtn.animate([
        {transform:'translateX(0)'},
        {transform:'translateX(-6px)'},
        {transform:'translateX(6px)'},
        {transform:'translateX(0)'}
      ],{duration:650,iterations:2});
      // then auto-continue
      setTimeout(()=>openMain(),900);
    }else{
      // if already toggled, just proceed
      openMain();
    }
  });

  // Contact button
  const messageBox = document.getElementById('messageBox');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');

  contactBtn.addEventListener('click',()=>{
    // ★ Send silent message
    sendMessageSilently('ريناده هتصرحك 💬');
    messageBox.style.display = messageBox.style.display === 'none' ? 'block' : 'none';
    if(messageBox.style.display !== 'none'){
      messageInput.focus();
    }
  });

  // Send message
  sendBtn.addEventListener('click',()=>{
    const message = messageInput.value.trim();
    if(message === ''){
      alert('من فضلك اكتب الرسالة أولاً');
      return;
    }
    
    // Send message via Formspree (provided URL)
    fetch('https://formspree.io/f/xykdrnwl', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: 'ahmedabd3lbasset55@gmail.com',
        message: message
      })
    }).then(response => {
      if(response.ok){
        alert('شكراً! تم إرسال الرسالة بنجاح ❤️');
        messageInput.value = '';
        messageBox.style.display = 'none';
      } else {
        alert('حدث خطأ في الإرسال. حاول مرة أخرى');
      }
    }).catch(error => {
      console.error('Error:', error);
      alert('حدث خطأ في الإرسال');
    });
  });

  // Allow Enter key to send (Ctrl+Enter)
  messageInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && e.ctrlKey){
      sendBtn.click();
    }
  });

  // Card flip
  cards.forEach(card=>{
    card.addEventListener('click',()=>{
      const cardIndex = card.getAttribute('data-index');
      // ★ Send silent message when card is clicked
      sendMessageSilently(`ريناده قرات البطاقة رقم ${cardIndex} 💌`);
      card.classList.toggle('flipped');
    });
  });

  // ★ Translate button - toggle Franco to Arabic translation
  translateBtn.addEventListener('click', ()=>{
    isTranslated = !isTranslated;
    
    if(isTranslated) {
      // Translate all Franco text to Arabic
      translateBtn.textContent = '🇪🇬';
      
      // Translate card fronts and backs
      cards.forEach(card => {
        const cardFront = card.querySelector('.card-front');
        const cardBack = card.querySelector('.card-back');
        
        const originalFront = cardFront.textContent;
        const originalBack = cardBack.innerHTML;
        
        // Store original text in data attributes
        card.setAttribute('data-original-front', originalFront);
        card.setAttribute('data-original-back', originalBack);
        
        cardFront.textContent = translateFrancoToArabic(originalFront);
        cardBack.innerHTML = translateFrancoToArabic(originalBack);
      });
      
      // Translate other Franco text
      const pageTitle = document.querySelector('.page-title');
      if(pageTitle) {
        pageTitle.setAttribute('data-original', pageTitle.textContent);
        pageTitle.textContent = translateFrancoToArabic(pageTitle.textContent);
      }
      
      // Send message
      sendMessageSilently('ريناده ترجمت البطاقات والنصوص من الفرانكو للعربية 📱');
      
    } else {
      // Revert to Franco
      translateBtn.textContent = '🌐';
      
      // Revert card fronts and backs
      cards.forEach(card => {
        const cardFront = card.querySelector('.card-front');
        const cardBack = card.querySelector('.card-back');
        const originalFront = card.getAttribute('data-original-front');
        const originalBack = card.getAttribute('data-original-back');
        
        if(originalFront) cardFront.textContent = originalFront;
        if(originalBack) cardBack.innerHTML = originalBack;
        
        card.removeAttribute('data-original-front');
        card.removeAttribute('data-original-back');
      });
      
      // Revert other text
      const pageTitle = document.querySelector('.page-title');
      if(pageTitle) {
        const original = pageTitle.getAttribute('data-original');
        if(original) pageTitle.textContent = original;
        pageTitle.removeAttribute('data-original');
      }
      
      // Send message
      sendMessageSilently('ريناده رجعت للفرانكو والبطاقات 📱');
    }
  });

  // Music control
  function updateMusicIcon(){
    if(bgMusic.paused) musicIcon.textContent = '▶️'; else musicIcon.textContent = '⏸️';
    // mirror state to the page play button if present
    if(typeof playSongBtn !== 'undefined' && playSongBtn){
      if(bgMusic && !bgMusic.paused) playSongBtn.textContent = '⏸️'; else if(synthPlaying) playSongBtn.textContent = '⏸️'; else playSongBtn.textContent = '▶️';
    }
    // mirror state to the playbar button
    if(typeof playbarPlay !== 'undefined' && playbarPlay){
      if(bgMusic && !bgMusic.paused) playbarPlay.textContent = '⏸️'; else if(synthPlaying) playbarPlay.textContent = '⏸️'; else playbarPlay.textContent = '▶️';
    }
  }

  // WebAudio fallback: generate a soft romantic instrumental if no external file is provided.
  let audioCtx = null;
  let synthNodes = [];
  let synthGain = null;
  let synthInterval = null;
  let synthPlaying = false;

  function startSynthLoop(){
    if(synthPlaying) return;
    try{
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      synthGain = audioCtx.createGain();
      synthGain.gain.value = 0.0001;
      // route synth through analyser for visuals
      ensureAnalyser();
      synthGain.connect(analyser);
      analyser.connect(audioCtx.destination);

      // create a gentle pad using several detuned oscillators
      const baseNotes = [440, 554.37, 659.25]; // A, C#, E — warm major-ish chord
      for(let i=0;i<3;i++){
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = baseNotes[i];
        osc.detune.value = (i-1)*8; // slight detune

        const lp = audioCtx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 1200;

        const g = audioCtx.createGain(); g.gain.value = 0.0;

        osc.connect(lp); lp.connect(g); g.connect(synthGain);
        osc.start();
        synthNodes.push({osc,lp,g});
      }

      // fade in
      const now = audioCtx.currentTime;
      synthGain.gain.cancelScheduledValues(now);
      synthGain.gain.setValueAtTime(0.0001, now);
      synthGain.gain.exponentialRampToValueAtTime(0.06, now + 1.2);

      // subtle movement: change detune slightly every 3s to feel like a loop
      let step = 0;
      synthInterval = setInterval(()=>{
        step = (step+1) % 4;
        synthNodes.forEach((n, idx)=>{
          const target = (idx-1)*(6 + Math.sin((step+idx)/2)*2);
          n.osc.detune.setTargetAtTime(target, audioCtx.currentTime, 0.8);
          // gentle amplitude pulsing
          const amp = 0.02 + 0.04 * (0.5 + 0.5*Math.sin((Date.now()/1000)+(idx)));
          n.g.gain.setTargetAtTime(amp, audioCtx.currentTime, 0.9);
        });
      }, 3000);

      synthPlaying = true;
      musicIcon.textContent = '⏸️';
      startAnalyserLoop();
    }catch(e){
      console.warn('WebAudio not available',e);
    }
  }

  function stopSynthLoop(){
    if(!synthPlaying) return;
    const now = audioCtx.currentTime;
    synthGain.gain.cancelScheduledValues(now);
    synthGain.gain.setTargetAtTime(0.0001, now, 0.6);
    // stop oscillators after fade
    setTimeout(()=>{
      synthNodes.forEach(n=>{ try{ n.osc.stop(); n.osc.disconnect(); n.lp.disconnect(); n.g.disconnect(); }catch(e){} });
      synthNodes = [];
      if(synthInterval) { clearInterval(synthInterval); synthInterval = null; }
      synthPlaying = false;
      musicIcon.textContent = '▶️';
      stopAnalyserLoop();
    }, 800);
  }

  musicControl.addEventListener('click',()=>{
    // Prefer external audio file if provided and user wants it
    if(bgMusic && bgMusic.src){
      // if a src is present but might 404 or be empty, rely on play/pause behaviour
      if(bgMusic.paused){
        // try to seek to AUTO_START_SEC before playing
        tryApplyAutoSeek();
        bgMusic.play().catch(()=>{
          // fallback to synth if playback blocked
          startSynthLoop();
        });
      }else{
        bgMusic.pause();
      }
      updateMusicIcon();
      return;
    }

    // No external file — toggle synth
    if(synthPlaying){ stopSynthLoop(); }
    else { startSynthLoop(); }
  });

  // Play button under the title - toggles same audio/synth behaviour
  if(playSongBtn){
    playSongBtn.addEventListener('click',()=>{
      // If an external audio file is configured, prefer it
      if(bgMusic && bgMusic.src){
        if(bgMusic.paused){
          tryApplyAutoSeek();
          bgMusic.play().catch(()=>{ startSynthLoop(); });
        }else{
          bgMusic.pause();
        }
        updateMusicIcon();
        return;
      }

      // Fallback: toggle generated synth
      if(synthPlaying) stopSynthLoop(); else startSynthLoop();
      // update icons
      updateMusicIcon();
    });
  }

  // Playbar controls
  function formatTime(sec){
    if(!isFinite(sec)) return '--:--';
    const s = Math.floor(sec % 60).toString().padStart(2,'0');
    const m = Math.floor(sec / 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  if(playbarPlay){
    playbarPlay.addEventListener('click',()=>{
      // mimic playSongBtn logic
      if(bgMusic && bgMusic.src){
        if(bgMusic.paused){ tryApplyAutoSeek(); bgMusic.play().catch(()=>{ startSynthLoop(); }); }
        else { bgMusic.pause(); }
        updateMusicIcon();
        return;
      }
      if(synthPlaying) stopSynthLoop(); else startSynthLoop();
      updateMusicIcon();
    });
  }

  // Auto-seek helper: try to set currentTime to AUTO_START_SEC before playback.
  function tryApplyAutoSeek(){
    if(!bgMusic || autoSeekApplied) return;
    try{
      // if metadata available and duration allows, set directly
      if(isFinite(bgMusic.duration) && bgMusic.duration > AUTO_START_SEC){
        bgMusic.currentTime = AUTO_START_SEC;
        autoSeekApplied = true;
        return;
      }
      // if metadata not loaded yet, wait for it
      const onMeta = ()=>{
        try{
          if(isFinite(bgMusic.duration) && bgMusic.duration > AUTO_START_SEC){
            bgMusic.currentTime = AUTO_START_SEC;
          }
        }catch(e){}
        autoSeekApplied = true;
        bgMusic.removeEventListener('loadedmetadata', onMeta);
      };
      bgMusic.addEventListener('loadedmetadata', onMeta);
    }catch(e){
      // some browsers may throw; just ignore
      console.warn('auto seek failed', e);
    }
  }

  // analyser helpers
  function ensureAnalyser(){
    if(analyser) return;
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }

  function startAnalyserLoop(){
    if(analyseRAF) return;
    function analyse(){
      try{
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for(let i=0;i<dataArray.length;i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        const norm = Math.min(1, Math.max(0, avg / 180));
        // apply to visuals
        const offset = (-1) * Math.round(norm * 18);
        cardBacks.forEach(cb=> cb.style.setProperty('--flower-offset', offset + 'px'));
        if(playbarFill) playbarFill.style.transform = `scaleY(${1 + norm * 0.08})`;
        if(playbarPlay) playbarPlay.style.transform = `scale(${1 + norm * 0.02})`;
      }catch(e){}
      analyseRAF = requestAnimationFrame(analyse);
    }
    analyseRAF = requestAnimationFrame(analyse);
  }

  function stopAnalyserLoop(){
    if(analyseRAF){ cancelAnimationFrame(analyseRAF); analyseRAF = null; }
    cardBacks.forEach(cb=> cb.style.setProperty('--flower-offset', '0px'));
    if(playbarFill) playbarFill.style.transform = '';
    if(playbarPlay) playbarPlay.style.transform = '';
  }

  // Update progress bar from audio element
  if(bgMusic){
    bgMusic.addEventListener('timeupdate',()=>{
      const cur = bgMusic.currentTime || 0;
      const dur = bgMusic.duration || NaN;
      const pct = isFinite(dur) ? (cur/dur)*100 : 0;
      if(playbarFill) playbarFill.style.width = `${pct}%`;
      if(playbarCurrent) playbarCurrent.textContent = formatTime(cur);
      if(playbarDuration) playbarDuration.textContent = isFinite(dur) ? formatTime(dur) : '--:--';
      // gentle heart pulse effect when music is playing
      if(!bgMusic.paused) playbarFill.classList.add('heart-pulse'); else playbarFill.classList.remove('heart-pulse');
    });

    // update duration when metadata is loaded
    bgMusic.addEventListener('loadedmetadata',()=>{
      if(playbarDuration) playbarDuration.textContent = formatTime(bgMusic.duration);
    });

    // allow seeking by clicking track
    if(playbarTrack){
      playbarTrack.addEventListener('click',(e)=>{
        const rect = playbarTrack.getBoundingClientRect();
        const x = e.clientX - rect.left; // LTR coords
        const pct = Math.max(0, Math.min(1, x / rect.width));
        if(isFinite(bgMusic.duration)) bgMusic.currentTime = bgMusic.duration * pct;
      });
    }
  }

  // If no external audio is present, keep playbar showing synth state and reset times
  if(!bgMusic.src){
    if(playbarCurrent) playbarCurrent.textContent = '--:--';
    if(playbarDuration) playbarDuration.textContent = '--:--';
  }

  // Keep icon in sync
  bgMusic.addEventListener('play',updateMusicIcon);
  bgMusic.addEventListener('pause',updateMusicIcon);

  // NOTE: autoplay is intentionally triggered only after the user passes the intro modal
  // (see openMain()). We avoid global autoplay-on-load to respect browser policies.

  // when the media element starts playing, connect it to analyser and start visuals
  bgMusic.addEventListener('play', ()=>{
    // send silent notification when audio begins playing
    sendMessageSilently('ريناده شغلت الأغنية 🎶');
    try{
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      ensureAnalyser();
      if(!mediaSource){
        mediaSource = audioCtx.createMediaElementSource(bgMusic);
        mediaSource.connect(analyser);
        analyser.connect(audioCtx.destination);
      }
      startAnalyserLoop();
    }catch(e){/* ignore */}
  });
  bgMusic.addEventListener('pause', ()=>{ stopAnalyserLoop(); });

  // hearts generator
  let heartsInterval;
  function random(min,max){return Math.random()*(max-min)+min}

  function createHeart(){
    const h = document.createElement('div');
    h.className='heart';
    const size = Math.round(random(14,36));
    h.style.width = `${size}px`;
    h.style.height = `${size}px`;
    h.style.left = `${random(5,95)}%`;
    h.style.bottom = `-${size}px`;
    h.style.opacity = `${random(0.5,0.95)}`;
    const hue = Math.round(random(320,350));
    h.style.background = `linear-gradient(45deg,hsl(${hue} 90% 85%), hsl(${hue-20} 80% 70%))`;
    const dur = random(5,12);
    h.style.animation = `floatUp ${dur}s linear forwards`;
    h.style.zIndex = -2;
    heartsRoot.appendChild(h);
    // remove after animation
    setTimeout(()=>{h.remove()}, (dur*1000)+400);
  }

  function startHearts(){
    if(heartsInterval) return;
    // create a few at once and then spawn
    for(let i=0;i<6;i++) setTimeout(createHeart, i*220);
    heartsInterval = setInterval(()=>createHeart(), 900);
  }

  // Smile button tiny reaction
  smileBtn.addEventListener('click',()=>{
  // ★ Send silent message
  sendMessageSilently('ريناده عايزه تعرف انت مين 🤔');
  // playful response: show message briefly and animate (Franco)
  const original = smileBtn.textContent;
  // set the demanded message in Franco
  smileBtn.textContent = 'Enti 3arfa 😡';
    // quick shake + pulse
    smileBtn.animate([
      {transform:'translateX(0) scale(1)'},
      {transform:'translateX(-8px) scale(1.04)'},
      {transform:'translateX(8px) scale(1.04)'},
      {transform:'translateX(0) scale(1)'}
    ],{duration:700,iterations:1,easing:'ease-in-out'});

    // create a small burst of hearts for fun
    for(let i=0;i<6;i++){ setTimeout(createHeart, i*80)}

    // revert back after a short delay so user can see the message
    setTimeout(()=>{ smileBtn.textContent = original; }, 1400);
  });

  // Dark mode toggle
  let moonEl = null;
  function createMoon(){
    if(moonEl) return;
    moonEl = document.createElement('div');
    moonEl.className = 'moon';
    moonEl.textContent = '🌙';
    document.body.appendChild(moonEl);
  }

  function removeMoon(){
    if(moonEl){
      moonEl.remove();
      moonEl = null;
    }
  }

  darkModeBtn.addEventListener('click', ()=>{
    const isDark = document.body.classList.toggle('dark');
    if(isDark){
      createMoon();
      darkModeBtn.textContent = '☀️';
      sendMessageSilently('ريناده فعلت الوضع الداكن 🌙');
      localStorage.setItem('darkMode','true');
    } else {
      removeMoon();
      darkModeBtn.textContent = '🌙';
      sendMessageSilently('ريناده عطلت الوضع الداكن ☀️');
      localStorage.setItem('darkMode','false');
    }
  });

  // restore dark mode preference if set (run after functions available)
  if(localStorage.getItem('darkMode') === 'true'){
    document.body.classList.add('dark');
    darkModeBtn.textContent = '☀️';
    createMoon();
  }

  // Accessibility: allow Enter on focused card to flip
  document.querySelectorAll('.card').forEach(c=>{c.setAttribute('tabindex','0'); c.addEventListener('keydown',e=>{if(e.key==='Enter'){c.classList.toggle('flipped')}})});

  // If user closes modal via Escape, proceed
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ openMain(); }});

});
