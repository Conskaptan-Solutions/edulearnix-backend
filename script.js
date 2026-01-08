// =====================================================================
// 🔹 FINAL JAVASCRIPT FOR HOMEPAGE 🔹
// This single script controls all dynamic features on home.html
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Logic ---
    const mobileMenu = document.getElementById('mobile-menu');
    const openBtn = document.getElementById('mobile-menu-open-btn');
    const closeBtn = document.getElementById('mobile-menu-close-btn');
    const overlay = document.getElementById('mobile-menu-overlay');
    const menuContent = document.getElementById('mobile-menu-content');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const openMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove('hidden');
        setTimeout(() => {
            if (menuContent) menuContent.classList.remove('-translate-x-full');
        }, 10);
    };

    const closeMenu = () => {
        if (menuContent) menuContent.classList.add('-translate-x-full');
        setTimeout(() => {
            if (mobileMenu) mobileMenu.classList.add('hidden');
        }, 300);
    };

    if (openBtn) openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- 2. Animated Number Counter Logic ---
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const counters = statsSection.querySelectorAll('h3');
        let hasAnimated = false;

        const startCounter = (counter) => {
            const target = +counter.dataset.target;
            const increment = target / 200;

            const updateCount = () => {
                const current = +counter.innerText.replace('+', '');
                if (current < target) {
                    counter.innerText = Math.ceil(current + increment) + '+';
                    setTimeout(updateCount, 5);
                } else {
                    counter.innerText = target + '+';
                }
            };
            updateCount();
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                counters.forEach(startCounter);
                hasAnimated = true;
            }
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // --- 3. Testimonial Slider Logic ---
    const slider = document.getElementById('testimonial-slider');
    if (slider) {
        const testimonials = [
            { name: 'Priya S.', quote: 'The DSA notes were a lifesaver for my interviews!', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=PS' },
            { name: 'Rohan M.', quote: 'Found my dream internship through the Job Kaptan portal. Highly recommended.', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=RM' },
            { name: 'Anjali D.', quote: 'The free courses are better than some paid ones I’ve taken. Amazing quality.', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=AD' },
            { name: 'Vikram J.', quote: 'The project resources helped me build a portfolio that got me hired.', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=VJ' },
            { name: 'Sneha K.', quote: 'A fantastic all-in-one platform for any tech student.', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=SK' },
            { name: 'Amit R.', quote: 'The SQL guide was clear, concise, and exactly what I needed.', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=AR' },
            { name: 'Nisha D.', quote: 'Love the digital product recommendations, saved me a lot of time.', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=ND' },
            { name: 'Karan V.', quote: 'The community and support here are incredible. Keep up the great work!', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=KV' },
            { name: 'Sunita P.', quote: 'Finally understood Git and GitHub thanks to the simple tutorials.', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=SP' },
            { name: 'Aditya G.', quote: 'The hardware project guides are unique and very detailed.', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=AG' },
            { name: 'Tanya A.', quote: 'The interview prep notes gave me the confidence to ace my HR round.', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=TA' },
            { name: 'Mohit Z.', quote: 'Found a great freelance gig on the job board. So much variety!', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=MZ' },
            { name: 'Jasleen B.', quote: 'The best place for free, reliable engineering resources on the web.', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=JB' },
            { name: 'Rahul C.', quote: 'The video tutorials are top-notch and easy to follow.', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=RC' },
            { name: 'Deepak S.', quote: 'A must-visit site before any technical interview. Period.', img: 'https://placehold.co/100x100/E2E8F0/4A5568?text=DS' }
        ];

        const dotsContainer = document.getElementById('dots-container');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        const getInitials = (name) => {
            const parts = name.split(' ');
            return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
        };

        const avatarColors = ['bg-indigo-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500', 'bg-purple-500', 'bg-emerald-500', 'bg-fuchsia-500'];

        testimonials.forEach((t, i) => {
            const initials = getInitials(t.name);
            const avatarColor = avatarColors[i % avatarColors.length];
            const slide = document.createElement('div');
            slide.className = 'testimonial-slide flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-4';
            slide.innerHTML = `
                <div class="bg-white h-full p-8 rounded-2xl shadow-lg border-l-4 border-indigo-500 flex flex-col">
                    <p class="text-gray-600 italic mb-6 flex-grow">"${t.quote}"</p>
                    <div class="flex items-center">
                        <div class="flex items-center justify-center w-12 h-12 rounded-full mr-4 ${avatarColor} text-white font-bold text-lg">
                            ${initials}
                        </div>
                        <div>
                            <p class="font-bold text-gray-800">${t.name}</p>
                        </div>
                    </div>
                </div>
            `;
            slider.appendChild(slide);

            const dot = document.createElement('button');
            dot.className = 'w-2.5 h-2.5 rounded-full bg-gray-300 transition-colors';
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        });

        let currentIndex = 0;
        const slides = slider.querySelectorAll('.testimonial-slide');
        const dots = dotsContainer.querySelectorAll('button');

        const updateSlider = () => {
            if (slides.length > 0) {
                const scrollAmount = slides[currentIndex].offsetLeft - slider.offsetLeft;
                slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                dots.forEach((dot, i) => {
                    dot.classList.toggle('bg-indigo-600', i === currentIndex);
                    dot.classList.toggle('bg-gray-300', i !== currentIndex);
                });
            }
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateSlider();
        });

        dotsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                currentIndex = parseInt(e.target.dataset.index);
                updateSlider();
            }
        });

        updateSlider();
    }

    // --- 4. Typing Animation Logic ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const sentences = ["Empower Your Future.", "Unlock Your Potential.", "Build Your Career."];
        let sentenceIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentSentence = sentences[sentenceIndex];
            if (isDeleting) {
                typingTextElement.textContent = currentSentence.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    sentenceIndex = (sentenceIndex + 1) % sentences.length;
                    setTimeout(type, 500);
                } else {
                    setTimeout(type, 50);
                }
            } else {
                typingTextElement.textContent = currentSentence.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentSentence.length) {
                    isDeleting = true;
                    setTimeout(type, 1500);
                } else {
                    setTimeout(type, 100);
                }
            }
        }
        type();
    }
});
