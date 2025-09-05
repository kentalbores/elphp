document.addEventListener("DOMContentLoaded", () => {
    // Shared dummy course storage
    let courses = JSON.parse(localStorage.getItem("courses")) || [];
  
    // === Educator Page ===
    const courseForm = document.getElementById("courseForm");
    const courseList = document.getElementById("courseList");
  
    if (courseForm && courseList) {
      courseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("courseTitle").value.trim();
        const desc = document.getElementById("courseDesc").value.trim();
  
        if (title && desc) {
          courses.push({ title, desc });
          localStorage.setItem("courses", JSON.stringify(courses));
          renderCourses(courseList, courses, true);
          courseForm.reset();
        }
      });
  
      renderCourses(courseList, courses, true);
    }
  
    // === Learner Page ===
    const availableCourses = document.getElementById("availableCourses");
    if (availableCourses) {
      renderCourses(availableCourses, courses, false);
    }
  });
  
  // Reusable rendering function
  function renderCourses(container, courses, isEducator) {
    container.innerHTML = "";
    courses.forEach((course, index) => {
      const li = document.createElement("li");
      li.className = "bg-white shadow p-4 rounded-lg flex justify-between items-center";
  
      li.innerHTML = `
        <div>
          <h4 class="font-bold text-gray-800">${course.title}</h4>
          <p class="text-gray-600">${course.desc}</p>
        </div>
        ${isEducator
          ? `<button onclick="deleteCourse(${index})" class="text-red-500 hover:underline">Delete</button>`
          : `<button class="bg-blue-600 text-white px-3 py-1 rounded">Enroll</button>`
        }
      `;
      container.appendChild(li);
    });
  }
  
  // Delete course (educator only)
  function deleteCourse(index) {
    let courses = JSON.parse(localStorage.getItem("courses")) || [];
    courses.splice(index, 1);
    localStorage.setItem("courses", JSON.stringify(courses));
  
    const courseList = document.getElementById("courseList");
    if (courseList) renderCourses(courseList, courses, true);
  }
  