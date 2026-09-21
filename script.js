const gallery = document.querySelector('#polaroidGallery');

function renderGallery() {
  if (!photos.length) {
    gallery.innerHTML = `<div class="empty-gallery"><strong>Este espacio espera sus recuerdos.</strong>Agrega las fotos en <code>assets/photos</code> y pon sus nombres en <code>gallery.js</code>.</div>`;
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
  if (!playlist.length) { trackName.textContent = 'Agrega tu canción en assets/music y su nombre en music.js.'; return; }
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

renderGallery();
if (playlist.length) loadTrack(0);
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: .13 });
document.querySelectorAll('.section-reveal').forEach(section => revealObserver.observe(section));
