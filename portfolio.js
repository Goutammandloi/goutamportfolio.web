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

        // Contact Form Submission
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const formMessage = document.getElementById('form-message');
            formMessage.innerHTML = '<span class="text-green-600">Thank you for your message! I will get back to you shortly.</span>';
            this.reset();
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