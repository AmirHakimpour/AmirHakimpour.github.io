const header = document.querySelector('.site-header');
const nav = document.querySelector('[data-nav]');
const toggler = document.querySelector('[data-nav-toggler]');

// scroll listener: toggle white bg
function updateHeader() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateHeader);
updateHeader(); // also run on load, e.g. after a refresh while scrolled

// mobile menu toggle
toggler.addEventListener('click', () => {
  nav.classList.toggle('active');
  toggler.classList.toggle('open');
  // reflect expanded state
  const isOpen = nav.classList.contains('active');
  toggler.setAttribute('aria-expanded', isOpen);
});

// close mobile menu when any link is clicked
document.querySelectorAll('.nav-list a').forEach(link => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('active')) {
      nav.classList.remove('active');
      toggler.classList.remove('open');
      toggler.setAttribute('aria-expanded', 'false');
    }
  });
});

// feature card logics
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.feature-card').forEach(card => {
    const readMore = card.querySelector('.feature-card__readmore');
    const closeBtn = card.querySelector('.feature-card__close');

    readMore.addEventListener('click', () => {
      card.classList.add('expanded');
    });

    closeBtn.addEventListener('click', () => {
      card.classList.remove('expanded');
    });
  });
});

//booking form
(function () {
  // Initialize EmailJS with your Public Key (Account → General)
  // Guarded so the rest of the page still works if the EmailJS script fails to load
  if (window.emailjs) {
    emailjs.init('U1Ivr5jUgrrQjxibM');
  } else {
    console.warn('EmailJS failed to load – booking form will not send.');
  }
})();

// Your EmailJS identifiers
const SERVICE_ID = 'service_6xd2q1g';
const BOOKING_TEMPLATE = 'template_etf97vp';  // internal notification
const AUTO_REPLY_TEMPLATE = 'template_hj0k37e';  // your Auto-Reply template
const USER_ID = 'U1Ivr5jUgrrQjxibM';

document
  .getElementById('booking-form')
  .addEventListener('submit', function (e) {

    //prevent the normal submit
    e.preventDefault();

    //  Honeypot check – abort if the hidden field has a value
    if (this['bot-field'].value) {
      console.warn('Spam bot caught – submission aborted.');
      return;
    }

    // EmailJS didn't load (blocked / offline)
    if (!window.emailjs) {
      alert('Sorry, the booking form could not load. Please email support@hnhbi.com instead.');
      return;
    }

    //Send the booking notification to your inbox
    emailjs.sendForm(
      SERVICE_ID,
      BOOKING_TEMPLATE,
      this,      // the <form> element
      USER_ID
    )
      .then(() => {
        // After that succeeds, send the auto-reply back to the user
        //    Grab the form values via their `name="..."` attributes:
        const name = this.from_name.value;
        const title = this.service_type.value;
        const reply_to = this.reply_to.value;

        return emailjs.send(
          SERVICE_ID,
          AUTO_REPLY_TEMPLATE,
          {
            name,        
            title,        
            reply_to,    
          },
          USER_ID
        );
      })
      .then(() => {
        alert('Booking request sent! A confirmation email is on its way.');
        this.reset();
      })
      .catch(err => {
        console.error('EmailJS error', err);
        alert('Sorry, something went wrong. Please try again later.');
      });
  });

// Modal open/close handlers
const tosModal = document.getElementById('tos-modal');
const openBtns = document.querySelectorAll('[data-modal-open]');
const closeBtns = document.querySelectorAll('[data-modal-close], .modal-close');

// open
openBtns.forEach(btn =>
  btn.addEventListener('click', () => tosModal.classList.add('active'))
);

// close (overlay & “×”)
closeBtns.forEach(el =>
  el.addEventListener('click', () => tosModal.classList.remove('active'))
);

// also close on Escape key
document.addEventListener('keyup', e => {
  if (e.key === 'Escape' && tosModal.classList.contains('active')) {
    tosModal.classList.remove('active');
  }
});

// ---- Founder profile tabs (About / Credentials / Expertise & Experience) ----
(function () {
  const tabs = Array.from(document.querySelectorAll('.founder-tab'));
  if (!tabs.length) return;
  const tabBar = document.querySelector('.founder-tabs');
  const names = tabs.map(t => t.dataset.tab);

  function activate(name, opts) {
    opts = opts || {};
    const idx = names.indexOf(name);
    if (idx === -1) return;
    tabs.forEach((tab, i) => {
      const on = i === idx;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      if (on) {
        panel.hidden = false;
        panel.classList.remove('is-entering');
        void panel.offsetWidth; // restart the entrance animation
        panel.classList.add('is-entering');
      } else {
        panel.hidden = true;
        panel.classList.remove('is-entering');
      }
    });
    if (opts.focus) tabs[idx].focus();
    // if the tab bar has scrolled out of view (mostly on phones), bring it back
    if (opts.scroll) {
      const top = tabBar.getBoundingClientRect().top;
      if (top < 80 || top > window.innerHeight * 0.6) {
        tabBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab.dataset.tab, { scroll: true }));
    tab.addEventListener('keydown', e => {
      let next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== null) {
        e.preventDefault();
        activate(names[next], { focus: true });
      }
    });
  });

  // buttons / links elsewhere that open a specific tab
  document.querySelectorAll('[data-founder-tab]').forEach(el => {
    el.addEventListener('click', () => activate(el.dataset.founderTab, { scroll: el.tagName === 'BUTTON' }));
  });

  // deep links such as /#credentials or /#expertise
  function fromHash() {
    const key = location.hash.replace('#', '');
    if (key === 'credentials' || key === 'expertise') {
      activate(key);
      const sec = document.getElementById('founder');
      if (sec) sec.scrollIntoView();
    }
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();

// ---- Book video: scale LinkedIn's fixed 504 x 399 player to fit narrow screens ----
(function () {
  const box = document.querySelector('.video-embed');
  const frame = box && box.querySelector('iframe');
  if (!frame) return;
  const W = 504, H = 399;
  function fit() {
    const s = Math.min(1, box.clientWidth / W);
    frame.style.transform = s < 1 ? 'scale(' + s + ')' : '';
    box.style.height = Math.round(H * s) + 'px';
  }
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
})();
