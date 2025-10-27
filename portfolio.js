AOS.init({
            duration: 800,
            once: true,
            mirror: false
        });
        
        // Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;

         const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light-mode') {
            html.classList.add('light-mode');
        }else {
             html.classList.remove('light-mode');
        }

        themeToggle.addEventListener('click', () => {
            if (html.classList.contains('light-mode')) {
                html.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                html.classList.add('light-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });

        // Contact Form Submission with Modal Feedback

        // Get modal elements
        const statusModal = document.getElementById('status-modal');
        const modalBox = statusModal.querySelector('.modal-box');
        const statusIconContainer = document.getElementById('status-icon-container');
        const statusTitle = document.getElementById('status-title');
        const statusMessage = document.getElementById('status-message');
        const statusCloseBtn = document.getElementById('status-close-btn');
        const form = document.getElementById('contact-form');

        // SVG icons for success and error states
        const successIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        const errorIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

        // Function to show the modal with specific content
        function showStatusModal(type, title, message) {
            modalBox.className = 'modal-box'; // Reset classes
            modalBox.classList.add(type);     // Add 'success' or 'error'

            statusIconContainer.innerHTML = (type === 'success') ? successIconSVG : errorIconSVG;
            statusTitle.textContent = title;
            statusMessage.textContent = message;

            statusModal.classList.add('visible');
        }

        // Function to hide the modal
        function hideStatusModal() {
            statusModal.classList.remove('visible');
        }

        // Add event listeners to close the modal
        statusCloseBtn.addEventListener('click', hideStatusModal);
        statusModal.addEventListener('click', (e) => {
            // Close if the outer overlay is clicked, but not the box itself
            if (e.target === statusModal) {
                hideStatusModal();
            }
        });

        // New form submission event listener
        form.addEventListener("submit", async function(event) {
            event.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;

            // Provide feedback to the user that something is happening
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';

            const formData = {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value,
            };

            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (response.ok) {
                    showStatusModal(
                        'success',
                        'Success!',
                        "Thanks for your message! I'll get back to you soon."
                    );
                    form.reset();
                } else {
                    throw new Error(result.message || 'Something went wrong on the server.');
                }
            } catch (error) {
                showStatusModal(
                    'error',
                    'Oops!',
                    `There was an error sending your message: ${error.message}`
                );
            } finally {
                // Restore the button to its original state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
      
        // Simple Chatbot Logic
        const chatbotContainer = document.getElementById('chatbot-container');
        const chatbotIcon = document.getElementById('chatbot-icon');
        const chatbotWindow = document.getElementById('chatbot-window');
        const closeChatbot = document.getElementById('close-chatbot');
        const chatbotForm = document.getElementById('chatbot-form');
        const chatbotInput = document.getElementById('chatbot-input');
        const chatbotMessages = document.getElementById('chatbot-messages');

        // Initially hide pointer events on the container since the window starts closed
        chatbotContainer.classList.add('hidden-pointer'); 

        chatbotIcon.addEventListener('click', () => {
            chatbotWindow.classList.toggle('visible');
            // If opening, allow pointer events only within the window/icon area
            if (chatbotWindow.classList.contains('visible')) {
                chatbotContainer.classList.remove('hidden-pointer');
            } else {
                // If closing, block pointer events on the entire container area
                chatbotContainer.classList.add('hidden-pointer');
            }
        });

        closeChatbot.addEventListener('click', () => {
            chatbotWindow.classList.remove('visible');
            // When closing, block pointer events on the entire container area
            chatbotContainer.classList.add('hidden-pointer'); 
        });

        chatbotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = chatbotInput.value.trim();
            if (message === '') return;

            // Add user message to the chat window
            const userMessageDiv = document.createElement('div');
            userMessageDiv.classList.add('chat-message', 'user');
            userMessageDiv.textContent = message;
            chatbotMessages.appendChild(userMessageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            chatbotInput.value = '';

            // Simple bot response logic
            const botResponseDiv = document.createElement('div');
            botResponseDiv.classList.add('chat-message', 'bot');

            let responseText = "I'm sorry, I can only answer based on the pre-programmed portfolio data. Could you try asking about a specific project, skill, or experience?";

            const projects = ['microservices', 'e-commerce', 'pipeline', 'cicd', 'automation', 'terraform', 'anomaly'];
            const skills = ['java', 'devops', 'python', 'kubernetes', 'aws', 'spring boot'];
            const experience = ['work', 'experience', 'java developer', 'devops engineer'];

            const lowerCaseMessage = message.toLowerCase();

            if (projects.some(p => lowerCaseMessage.includes(p))) {
                responseText = "This portfolio features a full-stack Java microservices project with a CI/CD pipeline, a dedicated DevOps automation project, and a Python-based AI log anomaly detector.";
            } else if (skills.some(s => lowerCaseMessage.includes(s))) {
                responseText = "This profile highlights strong skills in Java backend development and key DevOps technologies like Docker, Kubernetes, and AWS. Python is also featured for scripting and AI/ML applications.";
            } else if (experience.some(e => lowerCaseMessage.includes(e))) {
                responseText = "This profile showcases experience as both a Junior Java Developer and a current DevOps Engineer, demonstrating a strong career progression in the software development lifecycle.";
            } else {
                responseText = "I'm sorry, I can only answer questions related to the content on this portfolio. Please ask about projects, skills, or experience.";
            }

            setTimeout(() => {
                botResponseDiv.textContent = responseText;
                chatbotMessages.appendChild(botResponseDiv);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);
        });
        
        // Dropdown/Modal Logic (remains unchanged)
            const socialDropdownBtn = document.querySelector('.relative.inline-block.text-left.group > button');
            const socialDropdownMenu = document.querySelector('.relative.inline-block.text-left.group > div');

            if (socialDropdownBtn && socialDropdownMenu) {
                socialDropdownBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    socialDropdownMenu.classList.toggle('opacity-0');
                    socialDropdownMenu.classList.toggle('invisible');
                });

                // Close the dropdown if the user clicks outside of it
                window.addEventListener('click', function(event) {
                    if (!socialDropdownBtn.contains(event.target) && !socialDropdownMenu.contains(event.target)) {
                        socialDropdownMenu.classList.add('opacity-0');
                        socialDropdownMenu.classList.add('invisible');
                    }
                });
            }
      

        // Initialize Feather icons after the DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });

        
        // Certificate Modal Logic (from original portfolio.js - added for completeness)
        const modal = document.getElementById("certificate-modal");
        const modalImg = document.getElementById("modal-img");
        const certificates = document.querySelectorAll(".certificate-item");
        const closeModal = document.getElementsByClassName("close-modal")[0];

        certificates.forEach(item => {
            item.addEventListener('click', function() {
                modal.style.display = "flex";
                modalImg.src = this.querySelector("img").src;
            });
        });

        closeModal.addEventListener('click', function() {
            modal.style.display = "none";
        });

        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });

        // Certificate Carousel Navigation Logic (from original portfolio.js - added for completeness)
        const carousel = document.getElementById('certificate-carousel');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const scrollAmount = 300; // Adjust this value to control scroll distance

        if(carousel) {
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
        // Mobile Menu Toggle Logic
            const hamburgerBtn = document.getElementById('hamburger-menu');
            const mobileMenu = document.getElementById('mobile-menu');

            hamburgerBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            document.querySelectorAll('#mobile-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });



            // --- Dynamic Card Glow Effect (for non-touch devices) ---
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice()) {
document.querySelectorAll('.project-card, .publication-card').forEach(card => {
card.addEventListener('mousemove', e => {
 const rect = card.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;
 card.style.setProperty('--x', `${x}px`);
 card.style.setProperty('--y', `${y}px`);
});
 });
}
        // --- Typed.js Initialization ---
 if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'B.Tech. Computer Science Student',
                'DevOps Engineer',
                'Java Spring Boot Developer',
                'Python Django Developer',
                'Published Researcher in AI/ML'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            startDelay: 500,
            loop: true
        });
    }
        // --- Scroll to Top Button Logic ---
        const scrollTopBtn = document.getElementById('scrollTopBtn');

        if (scrollTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            });

            scrollTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

// End of DOMContentLoaded event listener
        document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#main-nav-links a');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0.6 
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('nav-active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
