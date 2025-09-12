document.addEventListener("DOMContentLoaded", () => {

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {

                localStorage.removeItem('signifi_user_session');
                this.currentUser = null;
                
                // In a real app, this would handle logout logic
                console.log('User logged out');
                window.location.href = "../../index.html";
            }
        });
    }

    if (localStorage.getItem('theme') === 'dark') {
        document.body.className = 'bg-gray-900 text-white font-sans min-h-screen flex flex-col';
      }

    // Check user role and redirect if on wrong page
    checkUserAccess();
  });

function checkUserAccess() {
    const currentUser = getCurrentUser();
    const currentPath = window.location.pathname;
    
    if (!currentUser) return;
    
    // Define role-based page access
    const educatorPages = ['educator.html'];
    const learnerPages = ['learner.html', 'learner-enrolled.html'];
    const sharedPages = ['profile.html', 'settings.html'];
    
    const isEducatorPage = educatorPages.some(page => currentPath.includes(page));
    const isLearnerPage = learnerPages.some(page => currentPath.includes(page));
    const isSharedPage = sharedPages.some(page => currentPath.includes(page));
    
    // Redirect if user is on wrong role page
    if (currentUser.role === 'teacher' && isLearnerPage) {
        window.location.href = './educator.html';
    } else if (currentUser.role === 'student' && isEducatorPage) {
        window.location.href = './learner.html';
    }
}

function getCurrentUser() {
    const session = localStorage.getItem('signifi_user_session');
    return session ? JSON.parse(session) : null;
}

// Theme toggle function
function toggleTheme() {
    const body = document.body;
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.className = newTheme === 'light' 
      ? 'bg-gray-100 text-gray-900 font-sans min-h-screen flex flex-col' 
      : 'bg-gray-900 text-white font-sans min-h-screen flex flex-col';
    localStorage.setItem('theme', newTheme);
  }