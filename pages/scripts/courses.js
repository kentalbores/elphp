// courses.js - JavaScript for SigniFi Courses page

document.addEventListener('DOMContentLoaded', function() {
    
  // Initialize course filtering functionality
  initializeCourseFiltering();
  
  // Initialize course interactions
  initializeCourseInteractions();
  
  // Initialize logout functionality
  initializeLogout();
});

function initializeCourseFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');
  
  filterButtons.forEach(button => {
      button.addEventListener('click', function() {
          const filterType = this.getAttribute('data-filter');
          
          // Update active filter button
          filterButtons.forEach(btn => {
              btn.classList.remove('bg-blue-600', 'text-white');
              btn.classList.add('bg-blue-100', 'text-blue-600');
          });
          
          this.classList.remove('bg-blue-100', 'text-blue-600');
          this.classList.add('bg-blue-600', 'text-white');
          
          // Filter courses
          filterCourses(filterType, courseCards);
      });
  });
}

function filterCourses(filterType, courseCards) {
  courseCards.forEach(card => {
      const courseLevel = card.getAttribute('data-level');
      
      if (filterType === 'all' || courseLevel === filterType) {
          card.style.display = 'block';
          // Add fade-in animation
          card.style.opacity = '0';
          setTimeout(() => {
              card.style.opacity = '1';
              card.style.transition = 'opacity 0.3s ease-in-out';
          }, 50);
      } else {
          card.style.display = 'none';
      }
  });
  
  updateCourseCount(filterType, courseCards);
}

function updateCourseCount(filterType, courseCards) {
  const visibleCourses = Array.from(courseCards).filter(card => {
      const courseLevel = card.getAttribute('data-level');
      return filterType === 'all' || courseLevel === filterType;
  });
  
  const countElement = document.getElementById('course-count');
  if (countElement) {
      const filterText = filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1);
      countElement.textContent = `${filterText} Courses (${visibleCourses.length})`;
  }
}

function initializeCourseInteractions() {
  const courseCards = document.querySelectorAll('.course-card');
  
  courseCards.forEach(card => {
      // Add click to view course details
      card.addEventListener('click', function() {
          const courseTitle = this.querySelector('h3').textContent;
          viewCourseDetails(courseTitle);
      });
      
      // Add hover effects
      card.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-4px)';
          this.style.transition = 'transform 0.2s ease-in-out';
      });
      
      card.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
      });
      
      // Handle enrollment button if it exists
      const enrollBtn = card.querySelector('.enroll-btn');
      if (enrollBtn) {
          enrollBtn.addEventListener('click', function(e) {
              e.stopPropagation(); // Prevent card click
              const courseTitle = card.querySelector('h3').textContent;
              enrollInCourse(courseTitle);
          });
      }
  });
}

function viewCourseDetails(courseTitle) {
  // In a real app, this would navigate to a course details page
  console.log(`Viewing details for: ${courseTitle}`);
  
  // Show a modal or navigate to course details
  showCourseModal(courseTitle);
}

function showCourseModal(courseTitle) {
  // Create a simple modal for course details
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 class="text-xl font-bold mb-4">${courseTitle}</h3>
          <p class="text-gray-600 mb-4">Course details would be displayed here. This would typically include:</p>
          <ul class="text-sm text-gray-500 mb-4 space-y-1">
              <li>• Detailed course description</li>
              <li>• Learning objectives</li>
              <li>• Course syllabus</li>
              <li>• Instructor information</li>
              <li>• Prerequisites</li>
          </ul>
          <div class="flex gap-3">
              <button class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onclick="enrollInCourse('${courseTitle}'); this.parentElement.parentElement.parentElement.remove();">
                  Enroll Now
              </button>
              <button class="px-4 py-2 text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.parentElement.remove();">
                  Close
              </button>
          </div>
      </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close modal when clicking outside
  modal.addEventListener('click', function(e) {
      if (e.target === modal) {
          modal.remove();
      }
  });
}

function enrollInCourse(courseTitle) {
  // In a real app, this would handle course enrollment
  console.log(`Enrolling in: ${courseTitle}`);
  
  // Show success message
  showNotification(`Successfully enrolled in ${courseTitle}!`, 'success');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  }`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
      notification.remove();
  }, 3000);
}

function initializeLogout() {
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
      logoutButton.addEventListener('click', function() {
          if (confirm('Are you sure you want to logout?')) {
              // In a real app, this would handle logout logic
              console.log('User logged out');
              // window.location.href = '../auth/login.html';
              showNotification('Logged out successfully!', 'success');
          }
      });
  }
}

// Search functionality (if search input is added)
function initializeSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
      searchInput.addEventListener('input', function() {
          const searchTerm = this.value.toLowerCase();
          const courseCards = document.querySelectorAll('.course-card');
          
          courseCards.forEach(card => {
              const title = card.querySelector('h3').textContent.toLowerCase();
              const description = card.querySelector('p').textContent.toLowerCase();
              
              if (title.includes(searchTerm) || description.includes(searchTerm)) {
                  card.style.display = 'block';
              } else {
                  card.style.display = 'none';
              }
          });
      });
  }
}

// Sort functionality
function sortCourses(sortBy) {
  const coursesContainer = document.querySelector('.courses-grid');
  const courseCards = Array.from(document.querySelectorAll('.course-card'));
  
  courseCards.sort((a, b) => {
      switch(sortBy) {
          case 'name':
              return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
          case 'rating':
              // Extract rating from stars (would need to be implemented based on actual rating data)
              return 0; // Placeholder
          case 'enrolled':
              const aEnrolled = parseInt(a.querySelector('[data-enrolled]')?.getAttribute('data-enrolled') || '0');
              const bEnrolled = parseInt(b.querySelector('[data-enrolled]')?.getAttribute('data-enrolled') || '0');
              return bEnrolled - aEnrolled;
          default:
              return 0;
      }
  });
  
  // Re-append sorted cards
  courseCards.forEach(card => {
      coursesContainer.appendChild(card);
  });
}