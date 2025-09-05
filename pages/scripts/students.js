// Students CRUD functionality
// This uses localStorage as a placeholder - replace with API calls when backend is ready

class StudentsManager {
    constructor() {
        this.students = this.loadStudents();
        this.nextId = this.getNextId();
        this.init();
    }

    // Initialize the page
    init() {
        this.renderStudentsTable();
        this.setupEventListeners();
        this.setupModal();
    }

    // Load students from localStorage (placeholder for API call)
    loadStudents() {
        const stored = localStorage.getItem('signifi_students');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Default students data
        return [
            {
                id: 1,
                name: 'Angela Cruz',
                email: 'angela@example.com',
                course: 'Intro to FSL',
                progress: 90,
                status: 'Active'
            },
            {
                id: 2,
                name: 'Mark Dela Peña',
                email: 'markdp@example.com',
                course: 'Intermediate FSL',
                progress: 45,
                status: 'Pending'
            },
            {
                id: 3,
                name: 'Sophia Reyes',
                email: 'sophia.r@example.com',
                course: 'Advanced FSL',
                progress: 70,
                status: 'Active'
            }
        ];
    }

    // Save students to localStorage (placeholder for API call)
    saveStudents() {
        localStorage.setItem('signifi_students', JSON.stringify(this.students));
        // TODO: Replace with API call
        // return fetch('/api/students', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(this.students)
        // });
    }

    // Get next available ID
    getNextId() {
        return this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
    }

    // CREATE - Add new student
    createStudent(studentData) {
        const newStudent = {
            id: this.nextId++,
            name: studentData.name,
            email: studentData.email,
            course: studentData.course,
            progress: parseInt(studentData.progress) || 0,
            status: studentData.status || 'Active'
        };

        this.students.push(newStudent);
        this.saveStudents();
        this.renderStudentsTable();
        
        // TODO: Replace with API call
        // return fetch('/api/students', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(newStudent)
        // });
    }

    // READ - Get all students
    getAllStudents() {
        // TODO: Replace with API call
        // return fetch('/api/students').then(res => res.json());
        return this.students;
    }

    // READ - Get student by ID
    getStudentById(id) {
        // TODO: Replace with API call
        // return fetch(`/api/students/${id}`).then(res => res.json());
        return this.students.find(student => student.id === parseInt(id));
    }

    // UPDATE - Update existing student
    updateStudent(id, updatedData) {
        const index = this.students.findIndex(student => student.id === parseInt(id));
        if (index !== -1) {
            this.students[index] = {
                ...this.students[index],
                name: updatedData.name,
                email: updatedData.email,
                course: updatedData.course,
                progress: parseInt(updatedData.progress),
                status: updatedData.status
            };
            this.saveStudents();
            this.renderStudentsTable();
        }

        // TODO: Replace with API call
        // return fetch(`/api/students/${id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(updatedData)
        // });
    }

    // DELETE - Delete student
    deleteStudent(id) {
        this.students = this.students.filter(student => student.id !== parseInt(id));
        this.saveStudents();
        this.renderStudentsTable();

        // TODO: Replace with API call
        // return fetch(`/api/students/${id}`, { method: 'DELETE' });
    }

    // Render students table
    renderStudentsTable() {
        const tableBody = document.querySelector('#studentsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        this.students.forEach(student => {
            const row = this.createStudentRow(student);
            tableBody.appendChild(row);
        });
    }

    // Create table row for student
    createStudentRow(student) {
        const row = document.createElement('tr');
        row.className = 'border-t hover:bg-gray-50';

        const statusClass = student.status === 'Active' ? 'bg-green-100 text-green-600' : 
                           student.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 
                           'bg-red-100 text-red-600';

        const progressColor = student.progress >= 70 ? 'bg-green-500' : 
                             student.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500';

        row.innerHTML = `
            <td class="px-4 py-3">${student.name}</td>
            <td class="px-4 py-3">${student.email}</td>
            <td class="px-4 py-3">${student.course}</td>
            <td class="px-4 py-3">
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="${progressColor} h-2 rounded-full" style="width: ${student.progress}%"></div>
                </div>
                <span class="text-xs text-gray-500 mt-1">${student.progress}%</span>
            </td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs ${statusClass} rounded-full">${student.status}</span>
            </td>
            <td class="px-4 py-3">
                <div class="flex space-x-2">
                    <button onclick="studentsManager.editStudent(${student.id})" 
                            class="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                        Edit
                    </button>
                    <button onclick="studentsManager.confirmDelete(${student.id})" 
                            class="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200">
                        Delete
                    </button>
                </div>
            </td>
        `;

        return row;
    }

    // Setup event listeners
    setupEventListeners() {
        // Add student button
        const addButton = document.getElementById('addStudentBtn');
        if (addButton) {
            addButton.addEventListener('click', () => this.openModal());
        }

        // Form submission
        const form = document.getElementById('studentForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => this.handleStatusFilter(e.target.value));
        }
    }

    // Setup modal functionality
    setupModal() {
        const modal = document.getElementById('studentModal');
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
    openModal(student = null) {
        const modal = document.getElementById('studentModal');
        const form = document.getElementById('studentForm');
        const title = document.getElementById('modalTitle');

        if (!modal || !form) return;

        this.currentStudentId = student ? student.id : null;

        if (student) {
            title.textContent = 'Edit Student';
            form.name.value = student.name;
            form.email.value = student.email;
            form.course.value = student.course;
            form.progress.value = student.progress;
            form.status.value = student.status;
        } else {
            title.textContent = 'Add New Student';
            form.reset();
        }

        modal.classList.remove('hidden');
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('studentModal');
        if (modal) {
            modal.classList.add('hidden');
            this.currentStudentId = null;
        }
    }

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const studentData = {
            name: formData.get('name'),
            email: formData.get('email'),
            course: formData.get('course'),
            progress: formData.get('progress'),
            status: formData.get('status')
        };

        if (this.currentStudentId) {
            this.updateStudent(this.currentStudentId, studentData);
        } else {
            this.createStudent(studentData);
        }

        this.closeModal();
    }

    // Edit student
    editStudent(id) {
        const student = this.getStudentById(id);
        if (student) {
            this.openModal(student);
        }
    }

    // Confirm delete
    confirmDelete(id) {
        const student = this.getStudentById(id);
        if (student && confirm(`Are you sure you want to delete ${student.name}?`)) {
            this.deleteStudent(id);
        }
    }

    // Handle search
    handleSearch(query) {
        const filteredStudents = this.students.filter(student => 
            student.name.toLowerCase().includes(query.toLowerCase()) ||
            student.email.toLowerCase().includes(query.toLowerCase()) ||
            student.course.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFilteredStudents(filteredStudents);
    }

    // Handle status filter
    handleStatusFilter(status) {
        const filteredStudents = status === 'all' ? 
            this.students : 
            this.students.filter(student => student.status === status);
        this.renderFilteredStudents(filteredStudents);
    }

    // Render filtered students
    renderFilteredStudents(students) {
        const tableBody = document.querySelector('#studentsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        students.forEach(student => {
            const row = this.createStudentRow(student);
            tableBody.appendChild(row);
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.studentsManager = new StudentsManager();
});

// Logout functionality
document.getElementById('logoutButton')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        // TODO: Implement proper logout with backend
        localStorage.removeItem('signifi_user_session');
        window.location.href = '../login.html';
    }
});