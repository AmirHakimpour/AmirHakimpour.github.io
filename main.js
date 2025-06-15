const header = document.querySelector('.site-header');
const nav = document.querySelector('[data-nav]');
const toggler = document.querySelector('[data-nav-toggler]');

// scroll listener: toggle white bg
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

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
  emailjs.init('U1Ivr5jUgrrQjxibM');
})();

// Your EmailJS identifiers
const SERVICE_ID = 'service_6xd2q1g';
const BOOKING_TEMPLATE = 'template_etf97vp';  // internal notification
const AUTO_REPLY_TEMPLATE = 'template_hj0k37e';  // your Auto-Reply template
const USER_ID = 'U1Ivr5jUgrrQjxibM';

document
  .getElementById('booking-form')
  .addEventListener('submit', function (e) {

    //  Honeypot check – abort if the hidden field has a value
    if (this['bot-field'].value) {
      console.warn('Spam bot caught – submission aborted.');
      return;
    }

    //prevent the normal submit
    e.preventDefault();

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
            name,         // {{name}} in your auto-reply template
            title,        // {{title}} in your auto-reply template
            reply_to,     // used as the “To Email” in your auto-reply settings
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




