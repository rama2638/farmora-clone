// ============================================
// FARMORA VILLA FARMLAND - MAIN JAVASCRIPT
// ============================================

'use strict';

// ============================================
// WAIT FOR DOM TO BE FULLY LOADED
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all modules
    initHeroSlider();
    initMobileMenu();
    initSmoothScroll();
    initGalleryLightbox();
    initMasterplanZoom();
    initContactForm();
    initNewsletterForm();
    initHeaderScroll();
    
    // Initialize GSAP animations (only if GSAP is loaded)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initGSAPAnimations();
    }
    
    console.log('✅ Farmora website initialized successfully');
});

// ============================================
// MODULE 1: HERO SLIDER
// Auto-play every 5 seconds with manual controls
// ============================================
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    // Show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Wrap around if index is out of bounds
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }
        
        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Start auto-play
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 5000); // 5 seconds
    }
    
    // Stop auto-play
    function stopAutoPlay() {
        clearInterval(slideInterval);
    }
    
    // Event Listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            stopAutoPlay();
            startAutoPlay(); // Restart auto-play after manual interaction
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });
    
    // Pause auto-play when user hovers over slider
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopAutoPlay);
        heroSlider.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Start the slider
    startAutoPlay();
    
    console.log('✅ Hero slider initialized');
}

// ============================================
// MODULE 2: MOBILE MENU TOGGLE
// Hamburger menu for mobile devices
// ============================================
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navLinks) {
        console.warn('⚠️ Mobile menu elements not found');
        return;
    }
    
    // Function to close menu
    function closeMenu() {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Function to open menu
    function openMenu() {
        navLinks.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Toggle menu open/close
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close menu when a nav link is clicked
    navLinkItems.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navLinks.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu on window resize (if resizing to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    console.log('✅ Mobile menu initialized');
}

// ============================================
// MODULE 3: SMOOTH SCROLL
// Smooth scrolling for anchor links
// ============================================
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore empty hash or hash-only links
            if (href === '#' || href === '#!') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Get header height for offset
                const header = document.querySelector('.site-header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calculate position
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(href);
            }
        });
    });
    
    console.log('✅ Smooth scroll initialized');
}

// Update active navigation link
function updateActiveNavLink(currentHash) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentHash) {
            link.classList.add('active');
        }
    });
}

// ============================================
// MODULE 4: GALLERY LIGHTBOX
// Full-screen image viewer with navigation
// ============================================
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeBtn = document.getElementById('closeGallery');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    if (!galleryItems.length || !lightbox) return;
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => {
        return {
            src: item.querySelector('img').src,
            alt: item.querySelector('img').alt
        };
    });
    
    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }
    
    // Update lightbox image and counter
    function updateLightboxImage() {
        if (lightboxImage && images[currentImageIndex]) {
            lightboxImage.src = images[currentImageIndex].src;
            lightboxImage.alt = images[currentImageIndex].alt;
        }
        
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
        }
    }
    
    // Show next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }
    
    // Show previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }
    
    // Event Listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevImage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', showNextImage);
    }
    
    // Close on overlay click (not on image)
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
    
    console.log('✅ Gallery lightbox initialized');
}

// ============================================
// MODULE 5: MASTERPLAN ZOOM
// Zoom functionality for master plan image
// ============================================
function initMasterplanZoom() {
    const masterplanImage = document.getElementById('masterplanImage');
    const zoomButton = document.getElementById('zoomButton');
    const masterplanModal = document.getElementById('masterplanModal');
    const closeMasterplan = document.getElementById('closeMasterplan');
    
    if (!masterplanImage || !masterplanModal) return;
    
    // Open masterplan modal
    function openMasterplan() {
        masterplanModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close masterplan modal
    function closeMasterplanModal() {
        masterplanModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event Listeners
    if (masterplanImage) {
        masterplanImage.addEventListener('click', openMasterplan);
    }
    
    if (zoomButton) {
        zoomButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering image click
            openMasterplan();
        });
    }
    
    if (closeMasterplan) {
        closeMasterplan.addEventListener('click', closeMasterplanModal);
    }
    
    // Close on overlay click
    masterplanModal.addEventListener('click', function(e) {
        if (e.target === masterplanModal) {
            closeMasterplanModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && masterplanModal.classList.contains('active')) {
            closeMasterplanModal();
        }
    });
    
    console.log('✅ Masterplan zoom initialized');
}

// ============================================
// MODULE 6: CONTACT FORM HANDLER
// Handle contact form submission to PHP endpoint
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitLoader = document.getElementById('submitLoader');
    
    if (!contactForm) return;
    
    // Extract UTM parameters from URL
    function getUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_term: urlParams.get('utm_term') || ''
        };
    }
    
    // Set UTM parameters in hidden fields
    function setUTMParameters() {
        const utmParams = getUTMParameters();
        document.getElementById('utm_campaign').value = utmParams.utm_campaign;
        document.getElementById('utm_source').value = utmParams.utm_source;
        document.getElementById('utm_medium').value = utmParams.utm_medium;
        document.getElementById('utm_term').value = utmParams.utm_term;
    }
    
    // Initialize UTM parameters on page load
    setUTMParameters();
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Update UTM parameters before submission (captured from URL query string)
        setUTMParameters();
        
        // Ensure download_brochure is set to false (no brochure download)
        const downloadBrochureInput = contactForm.querySelector('input[name="download_brochure"]');
        if (downloadBrochureInput) {
            downloadBrochureInput.value = 'false';
        }
        
        // All required fields are automatically included in form submission:
        // - name (visible field)
        // - email (visible field)
        // - phonenumber (visible field)
        // - project (hidden: "FARMORA")
        // - project_name (hidden: "FARMORA Villa Farmland")
        // - download_brochure (hidden: "false")
        // - form_location (hidden: "farmora/index.html")
        // - utm_campaign, utm_source, utm_medium, utm_term (hidden, populated from URL)
        
        // Disable submit button and show loading
        if (submitBtn) {
            submitBtn.disabled = true;
            if (submitText) submitText.style.display = 'none';
            if (submitLoader) submitLoader.style.display = 'inline';
        }
        
        // Clear previous messages
        if (formMessage) {
            formMessage.style.display = 'none';
            formMessage.textContent = '';
        }
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Log form data to console for debugging
        console.log('📧 Contact Form Submitted:');
        console.log('------------------------');
        for (let [key, value] of formData.entries()) {
            console.log(key + ':', value);
        }
        console.log('------------------------');
        
        // Submit form directly (PHP will handle redirect)
        // The form action is already set to the PHP endpoint
        // We just need to ensure all data is correct before submission
        
        // Show loading state
        if (formMessage) {
            formMessage.textContent = '⏳ Submitting your request...';
            formMessage.className = 'form-message';
            formMessage.style.display = 'block';
        }
        
        // Submit the form (PHP will handle the redirect)
        contactForm.submit();
    });
    
    console.log('✅ Contact form initialized');
}

// ============================================
// MODULE 7: NEWSLETTER FORM HANDLER
// Handle newsletter subscription
// ============================================
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput ? emailInput.value : '';
        
        // Log newsletter subscription
        console.log('📬 Newsletter Subscription:');
        console.log('Email:', email);
        
        // Show success alert
        alert('✅ Thank you for subscribing to our newsletter!');
        
        // Reset form
        newsletterForm.reset();
        
        // In production, send to server
        // fetch('/api/newsletter', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email: email })
        // });
    });
    
    console.log('✅ Newsletter form initialized');
}


// ============================================
// MODULE 9: HEADER SCROLL EFFECT
// Add shadow to header on scroll
// ============================================
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }
    });
    
    console.log('✅ Header scroll effect initialized');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Lazy load images (optional enhancement)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// SECTION SCROLL SPY (Optional Enhancement)
// Update active nav link based on scroll position
// ============================================
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// Initialize scroll spy (optional - uncomment if needed)
// initScrollSpy();

// ============================================
// VIDEO PLAY FUNCTIONALITY (Optional)
// ============================================
function initVideoPlay() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    if (!videoPlaceholder) return;
    
    videoPlaceholder.addEventListener('click', function() {
        // Replace placeholder with actual video embed
        console.log('🎥 Video play clicked - implement video embed here');
        
        // Example: Replace with iframe
        // const videoUrl = 'YOUR_VIDEO_URL';
        // const iframe = document.createElement('iframe');
        // iframe.src = videoUrl;
        // iframe.setAttribute('allowfullscreen', '');
        // this.parentElement.innerHTML = '';
        // this.parentElement.appendChild(iframe);
    });
}

// Initialize video functionality
initVideoPlay();

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Optimize scroll events with debounce
const optimizedScroll = debounce(() => {
    // Add any scroll-based animations here
}, 100);

window.addEventListener('scroll', optimizedScroll);

// ============================================
// MODULE 10: GSAP SCROLL ANIMATIONS
// Smooth scroll-triggered animations using GSAP
// ============================================
function initGSAPAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    console.log('✅ GSAP animations initialized');
    
    // ==========================================
    // HERO PARALLAX EFFECT
    // ==========================================
    const heroSlides = document.querySelectorAll('.hero-slide img');
    
    heroSlides.forEach(slide => {
        gsap.to(slide, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });
    });
    
    // ==========================================
    // FADE & SLIDE UP - ALL SECTIONS
    // ==========================================
    const sections = document.querySelectorAll('section:not(.hero)');
    
    sections.forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 80,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "top 60%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // ==========================================
    // SECTION TITLES ANIMATION
    // ==========================================
    const sectionTitles = document.querySelectorAll('.section-title');
    
    sectionTitles.forEach(title => {
        gsap.from(title, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: title,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // ==========================================
    // TITLE DIVIDERS ANIMATION
    // ==========================================
    const dividers = document.querySelectorAll('.title-divider');
    
    dividers.forEach(divider => {
        gsap.from(divider, {
            width: 0,
            duration: 1,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: divider,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // ==========================================
    // INTRO STATS CARDS - STAGGER
    // ==========================================
    const statCards = document.querySelectorAll('.stat-card');
    
    if (statCards.length) {
        gsap.from(statCards, {
            opacity: 0,
            y: 60,
            scale: 0.9,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.5)",
            scrollTrigger: {
                trigger: '.intro-stats',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    // ==========================================
    // WHY FARMORA CARDS - STAGGER FADE IN
    // ==========================================
    const whyCards = document.querySelectorAll('.why-card');
    
    if (whyCards.length) {
        gsap.from(whyCards, {
            opacity: 0,
            y: 80,
            scale: 0.95,
            duration: 0.7,
            stagger: {
                amount: 1.2,
                from: "start",
                ease: "power2.inOut"
            },
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.why-cards-grid',
                start: "top 90%",
                end: "top 20%",
                toggleActions: "play none none none",
                once: true
            }
        });
        
        // Fallback: Ensure cards are visible if animation doesn't trigger
        setTimeout(() => {
            whyCards.forEach(card => {
                if (window.getComputedStyle(card).opacity === '0') {
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                }
            });
        }, 2000);
    }
    
    // ==========================================
    // HIGHLIGHTS - STAGGER WITH NUMBER PULSE
    // ==========================================
    const highlightItems = document.querySelectorAll('.highlight-item');
    
    if (highlightItems.length) {
        gsap.from(highlightItems, {
            opacity: 0,
            x: -50,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.highlights-grid',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Animate highlight numbers
        const highlightNumbers = document.querySelectorAll('.highlight-number');
        gsap.from(highlightNumbers, {
            scale: 0,
            rotation: 180,
            duration: 0.8,
            stagger: 0.1,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
                trigger: '.highlights-grid',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    // ==========================================
    // MASTERPLAN IMAGE - ZOOM IN
    // ==========================================
    const masterplanImage = document.querySelector('.masterplan-image');
    
    if (masterplanImage) {
        gsap.from(masterplanImage, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: masterplanImage,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    // ==========================================
    // AMENITIES - STAGGER REVEAL
    // ==========================================
    const amenityCategories = document.querySelectorAll('.amenities-category');
    
    amenityCategories.forEach(category => {
        const amenityCards = category.querySelectorAll('.amenity-card');
        
        if (amenityCards.length) {
            // Category title animation
            const categoryTitle = category.querySelector('.amenities-category-title');
            if (categoryTitle) {
                gsap.from(categoryTitle, {
                    opacity: 0,
                    x: -50,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: categoryTitle,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
            
            // Amenity cards stagger animation
            gsap.from(amenityCards, {
                opacity: 0,
                y: 50,
                scale: 0.9,
                duration: 0.5,
                stagger: {
                    amount: 0.8,
                    from: "start",
                    ease: "power1.inOut"
                },
                ease: "power2.out",
                scrollTrigger: {
                    trigger: category,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });
            
            // Icon pulse animation
            const amenityIcons = category.querySelectorAll('.amenity-icon');
            gsap.from(amenityIcons, {
                scale: 0,
                rotation: 360,
                duration: 0.8,
                stagger: 0.1,
                ease: "elastic.out(1, 0.6)",
                scrollTrigger: {
                    trigger: category,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    });
    
    // ==========================================
    // GALLERY IMAGES - STAGGER FADE IN
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length) {
        gsap.from(galleryItems, {
            opacity: 0,
            scale: 0.8,
            y: 60,
            duration: 0.6,
            stagger: {
                amount: 1,
                from: "random",
                ease: "power1.inOut"
            },
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.gallery-grid',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    // ==========================================
    // LOCATION FEATURES - ALTERNATING SLIDE
    // ==========================================
    const locationGroups = document.querySelectorAll('.location-group');
    
    locationGroups.forEach((group, index) => {
        gsap.from(group, {
            opacity: 0,
            x: index % 2 === 0 ? -60 : 60,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
                trigger: group,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // ==========================================
    // MAP CONTAINER - ZOOM IN
    // ==========================================
    const mapContainer = document.querySelector('.map-container');
    
    if (mapContainer) {
        gsap.from(mapContainer, {
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: mapContainer,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    // ==========================================
    // CONTACT FORM - SLIDE IN
    // ==========================================
    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form-wrapper');
    
    if (contactInfo) {
        gsap.from(contactInfo, {
            opacity: 0,
            x: -80,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.contact-content',
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    if (contactForm) {
        gsap.from(contactForm, {
            opacity: 0,
            x: 80,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.contact-content',
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    // ==========================================
    // FORM FIELDS - STAGGER
    // ==========================================
    const formGroups = document.querySelectorAll('.contact-form .form-group');
    
    if (formGroups.length) {
        gsap.from(formGroups, {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.contact-form',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    // ==========================================
    // FOOTER COLUMNS - FADE UP
    // ==========================================
    const footerColumns = document.querySelectorAll('.footer-column');
    
    if (footerColumns.length) {
        gsap.from(footerColumns, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.footer-content',
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    // ==========================================
    // VIDEO SECTION - PLAY BUTTON PULSE
    // ==========================================
    const videoPlayButton = document.querySelector('.video-play-button');
    
    if (videoPlayButton) {
        gsap.from(videoPlayButton, {
            scale: 0,
            rotation: 180,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
                trigger: '.video-section',
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Continuous pulse animation
        gsap.to(videoPlayButton, {
            scale: 1.1,
            duration: 1.5,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true
        });
    }
    
    console.log('🎬 GSAP scroll animations loaded');
}

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%c🌿 Welcome to FARMORA Villa Farmland 🌿', 'color: #234D2A; font-size: 20px; font-weight: bold;');
console.log('%cPremium Villa Farmland Plots in Yenkapally', 'color: #B46A39; font-size: 14px;');
console.log('%cDeveloped by Sreenivasa Infra', 'color: #666; font-size: 12px;');
