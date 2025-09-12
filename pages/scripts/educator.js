// Educator functionality for SigniFi
// Handles course CRUD operations for educators

class EducatorManager {
    constructor() {
        this.courses = this.loadCourses();
        this.currentUser = this.getCurrentUser();
        this.currentCourseId = null;
        this.init();
    }

    // Initialize the educator interface
    init() {
        this.renderCourses();
        this.setupEventListeners();
        this.setupModal();
    }

    // Load courses from localStorage (placeholder for API)
    loadCourses() {
        const stored = localStorage.getItem('signifi_courses');
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    }

    // Save courses to localStorage (placeholder for API)
    saveCourses() {
        localStorage.setItem('signifi_courses', JSON.stringify(this.courses));
        // TODO: Replace with API call
        // return fetch('/api/courses', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(this.courses)
        // });
    }

    // Get current user
    getCurrentUser() {
        const session = localStorage.getItem('signifi_user_session');
        return session ? JSON.parse(session) : null;
    }

    // Get next course ID
    getNextCourseId() {
        return this.courses.length > 0 ? Math.max(...this.courses.map(c => c.id)) + 1 : 1;
    }

    // CREATE - Add new course
    createCourse(courseData) {
        const newCourse = {
            id: this.getNextCourseId(),
            title: courseData.title,
            description: courseData.description,
            level: courseData.level,
            duration: courseData.duration,
            instructor: courseData.instructor,
            rating: 0,
            enrolled: 0,
            createdBy: this.currentUser?.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.courses.push(newCourse);
        this.saveCourses();
        this.renderCourses();
        this.showNotification(`Course "${newCourse.title}" created successfully!`, 'success');

        // TODO: Replace with API call
        // return fetch('/api/courses', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(newCourse)
        // });
    }

    // READ - Get educator's courses
    getEducatorCourses() {
        return this.courses.filter(course => course.createdBy === this.currentUser?.id);
    }

    // READ - Get course by ID
    getCourseById(id) {
        return this.courses.find(course => course.id === parseInt(id));
    }

    // UPDATE - Update existing course
    updateCourse(id, updatedData) {
        const index = this.courses.findIndex(course => course.id === parseInt(id));
        if (index !== -1) {
            this.courses[index] = {
                ...this.courses[index],
                title: updatedData.title,
                description: updatedData.description,
                level: updatedData.level,
                duration: updatedData.duration,
                instructor: updatedData.instructor,
                updatedAt: new Date().toISOString()
            };
            this.saveCourses();
            this.renderCourses();
            this.showNotification(`Course "${updatedData.title}" updated successfully!`, 'success');
        }

        // TODO: Replace with API call
        // return fetch(`/api/courses/${id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(updatedData)
        // });
    }

    // DELETE - Delete course
    deleteCourse(id) {
        const course = this.getCourseById(id);
        if (!course) return;

        // Check if course has enrollments
        const enrollments = this.getEnrollments();
        const hasEnrollments = enrollments.some(e => e.courseId === id);

        if (hasEnrollments) {
            if (!confirm(`This course has enrolled students. Are you sure you want to delete "${course.title}"? This action cannot be undone.`)) {
                return;
            }
        } else {
            if (!confirm(`Are you sure you want to delete "${course.title}"? This action cannot be undone.`)) {
                return;
            }
        }

        this.courses = this.courses.filter(course => course.id !== parseInt(id));
        this.saveCourses();
        this.renderCourses();
        this.showNotification(`Course "${course.title}" deleted successfully!`, 'success');

        // TODO: Replace with API call
        // return fetch(`/api/courses/${id}`, { method: 'DELETE' });
    }

    // Get enrollments (for checking before deletion)
    getEnrollments() {
        const stored = localStorage.getItem('signifi_enrollments');
        return stored ? JSON.parse(stored) : [];
    }

    // Render educator's courses
    renderCourses() {
        const grid = document.getElementById('coursesGrid');
        const emptyState = document.getElementById('emptyState');
        if (!grid) return;

        const educatorCourses = this.getEducatorCourses();

        if (educatorCourses.length === 0) {
            grid.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        grid.innerHTML = '';

        educatorCourses.forEach(course => {
            const courseCard = this.createCourseCard(course);
            grid.appendChild(courseCard);
        });
    }

    // Create course card element
    createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'bg-white shadow rounded-xl p-6 hover:shadow-lg transition';
        card.setAttribute('data-level', course.level);

        const levelColor = this.getLevelColor(course.level);
        const createdDate = new Date(course.createdAt).toLocaleDateString();

        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-semibold flex-1">${course.title}</h3>
                <div class="flex space-x-1 ml-2">
                    <button class="edit-btn p-1 text-blue-600 hover:bg-blue-100 rounded" data-course-id="${course.id}" title="Edit">
                        ✏️
                    </button>
                    <button class="delete-btn p-1 text-red-600 hover:bg-red-100 rounded" data-course-id="${course.id}" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
            
            <p class="text-gray-500 text-sm mb-3">${course.description}</p>
            
            <div class="space-y-2 text-sm text-gray-600 mb-4">
                <p>👨‍🏫 ${course.instructor}</p>
                <p>⏱️ ${course.duration} • 👥 ${course.enrolled} enrolled</p>
                <p>📅 Created: ${createdDate}</p>
            </div>
            
            <div class="flex items-center justify-between">
                <span class="inline-block px-3 py-1 text-xs ${levelColor} rounded-full">
                    ${course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
                <div class="flex items-center space-x-2">
                    <span class="text-yellow-400">⭐ ${course.rating.toFixed(1)}</span>
                    <button class="view-btn px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200" data-course-id="${course.id}">
                        View Details
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        const viewBtn = card.querySelector('.view-btn');

        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editCourse(course.id);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteCourse(course.id);
            });
        }

        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.viewCourseDetails(course);
            });
        }

        return card;
    }

    // Get level color classes
    getLevelColor(level) {
        switch (level) {
            case 'beginner': return 'bg-green-100 text-green-600';
            case 'intermediate': return 'bg-yellow-100 text-yellow-600';
            case 'advanced': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Add course buttons
        const addCourseBtn = document.getElementById('addCourseBtn');
        const createFirstCourse = document.getElementById('createFirstCourse');
        
        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', () => this.openModal());
        }
        
        if (createFirstCourse) {
            createFirstCourse.addEventListener('click', () => this.openModal());
        }

        // Form submission
        const form = document.getElementById('courseForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Level filter
        const levelFilter = document.getElementById('levelFilter');
        if (levelFilter) {
            levelFilter.addEventListener('change', (e) => this.handleLevelFilter(e.target.value));
        }
    }

    // Setup modal functionality
    setupModal() {
        const modal = document.getElementById('courseModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    // Open modal for adding/editing
    openModal(course = null) {
        const modal = document.getElementById('courseModal');
        const form = document.getElementById('courseForm');
        const title = document.getElementById('modalTitle');

        if (!modal || !form) return;

        this.currentCourseId = course ? course.id : null;

        if (course) {
            title.textContent = 'Edit Course';
            form.title.value = course.title;
            form.description.value = course.description;
            form.level.value = course.level;
            form.duration.value = course.duration;
            form.instructor.value = course.instructor;
        } else {
            title.textContent = 'Create New Course';
            form.reset();
            // Pre-fill instructor with current user name if available
            if (this.currentUser) {
                form.instructor.value = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            }
        }

        modal.classList.remove('hidden');
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('courseModal');
        if (modal) {
            modal.classList.add('hidden');
            this.currentCourseId = null;
        }
    }

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const courseData = {
            title: formData.get('title'),
            description: formData.get('description'),
            level: formData.get('level'),
            duration: formData.get('duration'),
            instructor: formData.get('instructor')
        };

        if (this.currentCourseId) {
            this.updateCourse(this.currentCourseId, courseData);
        } else {
            this.createCourse(courseData);
        }

        this.closeModal();
    }

    // Edit course
    editCourse(id) {
        const course = this.getCourseById(id);
        if (course) {
            this.openModal(course);
        }
    }

    // View course details
    viewCourseDetails(course) {
        const enrollments = this.getEnrollments().filter(e => e.courseId === course.id);
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4 max-h-96 overflow-y-auto">
                <h3 class="text-xl font-bold mb-4">${course.title}</h3>
                <p class="text-gray-600 mb-4">${course.description}</p>
                
                <div class="space-y-2 text-sm mb-4">
                    <p><strong>Instructor:</strong> ${course.instructor}</p>
                    <p><strong>Level:</strong> ${course.level.charAt(0).toUpperCase() + course.level.slice(1)}</p>
                    <p><strong>Duration:</strong> ${course.duration}</p>
                    <p><strong>Rating:</strong> ${course.rating.toFixed(1)}/5 ⭐</p>
                    <p><strong>Enrolled Students:</strong> ${course.enrolled}</p>
                    <p><strong>Created:</strong> ${new Date(course.createdAt).toLocaleDateString()}</p>
                    ${course.updatedAt !== course.createdAt ? 
                        `<p><strong>Last Updated:</strong> ${new Date(course.updatedAt).toLocaleDateString()}</p>` : ''
                    }
                </div>
                
                <div class="flex gap-3">
                    <button class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" 
                            onclick="educatorManager.editCourse(${course.id}); this.parentElement.parentElement.parentElement.remove();">
                        Edit Course
                    </button>
                    <button class="px-4 py-2 text-gray-500 hover:text-gray-700" 
                            onclick="this.parentElement.parentElement.parentElement.remove();">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Handle search
    handleSearch(query) {
        const courseCards = document.querySelectorAll('[data-level]');
        
        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Handle level filter
    handleLevelFilter(level) {
        const courseCards = document.querySelectorAll('[data-level]');
        
        courseCards.forEach(card => {
            const courseLevel = card.getAttribute('data-level');
            
            if (level === 'all' || courseLevel === level) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.educatorManager = new EducatorManager();
});