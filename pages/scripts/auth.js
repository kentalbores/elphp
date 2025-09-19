// Authentication System for SigniFi
// Uses localStorage as placeholder - ready for backend implementation

class AuthManager {
    constructor() {
        this.debugMode = true; // <<< Set to true to preview login design without redirect
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    // Initialize the authentication system
    init() {
        // Check if we're on login or register page
        const registerForm = document.getElementById('registerForm');
        const loginForm = document.querySelector('form:not(#registerForm)');

        if (registerForm) {
            this.initRegister();
        } else if (loginForm && loginForm.querySelector('#email')) {
            this.initLogin();
        }

        // Check if user is already logged in and redirect if needed
        this.checkAuthStatus();
    }

    // Load users from localStorage (placeholder for API call)
    loadUsers() {
        const stored = localStorage.getItem('signifi_users');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Default admin user for testing
        return [
            {
                id: 1,
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@signifi.com',
                password: 'admin123', // In production, this would be hashed
                role: 'admin',
                createdAt: new Date().toISOString(),
                isVerified: true
            }
        ];
    }

    // Save users to localStorage (placeholder for API call)
    saveUsers() {
        localStorage.setItem('signifi_users', JSON.stringify(this.users));
    }

    // Get current logged-in user
    getCurrentUser() {
        const session = localStorage.getItem('signifi_user_session');
        return session ? JSON.parse(session) : null;
    }

    // Set current user session
    setCurrentUser(user) {
        const sessionData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('signifi_user_session', JSON.stringify(sessionData));
        this.currentUser = sessionData;
    }

    // Clear user session
    clearSession() {
        localStorage.removeItem('signifi_user_session');
        this.currentUser = null;
    }

    // Check authentication status
    checkAuthStatus() {
        if (this.debugMode) return; // Skip redirects in debug mode

        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.includes('index.html') || currentPath.includes('register.html') || currentPath === '/';
        
        if (this.currentUser && isAuthPage) {
            if (this.currentUser.role === 'teacher') {
                window.location.href = './pages/educator.html';
            } else if (this.currentUser.role === 'student') {
                window.location.href = './pages/learner.html';
            } else {
                window.location.href = './pages/home.html';
            }
        } else if (!this.currentUser && !isAuthPage && !currentPath.includes('index.html')) {
            window.location.href = '../index.html';
        }
    }

    // Initialize login functionality
    initLogin() {
        const form = document.querySelector('form');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(emailInput.value.trim(), passwordInput.value.trim());
            });
        }

        // Social login placeholders
        const googleBtn = document.querySelector('button[class*="red"]');
        const facebookBtn = document.querySelector('button[class*="blue"]:last-child');
        
        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.handleSocialLogin('google'));
        }
        
        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => this.handleSocialLogin('facebook'));
        }
    }

    // Initialize register functionality
    initRegister() {
        const form = document.getElementById('registerForm');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(new FormData(form));
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.validatePassword(passwordInput.value);
            });
        }

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                this.validatePasswordMatch(passwordInput.value, confirmPasswordInput.value);
            });
        }

        this.setupPasswordToggles();

        const googleBtn = document.getElementById('googleRegister');
        const facebookBtn = document.getElementById('facebookRegister');
        
        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.handleSocialLogin('google'));
        }
        
        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => this.handleSocialLogin('facebook'));
        }
    }

    // Handle login
    handleLogin(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.setCurrentUser(user);
            this.showMessage('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                if (user.role === 'teacher') {
                    window.location.href = './pages/educator.html';
                } else if (user.role === 'student') {
                    window.location.href = './pages/learner.html';
                } else {
                    window.location.href = './pages/home.html';
                }
            }, 1500);
        } else {
            this.showMessage('Invalid email or password. Please try again.', 'error');
        }
    }

    // Handle registration
    handleRegister(formData) {
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            role: formData.get('role'),
            terms: formData.get('terms'),
            newsletter: formData.get('newsletter') === 'on'
        };

        if (!this.validateRegistration(userData)) {
            return;
        }

        if (this.users.find(u => u.email === userData.email)) {
            this.showMessage('An account with this email already exists.', 'error');
            return;
        }

        const newUser = {
            id: this.getNextUserId(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            newsletter: userData.newsletter,
            createdAt: new Date().toISOString(),
            isVerified: false
        };

        this.users.push(newUser);
        this.saveUsers();

        this.showMessage('Account created successfully! You can now sign in.', 'success');
        
        setTimeout(() => {
            if (newUser.role === 'teacher') {
                window.location.href = './educator.html';
            } else if (newUser.role === 'student') {
                window.location.href = './learner.html';
            } else {
                window.location.href = '../index.html';
            }
        }, 2000);
    }

    validateRegistration(userData) {
        if (!userData.firstName || !userData.lastName) {
            this.showMessage('Please enter your first and last name.', 'error');
            return false;
        }

        if (!this.isValidEmail(userData.email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return false;
        }

        if (!this.isValidPassword(userData.password)) {
            this.showMessage('Password must be at least 8 characters with uppercase letter and number.', 'error');
            return false;
        }

        if (userData.password !== userData.confirmPassword) {
            this.showMessage('Passwords do not match.', 'error');
            return false;
        }

        if (!userData.role) {
            this.showMessage('Please select your role.', 'error');
            return false;
        }

        if (!userData.terms) {
            this.showMessage('Please accept the Terms of Service and Privacy Policy.', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPassword(password) {
        return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    }

    validatePassword(password) {
        const lengthCheck = document.getElementById('lengthCheck');
        const uppercaseCheck = document.getElementById('uppercaseCheck');
        const numberCheck = document.getElementById('numberCheck');

        const hasLength = password.length >= 8;
        this.updateValidationIndicator(lengthCheck, hasLength);

        const hasUppercase = /[A-Z]/.test(password);
        this.updateValidationIndicator(uppercaseCheck, hasUppercase);

        const hasNumber = /[0-9]/.test(password);
        this.updateValidationIndicator(numberCheck, hasNumber);

        return hasLength && hasUppercase && hasNumber;
    }

    validatePasswordMatch(password, confirmPassword) {
        const matchElement = document.getElementById('passwordMatch');
        if (!matchElement) return;

        if (confirmPassword === '') {
            matchElement.textContent = '';
            return;
        }

        if (password === confirmPassword) {
            matchElement.textContent = '✓ Passwords match';
            matchElement.className = 'text-xs mt-1 text-green-600';
        } else {
            matchElement.textContent = '✗ Passwords do not match';
            matchElement.className = 'text-xs mt-1 text-red-600';
        }
    }

    updateValidationIndicator(element, isValid) {
        if (!element) return;

        const indicator = element.querySelector('.w-2');
        const text = element.querySelector('span:last-child');

        if (isValid) {
            indicator.className = 'w-2 h-2 bg-green-500 rounded-full';
            text.className = 'text-green-600';
        } else {
            indicator.className = 'w-2 h-2 bg-gray-300 rounded-full';
            text.className = 'text-gray-500';
        }
    }

    setupPasswordToggles() {
        const togglePassword = document.getElementById('togglePassword');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const passwordInput = document.getElementById('password');
                this.togglePasswordVisibility(passwordInput, togglePassword);
            });
        }

        if (toggleConfirmPassword) {
            toggleConfirmPassword.addEventListener('click', () => {
                const confirmPasswordInput = document.getElementById('confirmPassword');
                this.togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
            });
        }
    }

    togglePasswordVisibility(input, button) {
        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = '🙈';
        } else {
            input.type = 'password';
            button.textContent = '👁';
        }
    }

    handleSocialLogin(provider) {
        this.showMessage(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'info');
    }

    getNextUserId() {
        return this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    }

    showMessage(message, type = 'info') {
        let messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) {
            alert(message);
            return;
        }

        const colors = {
            success: 'bg-green-100 text-green-700 border border-green-300',
            error: 'bg-red-100 text-red-700 border border-red-300',
            info: 'bg-blue-100 text-blue-700 border border-blue-300'
        };

        messageContainer.className = `mb-4 p-3 rounded-lg text-sm ${colors[type] || colors.info}`;
        messageContainer.textContent = message;
        messageContainer.classList.remove('hidden');

        setTimeout(() => {
            messageContainer.classList.add('hidden');
        }, 5000);
    }

    logout() {
        this.clearSession();
        window.location.href = '../index.html';
    }

    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    getUserInfo() {
        return this.currentUser;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
