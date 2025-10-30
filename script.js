// Player + background-video chooser + reveal
const videoList = [
  'fundo/relogio 1.mp4',
  'fundo/relogio 2.mp4',
  'fundo/relogio 3.mp4',
  'fundo/relogio 4.mp4',
  'fundo/relogio 5.mp4',
  'fundo/relogio inicial.mp4'
];
const bgVideo = document.getElementById('bg-video');

// pick random video on load (and on refresh naturally)
(function pickRandomVideo(){
  const candidates = videoList.filter(Boolean);
  const idx = Math.floor(Math.random()*candidates.length);
  bgVideo.src = candidates[idx];
  // ensure it loops & plays muted
  bgVideo.muted = true;
  bgVideo.loop = true;
  bgVideo.playsInline = true;
  // try playing (browsers sometimes block autoplay but muted should allow)
  bgVideo.play().catch(()=>{/* autoplay blocked? okay muted often allowed */});
})();

/* -------------------- MUSIC PLAYER -------------------- */
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const vinyl = document.getElementById('vinyl');
const vinylImg = document.getElementById('vinyl-img');
const trackTitle = document.getElementById('track-title');
const trackTime = document.getElementById('track-time');
const seek = document.getElementById('seek');
const volume = document.getElementById('volume');
const togglePlayer = document.getElementById('toggle-player');
const playerRoot = document.getElementById('music-player');
const hpFill = document.getElementById('hp-fill');

const playlist = [
  {file:'musicas/Lies of P OST - Feel.mp3', title:'Feel', img:'imagens/vinyl_feel.webp'},
  {file:'musicas/Lies of P OST - Quixotic.mp3', title:'Quixotic', img:'imagens/vinyl_quixotic.webp'},
  {file:'musicas/Lies of P OST - Divine Service.mp3', title:'Divine Service', img:'imagens/vinyl_divine.webp'},
  {file:'musicas/Lies of P OST - Fascination.mp3', title:'Fascination', img:'imagens/vinyl_fascination.webp'},
  {file:'musicas/Lies of P OST - Someday.mp3', title:'Someday', img:'imagens/vinyl_someday.webp'},
  {file:'musicas/Lies of P OST - Why.mp3', title:'Why', img:'imagens/vinyl_why.webp'}
];

let current = 0, isPlaying = false, suppressPlayErrors = false;

// load first track (Feel)
function loadTrack(i){
  i = (i + playlist.length) % playlist.length;
  current = i;
  const p = playlist[i];
  audio.src = p.file;
  trackTitle.textContent = p.title;
  vinylImg.src = p.img || vinylImg.src;
  hpFill.style.width = '0%';
  seek.value = 0;
}
function formatTime(s){
  if (!isFinite(s)) return '00:00';
  const m = Math.floor(s/60).toString().padStart(2,'0');
  const sec = Math.floor(s%60).toString().padStart(2,'0');
  return `${m}:${sec}`;
}
audio.addEventListener('loadedmetadata', () => {
  trackTime.textContent = `00:00 / ${formatTime(audio.duration)}`;
});
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  seek.value = percent;
  hpFill.style.width = `${percent}%`;
  trackTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});
seek.addEventListener('input', () => {
  if (!audio.duration) return;
  audio.currentTime = (seek.value/100) * audio.duration;
});
volume.addEventListener('input', () => audio.volume = parseFloat(volume.value) || 0);

// controls
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => { loadTrack(current-1); play(true); });
nextBtn.addEventListener('click', () => { loadTrack(current+1); play(true); });

// auto sequence: when one ends, go to next
audio.addEventListener('ended', () => {
  loadTrack(current+1);
  play(true);
});

function play(force){
  // set initial volume to gentle (~0.3)
  audio.volume = volume.value || 0.3;
  audio.play().then(() => {
    isPlaying = true;
    playBtn.textContent = '❚❚';
    vinyl.classList.add('rotating');
  }).catch((err)=>{
    if (!suppressPlayErrors && !force) {
      console.warn('Playback blocked (user gesture required).', err);
    }
    suppressPlayErrors = true;
  });
}
function pause(){
  audio.pause();
  isPlaying = false;
  playBtn.textContent = '►';
  vinyl.classList.remove('rotating');
}
function togglePlay(){
  if (isPlaying) pause(); else play();
}

// toggle collapse/expand
togglePlayer.addEventListener('click', () => {
  const collapsed = playerRoot.classList.toggle('collapsed');
  togglePlayer.textContent = collapsed ? '➕' : '➖';
});

// keyboard space toggle (avoids toggling when typing)
document.addEventListener('keydown', (e)=>{
  if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    togglePlay();
  }
});

// load default track on start
loadTrack(0);
audio.volume = volume.value || 0.3;

// reveal animations on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('inview');
  });
}, {threshold:0.12});
document.querySelectorAll('.card, .text-flow p, .section-title').forEach(el => observer.observe(el));

/* - accessibility: small hint if autoplay blocked - */
window.addEventListener('load', () => {
  setTimeout(()=> {
    // try to autoplay once (muted background video already plays muted)
    audio.play().then(()=> {
      // started fine
    }).catch(()=> {
      // do nothing; user will press play
    });
  }, 700);
});
