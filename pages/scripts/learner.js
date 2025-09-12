// Learner functionality for SigniFi
// Handles course browsing, enrollment, and progress tracking

class LearnerManager {
    constructor() {
        this.courses = this.loadCourses();
        this.enrollments = this.loadEnrollments();
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    // Initialize the learner interface
    init() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('learner.html')) {
            this.renderAvailableCourses();
            this.setupCourseFiltering();
            this.setupSearch();
        } else if (currentPage.includes('learner-enrolled.html')) {
            this.renderEnrolledCourses();
        }
    }

    // Load courses from localStorage (placeholder for API)
    loadCourses() {
        const stored = localStorage.getItem('signifi_courses');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Default courses data
        const defaultCourses = [
            {
                id: 1,
                title: 'Intro to FSL',
                description: 'Basics of Filipino Sign Language including alphabet, greetings, and simple phrases.',
                level: 'beginner',
                duration: '6 hrs',
                rating: 4.0,
                enrolled: 45,
                instructor: 'Prof. Maria Santos',
                createdBy: 1 // educator user id
            },
            {
                id: 2,
                title: 'Intermediate FSL',
                description: 'Focuses on conversational fluency, sentence construction, and practical dialogues.',
                level: 'intermediate',
                duration: '8 hrs',
                rating: 4.8,
                enrolled: 32,
                instructor: 'Prof. Juan Dela Cruz',
                createdBy: 1
            },
            {
                id: 3,
                title: 'Advanced FSL',
                description: 'Covers professional-level grammar, academic usage, and cultural context in FSL.',
                level: 'advanced',
                duration: '12 hrs',
                rating: 4.2,
                enrolled: 18,
                instructor: 'Prof. Ana Reyes',
                createdBy: 1
            },
            {
                id: 4,
                title: 'FSL Grammar Basics',
                description: 'Introduction to Filipino Sign Language grammar rules and sentence patterns.',
                level: 'beginner',
                duration: '5 hrs',
                rating: 4.1,
                enrolled: 25,
                instructor: 'Prof. Carlos Lopez',
                createdBy: 1
            },
            {
                id: 5,
                title: 'FSL for Everyday Use',
                description: 'Practical signs for shopping, commuting, ordering food, and daily interactions.',
                level: 'beginner',
                duration: '7 hrs',
                rating: 4.9,
                enrolled: 50,
                instructor: 'Prof. Lisa Garcia',
                createdBy: 1
            },
            {
                id: 6,
                title: 'FSL Storytelling',
                description: 'Learn expressive techniques for telling stories and narratives in FSL.',
                level: 'advanced',
                duration: '10 hrs',
                rating: 4.3,
                enrolled: 15,
                instructor: 'Prof. Miguel Torres',
                createdBy: 1
            },
            {
                id: 7,
                title: 'FSL for Educators',
                description: 'Specialized FSL training for teachers and classroom facilitators.',
                level: 'intermediate',
                duration: '14 hrs',
                rating: 4.0,
                enrolled: 10,
                instructor: 'Prof. Rosa Martinez',
                createdBy: 1
            },
            {
                id: 8,
                title: 'FSL Culture & Community',
                description: 'Understand Deaf culture, advocacy, and social context of Filipino Sign Language.',
                level: 'beginner',
                duration: '4 hrs',
                rating: 4.7,
                enrolled: 8,
                instructor: 'Prof. David Aquino',
                createdBy: 1
            }
        ];
        
        localStorage.setItem('signifi_courses', JSON.stringify(defaultCourses));
        return defaultCourses;
    }

    // Load user enrollments
    loadEnrollments() {
        const stored = localStorage.getItem('signifi_enrollments');
        return stored ? JSON.parse(stored) : [];
    }

    // Save enrollments
    saveEnrollments() {
        localStorage.setItem('signifi_enrollments', JSON.stringify(this.enrollments));
    }

    // Get current user
    getCurrentUser() {
        const session = localStorage.getItem('signifi_user_session');
        return session ? JSON.parse(session) : null;
    }

    // Render available courses for browsing
    renderAvailableCourses() {
        const grid = document.getElementById('coursesGrid');
        if (!grid) return;

        grid.innerHTML = '';

        this.courses.forEach(course => {
            const courseCard = this.createCourseCard(course, false);
            grid.appendChild(courseCard);
        });

        this.updateCourseCount('all');
    }

    // Render enrolled courses
    renderEnrolledCourses() {
        const grid = document.getElementById('enrolledCoursesGrid');
        const emptyState = document.getElementById('emptyState');
        if (!grid) return;

        const userEnrollments = this.enrollments.filter(e => 
            e.userId === this.currentUser?.id
        );

        if (userEnrollments.length === 0) {
            grid.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        grid.innerHTML = '';

        userEnrollments.forEach(enrollment => {
            const course = this.courses.find(c => c.id === enrollment.courseId);
            if (course) {
                const courseCard = this.createCourseCard(course, true, enrollment);
                grid.appendChild(courseCard);
            }
        });
    }

    // Create course card element
    createCourseCard(course, isEnrolled = false, enrollment = null) {
        const card = document.createElement('div');
        card.className = 'bg-white shadow rounded-xl p-6 hover:shadow-lg transition cursor-pointer';
        card.setAttribute('data-level', course.level);

        const stars = this.generateStars(course.rating);
        const levelColor = this.getLevelColor(course.level);
        const progress = enrollment ? enrollment.progress : 0;

        card.innerHTML = `
            <h3 class="text-lg font-semibold">${course.title}</h3>
            <p class="text-gray-500 text-sm mt-2">${course.description}</p>
            <div class="flex items-center gap-2 mt-3 text-yellow-400">
                ${stars} <span class="text-gray-400 text-xs">(${course.rating} rating)</span>
            </div>
            <p class="text-sm text-gray-400 mt-2">
                👥 ${course.enrolled} enrolled • ⏱️ ${course.duration} • ${course.level}
            </p>
            <p class="text-sm text-gray-500 mt-1">👨‍🏫 ${course.instructor}</p>
            
            ${isEnrolled ? `
                <div class="mt-4">
                    <div class="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: ${progress}%"></div>
                    </div>
                </div>
            ` : ''}
            
            <div class="flex items-center justify-between mt-4">
                <span class="inline-block px-3 py-1 text-xs ${levelColor} rounded-full">
                    ${course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
                ${isEnrolled ? 
                    `<button class="continue-btn px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700" data-course-id="${course.id}">
                        Continue
                    </button>` :
                    `<button class="enroll-btn px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700" data-course-id="${course.id}">
                        Enroll
                    </button>`
                }
            </div>
        `;

        // Add event listeners
        const actionBtn = card.querySelector('.enroll-btn, .continue-btn');
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (actionBtn.classList.contains('enroll-btn')) {
                    this.enrollInCourse(course.id);
                } else {
                    this.continueCourse(course.id);
                }
            });
        }

        card.addEventListener('click', () => {
            this.viewCourseDetails(course);
        });

        return card;
    }

    // Generate star rating display
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '⭐';
        }
        if (hasHalfStar) {
            stars += '⭐';
        }
        for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
            stars += '☆';
        }
        
        return stars;
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

    // Enroll in course
    enrollInCourse(courseId) {
        if (!this.currentUser) {
            this.showNotification('Please log in to enroll in courses.', 'error');
            return;
        }

        // Check if already enrolled
        const existingEnrollment = this.enrollments.find(e => 
            e.userId === this.currentUser.id && e.courseId === courseId
        );

        if (existingEnrollment) {
            this.showNotification('You are already enrolled in this course!', 'info');
            return;
        }

        // Create new enrollment
        const enrollment = {
            id: this.getNextEnrollmentId(),
            userId: this.currentUser.id,
            courseId: courseId,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            status: 'active'
        };

        this.enrollments.push(enrollment);
        this.saveEnrollments();

        // Update course enrollment count
        const course = this.courses.find(c => c.id === courseId);
        if (course) {
            course.enrolled += 1;
            localStorage.setItem('signifi_courses', JSON.stringify(this.courses));
            this.showNotification(`Successfully enrolled in ${course.title}!`, 'success');
        }
    }

    // Continue course (placeholder for course content)
    continueCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (course) {
            this.showNotification(`Continuing ${course.title}... (Course content coming soon!)`, 'info');
        }
    }

    // View course details
    viewCourseDetails(course) {
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
                    <p><strong>Rating:</strong> ${course.rating}/5 ⭐</p>
                    <p><strong>Enrolled:</strong> ${course.enrolled} students</p>
                </div>
                
                <div class="text-sm text-gray-500 mb-4">
                    <p><strong>What you'll learn:</strong></p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li>Core FSL vocabulary and grammar</li>
                        <li>Practical communication skills</li>
                        <li>Cultural context and etiquette</li>
                        <li>Interactive exercises and practice</li>
                    </ul>
                </div>
                
                <div class="flex gap-3">
                    <button class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" 
                            onclick="learnerManager.enrollInCourse(${course.id}); this.parentElement.parentElement.parentElement.remove();">
                        Enroll Now
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

    // Setup course filtering
    setupCourseFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterType = button.getAttribute('data-filter');
                
                // Update active filter button
                filterButtons.forEach(btn => {
                    btn.classList.remove('bg-blue-600', 'text-white');
                    btn.classList.add('bg-blue-100', 'text-blue-600');
                });
                
                button.classList.remove('bg-blue-100', 'text-blue-600');
                button.classList.add('bg-blue-600', 'text-white');
                
                this.filterCourses(filterType);
            });
        });
    }

    // Filter courses by level
    filterCourses(filterType) {
        const courseCards = document.querySelectorAll('[data-level]');
        
        courseCards.forEach(card => {
            const courseLevel = card.getAttribute('data-level');
            
            if (filterType === 'all' || courseLevel === filterType) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        this.updateCourseCount(filterType);
    }

    // Update course count display
    updateCourseCount(filterType) {
        const countElement = document.getElementById('course-count');
        if (!countElement) return;

        const visibleCourses = this.courses.filter(course => 
            filterType === 'all' || course.level === filterType
        );
        
        const filterText = filterType === 'all' ? 'Available' : 
                          filterType.charAt(0).toUpperCase() + filterType.slice(1);
        countElement.textContent = `${filterText} Courses (${visibleCourses.length})`;
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchCourses(e.target.value);
            });
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortCourses(e.target.value);
            });
        }
    }

    // Search courses
    searchCourses(query) {
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

    // Sort courses
    sortCourses(sortBy) {
        const grid = document.getElementById('coursesGrid');
        if (!grid) return;

        const courseCards = Array.from(grid.children);
        
        courseCards.sort((a, b) => {
            const aTitle = a.querySelector('h3').textContent;
            const bTitle = b.querySelector('h3').textContent;
            
            switch (sortBy) {
                case 'name':
                    return aTitle.localeCompare(bTitle);
                case 'rating':
                    // Would need to extract rating from course data
                    return 0;
                case 'enrolled':
                    // Would need to extract enrollment count
                    return 0;
                default:
                    return 0;
            }
        });
        
        courseCards.forEach(card => grid.appendChild(card));
    }

    // Get next enrollment ID
    getNextEnrollmentId() {
        return this.enrollments.length > 0 ? 
               Math.max(...this.enrollments.map(e => e.id)) + 1 : 1;
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
    window.learnerManager = new LearnerManager();
});