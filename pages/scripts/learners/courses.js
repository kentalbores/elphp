document.addEventListener("DOMContentLoaded", () => {
    initializeCourseFiltering();
    initializeCourseInteractions();
    initializeCreateCourse();
    loadMyCourses(); // <-- Load saved courses on page load
  });
  
  const STORAGE_KEY = "signifi_my_courses";
  
  // --- Create Course ---
  function initializeCreateCourse() {
    const btn = document.getElementById("create-course-btn");
    const modal = document.getElementById("create-course-modal");
    const cancel = document.getElementById("cancel-create");
    const form = document.getElementById("create-course-form");
  
    btn.addEventListener("click", () => modal.classList.remove("hidden"));
    cancel.addEventListener("click", () => modal.classList.add("hidden"));
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("new-title").value.trim();
      const desc = document.getElementById("new-description").value.trim();
      const level = document.getElementById("new-level").value;
  
      if (!title || !desc) return;
  
      const course = {
        id: Date.now(),
        title,
        desc,
        level,
        enrolled: 0,
      };
  
      addCourseCard(course);
      saveCourse(course);
  
      modal.classList.add("hidden");
      form.reset();
    });
  }
  
  // --- Render a course card ---
  function addCourseCard(course) {
    const card = document.createElement("div");
    card.className =
      "course-card bg-white shadow rounded-xl p-6 hover:shadow-lg transition cursor-pointer";
    card.dataset.level = course.level;
    card.dataset.id = course.id;
    card.innerHTML = `
        <h3 class="text-lg font-semibold">${course.title}</h3>
        <p class="text-gray-500 text-sm mt-2">${course.desc}</p>
        <p class="text-sm text-gray-400 mt-2" data-enrolled="${course.enrolled}">
          👥 ${course.enrolled} enrolled
        </p>
        <div class="flex items-center justify-between mt-4">
          <span class="inline-block px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
            ${course.level}
          </span>
          <button class="enroll-btn px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
            Enroll
          </button>
        </div>
      `;
  
    document.getElementById("my-courses").appendChild(card);
    initializeCourseInteractions(card);
  }
  
  // --- Save to localStorage ---
  function saveCourse(course) {
    const courses = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    courses.push(course);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }
  
  // --- Load from localStorage ---
  function loadMyCourses() {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    saved.forEach(addCourseCard);
  }
  