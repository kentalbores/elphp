document.addEventListener("DOMContentLoaded", () => {

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {

                localStorage.removeItem('signifi_user_session');
                this.currentUser = null;
                
                // In a real app, this would handle logout logic
                console.log('User logged out');
                window.location.href = "../index.html";
                showNotification('Logged out successfully!', 'success');
            }
        });
    }
  });
  