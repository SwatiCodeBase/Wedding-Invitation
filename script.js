'use strict';

// Update this address to the couple's RSVP email before publishing.
const RSVP_EMAIL = 'ananya.arjun@example.com';
const WEDDING_DATE = new Date('2026-11-29T10:30:00+05:30').getTime();

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

function closeMenu() {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
  siteNav?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  siteNav?.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const countdownEls = {
  days: document.querySelector('#days'),
  hours: document.querySelector('#hours'),
  minutes: document.querySelector('#minutes'),
  seconds: document.querySelector('#seconds'),
};
const countdownNote = document.querySelector('#countdown-note');

function updateCountdown() {
  if (!countdownEls.days) return;
  const remaining = WEDDING_DATE - Date.now();

  if (remaining <= 0) {
    Object.values(countdownEls).forEach((element) => { element.textContent = '00'; });
    if (countdownNote) countdownNote.textContent = 'Our forever has begun';
    return;
  }

  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);
  countdownEls.days.textContent = String(days).padStart(2, '0');
  countdownEls.hours.textContent = String(hours).padStart(2, '0');
  countdownEls.minutes.textContent = String(minutes).padStart(2, '0');
  countdownEls.seconds.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox?.querySelector('img');
const galleryButtons = document.querySelectorAll('.gallery-item');

galleryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    const thumbnail = button.querySelector('img');
    lightboxImage.src = button.dataset.full || thumbnail?.src || '';
    lightboxImage.alt = thumbnail?.alt || 'Wedding gallery photo';
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
  });
});

lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox?.addEventListener('close', () => {
  if (lightboxImage) lightboxImage.src = '';
});

const rsvpForm = document.querySelector('#rsvp-form');
const formFeedback = document.querySelector('#form-feedback');

rsvpForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!formFeedback) return;
  formFeedback.textContent = '';

  if (!rsvpForm.reportValidity()) {
    formFeedback.textContent = 'Please complete the required fields to continue.';
    return;
  }

  const formData = new FormData(rsvpForm);
  const guestName = String(formData.get('name')).trim();
  const email = String(formData.get('email')).trim();
  const guests = String(formData.get('guests'));
  const attendance = String(formData.get('attendance'));
  const message = String(formData.get('message') || '').trim();
  const subject = `Wedding RSVP from ${guestName}`;
  const body = [
    `Name: ${guestName}`,
    `Email: ${email}`,
    `Number of guests: ${guests}`,
    `Attendance: ${attendance}`,
    `Message: ${message || '—'}`,
  ].join('\n');
  const mailto = `mailto:${RSVP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  formFeedback.textContent = 'Opening your email app with your RSVP details. Please send the email to complete your reply.';
  window.location.href = mailto;
});
