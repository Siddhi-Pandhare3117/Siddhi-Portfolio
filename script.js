// ====== Hamburger Menu Toggle ======
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// ====== Typing Effect ======
const typingEl = document.getElementById("typing");
const words = ["Siddhi"," A Developer", "A Programmer", "A Speaker"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        // Word is complete, wait and then start deleting
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        // Word is deleted, move to next word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 300);
    } else {
        // Continue typing or deleting
        setTimeout(type, isDeleting ? 80 : 100);
    }
}

// Start the typing effect
type();

// ====== Smooth Scroll ======
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
    navLinks.classList.remove('active'); // Close nav on link click (mobile)
  });
});

// ====== Dark/Light Mode Toggle ======
const modeToggle = document.querySelector('.mode-toggle');
const body = document.body;

modeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
});

// ====== Sticky Navbar ======
const navbar = document.querySelector('.navbar');
const stickyOffset = navbar.offsetTop;

window.addEventListener('scroll', () => {
  if (window.pageYOffset >= stickyOffset) {
    navbar.classList.add('sticky');
  } else {
    navbar.classList.remove('sticky');
  }
});

// ====== Scroll to Top Button ======
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.textContent = '↑';
scrollToTopBtn.classList.add('scroll-to-top');
document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Show/Hide Scroll to Top button
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add('show');
  } else {
    scrollToTopBtn.classList.remove('show');
  }
});

// ====== Google API Configuration ======
const CLIENT_ID = 'YOUR_CLIENT_ID';
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';
const SCOPES = 'https://www.googleapis.com/auth/gmail.send';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Initialize the Google API client
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('contact-form').addEventListener('submit', handleFormSubmit);
    }
}

// ====== Contact Form Submission ======
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

async function handleFormSubmit(e) {
    e.preventDefault();

    // Show loading state
    formStatus.innerHTML = 'Sending...';
    formStatus.style.color = '#ffd700';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Create email content
    const emailContent = `
        Name: ${name}
        Email: ${email}
        Message: ${message}
    `;

    // Encode the email content
    const encodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    try {
        // Request authorization
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            
            // Send the email
            await gapi.client.gmail.users.messages.send({
                'userId': 'me',
                'resource': {
                    'raw': encodedEmail
                }
            });

            // Show success message
            formStatus.innerHTML = 'Message sent successfully!';
            formStatus.style.color = '#4CAF50';
            
            // Reset form
            contactForm.reset();
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                formStatus.innerHTML = '';
            }, 5000);
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken();
        } else {
            tokenClient.requestAccessToken({prompt: ''});
        }
    } catch (err) {
        console.error('Error:', err);
        formStatus.innerHTML = 'Failed to send message. Please try again.';
        formStatus.style.color = '#f44336';
        
        setTimeout(() => {
            formStatus.innerHTML = '';
        }, 5000);
    }
}

// Load the Google API client
gapiLoaded();
gisLoaded();

// ====== Card Hover Animation ======
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.classList.add('hovered');
  });
  card.addEventListener('mouseleave', () => {
    card.classList.remove('hovered');
  });
});

// ====== Modal Window for Projects ======
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
  card.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn">&times;</span>
        <h3>${card.querySelector('h3').textContent}</h3>
        <p>${card.querySelector('p').textContent}</p>
        <a href="#" class="btn">View Project</a>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.remove();
    });
  });
});

// ====== Scroll Animations ======
const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
const animateOnScroll = () => {
  elementsToAnimate.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 150) {
      el.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Initial check in case the page is already scrolled down

// ====== Preloader ======
window.addEventListener('load', () => {
  document.querySelector('.preloader').style.display = 'none';
});
