// Global variables
let currentUser = null;
let isLoggedIn = false;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeForms();
    initializeScrollEffects();
    loadUserSession();
});

// Navigation Functions
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Scroll to section
            if (targetId.startsWith('#')) {
                scrollToSection(targetId.substring(1));
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#fff';
            navbar.style.backdropFilter = 'none';
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Modal Functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (event.target === loginModal) {
        closeModal('loginModal');
    }
    if (event.target === signupModal) {
        closeModal('signupModal');
    }
});

// Form Initialization
function initializeForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        
        // Password strength checker
        const passwordInput = document.getElementById('signupPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', checkPasswordStrength);
        }
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate login process
    showLoading('loginForm');
    
    setTimeout(() => {
        // Simulate successful login
        currentUser = {
            id: 'user_' + Date.now(),
            email: email,
            name: email.split('@')[0],
            userType: 'patient',
            loginTime: new Date()
        };
        
        isLoggedIn = true;
        
        if (rememberMe) {
            localStorage.setItem('medifile_user', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('medifile_user', JSON.stringify(currentUser));
        }
        
        hideLoading('loginForm');
        closeModal('loginModal');
        showNotification('Login successful! Welcome to MediFile.', 'success');
        updateUIForLoggedInUser();
        
        // Clear form
        document.getElementById('loginForm').reset();
    }, 1500);
}

function handleSignup(e) {
    e.preventDefault();
    
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
        return;
    }
    
    // Simulate signup process
    showLoading('signupForm');
    
    setTimeout(() => {
        // Simulate successful signup
        currentUser = {
            id: 'user_' + Date.now(),
            email: email,
            name: firstName + ' ' + lastName,
            userType: userType,
            signupTime: new Date()
        };
        
        isLoggedIn = true;
        sessionStorage.setItem('medifile_user', JSON.stringify(currentUser));
        
        hideLoading('signupForm');
        closeModal('signupModal');
        showNotification('Account created successfully! Welcome to MediFile.', 'success');
        updateUIForLoggedInUser();
        
        // Clear form
        document.getElementById('signupForm').reset();
    }, 2000);
}

function handleContactForm(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    showLoading('contactForm');
    
    setTimeout(() => {
        hideLoading('contactForm');
        showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        document.getElementById('contactForm').reset();
    }, 1500);
}

// Doctor Search Function
function searchDoctors() {
    const specialty = document.getElementById('specialty').value;
    const location = document.getElementById('location').value;
    const insurance = document.getElementById('insurance').value;
    
    const searchButton = document.querySelector('.btn-search');
    const originalText = searchButton.innerHTML;
    
    // Show loading state
    searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    searchButton.disabled = true;
    
    // Simulate search
    setTimeout(() => {
        const resultsContainer = document.getElementById('doctorResults');
        
        // Generate filtered results based on search criteria
        let filteredDoctors = generateDoctorResults(specialty, location, insurance);
        
        // Update results
        resultsContainer.innerHTML = '';
        
        if (filteredDoctors.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #64748b;">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>No doctors found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            `;
        } else {
            filteredDoctors.forEach(doctor => {
                const doctorCard = createDoctorCard(doctor);
                resultsContainer.appendChild(doctorCard);
            });
        }
        
        // Reset button
        searchButton.innerHTML = originalText;
        searchButton.disabled = false;
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1000);
}

// Helper Functions
function generateDoctorResults(specialty, location, insurance) {
    const allDoctors = [
        {
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            location: 'New York, NY',
            rating: 4.9,
            reviews: 127,
            insurance: ['aetna', 'blue-cross', 'cigna']
        },
        {
            name: 'Dr. Michael Chen',
            specialty: 'Neurology',
            location: 'Los Angeles, CA',
            rating: 4.8,
            reviews: 98,
            insurance: ['medicare', 'humana', 'cigna']
        },
        {
            name: 'Dr. Emily Rodriguez',
            specialty: 'Dermatology',
            location: 'Chicago, IL',
            rating: 4.9,
            reviews: 156,
            insurance: ['blue-cross', 'aetna', 'medicaid']
        },
        {
            name: 'Dr. James Wilson',
            specialty: 'Orthopedics',
            location: 'Houston, TX',
            rating: 4.7,
            reviews: 89,
            insurance: ['humana', 'medicare', 'cigna']
        },
        {
            name: 'Dr. Lisa Thompson',
            specialty: 'Pediatrics',
            location: 'Phoenix, AZ',
            rating: 4.9,
            reviews: 203,
            insurance: ['aetna', 'blue-cross', 'medicaid']
        }
    ];
    
    return allDoctors.filter(doctor => {
        const specialtyMatch = !specialty || doctor.specialty.toLowerCase().includes(specialty.toLowerCase());
        const locationMatch = !location || doctor.location.toLowerCase().includes(location.toLowerCase());
        const insuranceMatch = !insurance || doctor.insurance.includes(insurance);
        
        return specialtyMatch && locationMatch && insuranceMatch;
    });
}

function createDoctorCard(doctor) {
    const card = document.createElement('div');
    card.className = 'doctor-card fade-in';
    
    card.innerHTML = `
        <div class="doctor-avatar">
            <i class="fas fa-user-md"></i>
        </div>
        <div class="doctor-info">
            <h4>${doctor.name}</h4>
            <p class="specialty">${doctor.specialty}</p>
            <p class="location">
                <i class="fas fa-map-marker-alt"></i>
                ${doctor.location}
            </p>
            <div class="rating">
                ${generateStarRating(doctor.rating)}
                <span>${doctor.rating} (${doctor.reviews} reviews)</span>
            </div>
        </div>
        <button class="btn-book" onclick="bookAppointment('${doctor.name}')">Book Appointment</button>
    `;
    
    return card;
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function bookAppointment(doctorName) {
    if (!isLoggedIn) {
        showNotification('Please log in to book an appointment', 'warning');
        openLoginModal();
        return;
    }
    
    showNotification(`Appointment booking initiated with ${doctorName}. Redirecting to booking system...`, 'info');
    
    // Simulate booking process
    setTimeout(() => {
        showNotification('Appointment successfully booked! You will receive a confirmation email shortly.', 'success');
    }, 2000);
}

// User Session Management
function loadUserSession() {
    const savedUser = localStorage.getItem('medifile_user') || sessionStorage.getItem('medifile_user');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    const authButtons = document.querySelector('.nav-auth');
    
    if (isLoggedIn && currentUser) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <span>Welcome, ${currentUser.name}</span>
                <button class="btn-logout" onclick="logout()">Logout</button>
            </div>
        `;
        
        // Add user menu styles
        const style = document.createElement('style');
        style.textContent = `
            .user-menu {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .user-menu span {
                color: #374151;
                font-weight: 500;
            }
            .btn-logout {
                background: #ef4444;
                color: #fff;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            .btn-logout:hover {
                background: #dc2626;
            }
        `;
        document.head.appendChild(style);
    }
}

function logout() {
    currentUser = null;
    isLoggedIn = false;
    localStorage.removeItem('medifile_user');
    sessionStorage.removeItem('medifile_user');
    
    // Reset auth buttons
    const authButtons = document.querySelector('.nav-auth');
    authButtons.innerHTML = `
        <button class="btn-login" onclick="openLoginModal()">Login</button>
        <button class="btn-signup" onclick="openSignupModal()">Sign Up</button>
    `;
    
    showNotification('Logged out successfully', 'info');
}

// Two-Factor Authentication Setup
function setupTwoFactor() {
    showNotification('Two-factor authentication setup initiated. Please check your email for instructions.', 'info');
    
    // Simulate 2FA setup process
    setTimeout(() => {
        showNotification('2FA setup complete! Your account is now more secure.', 'success');
    }, 3000);
}

// Password Strength Checker
function checkPasswordStrength(e) {
    const password = e.target.value;
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (!password) {
        strengthIndicator.textContent = '';
        return;
    }
    
    let strength = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) strength++;
    else feedback.push('at least 8 characters');
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('uppercase letter');
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength++;
    else feedback.push('lowercase letter');
    
    // Number check
    if (/\d/.test(password)) strength++;
    else feedback.push('number');
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    else feedback.push('special character');
    
    // Update indicator
    if (strength < 3) {
        strengthIndicator.textContent = 'Weak password - needs: ' + feedback.join(', ');
        strengthIndicator.className = 'password-strength password-weak';
    } else if (strength < 4) {
        strengthIndicator.textContent = 'Medium strength password';
        strengthIndicator.className = 'password-strength password-medium';
    } else {
        strengthIndicator.textContent = 'Strong password';
        strengthIndicator.className = 'password-strength password-strong';
    }
}

// Utility Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showLoading(formId) {
    const form = document.getElementById(formId);
    const submitButton = form.querySelector('button[type="submit"]');
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    form.classList.add('loading');
}

function hideLoading(formId) {
    const form = document.getElementById(formId);
    const submitButton = form.querySelector('button[type="submit"]');
    
    submitButton.disabled = false;
    form.classList.remove('loading');
    
    // Reset button text based on form type
    if (formId === 'loginForm') {
        submitButton.innerHTML = 'Login';
    } else if (formId === 'signupForm') {
        submitButton.innerHTML = 'Create Account';
    } else if (formId === 'contactForm') {
        submitButton.innerHTML = 'Send Message';
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 2001;
                max-width: 400px;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                background: #10b981;
                color: white;
            }
            
            .notification-error {
                background: #ef4444;
                color: white;
            }
            
            .notification-warning {
                background: #f59e0b;
                color: white;
            }
            
            .notification-info {
                background: #3b82f6;
                color: white;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: auto;
                padding: 4px;
                border-radius: 4px;
                transition: background 0.2s ease;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

// Scroll Effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.service-card, .doctor-card, .stat, .contact-item');
    animateElements.forEach(el => observer.observe(el));
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="display: block"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Quick navigation with Alt + number keys
    if (e.altKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const sections = ['home', 'services', 'find-doctor', 'about', 'contact'];
        const sectionIndex = parseInt(e.key) - 1;
        if (sections[sectionIndex]) {
            scrollToSection(sections[sectionIndex]);
        }
    }
});

// Performance and Analytics (Basic Implementation)
window.addEventListener('load', function() {
    console.log('MediFile Healthcare Platform loaded successfully');
    
    // Track page load time
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    
    // Basic analytics tracking (would integrate with real analytics service)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('An error occurred. Please refresh the page or contact support if the problem persists.', 'error');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}