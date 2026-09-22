const CONFIG = window.siteData;

document.querySelectorAll('[data-site]').forEach((element) => {
  const value = element.dataset.site === 'name' ? CONFIG.name : CONFIG.texts[element.dataset.site];
  if (value !== undefined) element.innerHTML = value;
});

const photoFiles = [
  'photo-01.jpeg', 'photo-02.jpeg', 'photo-03.jpeg', 'photo-04.jpeg',
  'photo-05.jpeg', 'photo-06.jpeg', 'photo-07.jpeg', 'photo-08.jpeg',
  'photo-12.jpeg', 'photo-13.jpeg', 'photo-14.jpeg', 'photo-15.jpeg',
  'photo-16.jpeg', 'photo-17.jpeg', 'photo-18.jpeg', 'photo-19.jpeg',
  'photo-20.jpeg'
];
const photos = photoFiles.map((fileName, index) => ({
  src: `assets/photos/${fileName}`,
  alt: `Momento especial ${index + 1} de ${CONFIG.name}`
}));

const $ = (selector) => document.querySelector(selector);
const timeline = $('#timeline');
const gallery = $('#gallery');
const moments = $('#moments');

timeline.innerHTML = CONFIG.timeline.map((item) => `
  <article class="timeline__item reveal"><div class="timeline__dot"></div><span class="timeline__date">${item.date}</span><h3>${item.title}</h3><p>${item.text}</p></article>
`).join('');

gallery.innerHTML = photos.map((photo, index) => `
  <button class="gallery__item reveal" type="button" data-photo-index="${index}" aria-label="Abrir ${photo.alt}"><img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async"></button>
`).join('');

moments.innerHTML = CONFIG.moments.map((item) => `
  <article class="moment reveal"><span class="moment__icon" aria-hidden="true">${item.icon}</span><h3>${item.title}</h3><p>${item.text}</p></article>
`).join('');
$('#letterText').textContent = CONFIG.letter;
$('#finalMessage').textContent = CONFIG.finalMessage;

const intro = $('#intro');
$('#startButton').addEventListener('click', () => {
  intro.classList.add('is-gone');
  document.body.classList.add('started');
  setTimeout(() => $('#historia').scrollIntoView({ behavior: 'smooth' }), 350);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const envelope = $('#envelope');
envelope.addEventListener('click', () => {
  const isOpen = envelope.classList.toggle('is-open');
  envelope.setAttribute('aria-expanded', String(isOpen));
  $('#letterContent').hidden = !isOpen;
  $('#envelopeHint').textContent = isOpen ? CONFIG.texts.envelopeOpenHint : CONFIG.texts.envelopeClosedHint;
});

const modal = $('#photoModal');
const modalImage = $('#modalImage');
let activePhoto = 0;
function showPhoto(index) {
  activePhoto = (index + photos.length) % photos.length;
  const photo = photos[activePhoto];
  modalImage.src = photo.src;
  modalImage.alt = photo.alt;
  $('#modalCaption').textContent = `${String(activePhoto + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
}
function closeModal() { modal.hidden = true; document.body.style.overflow = ''; }
gallery.addEventListener('click', (event) => {
  const button = event.target.closest('[data-photo-index]');
  if (!button) return;
  showPhoto(Number(button.dataset.photoIndex));
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
});
$('#modalClose').addEventListener('click', closeModal);
$('#modalPrev').addEventListener('click', () => showPhoto(activePhoto - 1));
$('#modalNext').addEventListener('click', () => showPhoto(activePhoto + 1));
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
  if (!modal.hidden && event.key === 'ArrowLeft') showPhoto(activePhoto - 1);
  if (!modal.hidden && event.key === 'ArrowRight') showPhoto(activePhoto + 1);
});

let touchStartX = 0;
modal.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
modal.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 45) showPhoto(activePhoto + (distance < 0 ? 1 : -1));
}, { passive: true });

const audio = $('#backgroundMusic');
const musicButton = $('#musicButton');
if (CONFIG.music) {
  audio.src = CONFIG.music;
  musicButton.disabled = false;
  musicButton.addEventListener('click', async () => {
    if (audio.paused) { await audio.play(); musicButton.innerHTML = '<span>Ⅱ</span><b>Pausar música</b>'; musicButton.setAttribute('aria-label', 'Pausar música'); }
    else { audio.pause(); musicButton.innerHTML = '<span>♫</span><b>Tocar música</b>'; musicButton.setAttribute('aria-label', 'Tocar música'); }
  });
} else {
  musicButton.disabled = true;
  musicButton.title = 'Adicione o caminho de uma música em CONFIG.music';
}

const hearts = $('.finale__hearts');
for (let index = 0; index < 10; index += 1) {
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = index % 3 === 0 ? '♥' : '♡';
  heart.style.left = `${8 + (index * 11) % 88}%`;
  heart.style.bottom = `${-10 - (index % 4) * 12}%`;
  heart.style.animationDelay = `${index * .65}s`;
  heart.style.fontSize = `${14 + (index % 3) * 8}px`;
  hearts.appendChild(heart);
}