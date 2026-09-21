let photos = [];
let playlist = [];
const gallery = document.querySelector('#polaroidGallery');

function renderGallery() {
  if (!photos.length) {
    gallery.innerHTML = `<div class="empty-gallery"><strong>Este espacio espera sus recuerdos.</strong>Solo agrega tus fotos a <code>assets/photos</code>.</div>`;
    return;
  }
  gallery.innerHTML = photos.map(({ src, caption = 'Un recuerdo contigo' }) => `
    <figure class="polaroid"><img src="${src}" alt="${caption}" loading="lazy" /><figcaption>${caption}</figcaption></figure>`).join('');
}

const player = document.querySelector('#player');
const soundToggle = document.querySelector('#soundToggle');
const bigPlay = document.querySelector('#bigPlay');
const soundLabel = document.querySelector('#soundLabel');
const trackName = document.querySelector('#trackName');
let currentTrack = 0;

function prettyName(path) { return path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '); }
function loadTrack(index) {
  if (!playlist.length) return;
  currentTrack = (index + playlist.length) % playlist.length;
  player.src = playlist[currentTrack];
  trackName.textContent = prettyName(playlist[currentTrack]);
}
async function toggleMusic() {
  if (!playlist.length) { trackName.textContent = 'Solo agrega tu música en assets/music.'; return; }
  if (player.paused) { await player.play(); } else { player.pause(); }
}
function updatePlayerUI() {
  const playing = !player.paused;
  document.body.classList.toggle('is-playing', playing);
  soundLabel.textContent = playing ? 'Pausar' : 'Música';
  soundToggle.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
  bigPlay.textContent = playing ? 'Ⅱ' : '▶';
}

soundToggle.addEventListener('click', toggleMusic);
bigPlay.addEventListener('click', toggleMusic);
player.addEventListener('play', updatePlayerUI);
player.addEventListener('pause', updatePlayerUI);
player.addEventListener('ended', () => { loadTrack(currentTrack + 1); player.play(); });
player.addEventListener('error', () => {
  if (playlist.length > 1) { loadTrack(currentTrack + 1); player.play().catch(() => {}); }
  else trackName.textContent = 'Este formato no es compatible con este navegador.';
});

renderGallery();
async function loadFolderAssets() {
  try {
    const response = await fetch('assets.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('assets.json unavailable');
    const assets = await response.json();
    photos = Array.isArray(assets.photos) ? assets.photos : [];
    playlist = Array.isArray(assets.playlist) ? assets.playlist : [];
    renderGallery();
    if (playlist.length) loadTrack(0);
  } catch {
    trackName.textContent = 'Tus canciones aparecerán al publicar en GitHub Pages.';
  }
}
loadFolderAssets();
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: .13 });
document.querySelectorAll('.section-reveal').forEach(section => revealObserver.observe(section));

const petalField = document.querySelector('#petals');
['✦', '•', '✦', '·', '✦', '•', '✦', '·', '✦', '•', '✦', '·'].forEach((symbol, index) => {
  const petal = document.createElement('span');
  petal.className = 'petal';
  petal.textContent = symbol;
  petal.style.left = `${4 + ((index * 17) % 92)}vw`;
  petal.style.setProperty('--duration', `${10 + (index % 5) * 2.1}s`);
  petal.style.setProperty('--delay', `${-index * 1.35}s`);
  petal.style.setProperty('--drift', `${index % 2 ? 7 : -7}vw`);
  petal.style.fontSize = `${.65 + (index % 3) * .36}rem`;
  petalField.appendChild(petal);
});

const bouquet = document.querySelector('.bouquet-scene');
if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', event => {
    document.body.style.setProperty('--mouse-x', `${event.clientX / innerWidth * 100}%`);
    document.body.style.setProperty('--mouse-y', `${event.clientY / innerHeight * 100}%`);
    bouquet.style.transform = `perspective(600px) rotateX(${(event.clientY / innerHeight - .5) * -7}deg) rotateY(${(event.clientX / innerWidth - .5) * 8}deg)`;
  }, { passive: true });
}
