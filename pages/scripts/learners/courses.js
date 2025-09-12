document.addEventListener("DOMContentLoaded", () => {
  loadCourses();
  initializeFiltering();
  initializeSearch();
  initializeSorting();
});

function loadCourses() {
  const courses = [
    {
      id: 1,
      title: "FSL Basics: Alphabet & Numbers",
      desc: "Learn the Filipino Sign Language alphabet and basic numbers for everyday communication.",
      level: "beginner",
      enrolled: 210
    },
    {
      id: 2,
      title: "Greetings & Introductions",
      desc: "Master simple greetings, introducing yourself, and polite expressions in FSL.",
      level: "beginner",
      enrolled: 185
    },
    {
      id: 3,
      title: "Colors & Shapes",
      desc: "Recognize and sign different colors, shapes, and descriptive vocabulary.",
      level: "beginner",
      enrolled: 142
    },
    {
      id: 4,
      title: "Family & Relationships",
      desc: "Learn signs for family members, relationships, and describing people.",
      level: "intermediate",
      enrolled: 120
    },
    {
      id: 5,
      title: "Daily Conversations",
      desc: "Practice useful phrases and sentences for casual conversations.",
      level: "intermediate",
      enrolled: 98
    },
    {
      id: 6,
      title: "Emotions & Feelings",
      desc: "Express emotions and feelings using proper FSL signs.",
      level: "intermediate",
      enrolled: 76
    },
    {
      id: 7,
      title: "FSL Grammar & Sentence Structure",
      desc: "Deep dive into grammar rules, sentence structure, and time indicators.",
      level: "advanced",
      enrolled: 55
    },
    {
      id: 8,
      title: "Storytelling in FSL",
      desc: "Develop your skills in narrating stories and events using clear signing.",
      level: "advanced",
      enrolled: 48
    },
    {
      id: 9,
      title: "Conversations for Work",
      desc: "Learn workplace vocabulary, etiquette, and professional signing skills.",
      level: "advanced",
      enrolled: 35
    }
  ];

  renderCourses(courses);
}


function renderCourses(courses) {
  const container = document.getElementById("all-courses");
  container.innerHTML = "";

  courses.forEach(c => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow p-5 hover:shadow-lg transition";
    card.dataset.level = c.level;

    card.innerHTML = `
      <h3 class="text-lg font-semibold">${c.title}</h3>
      <p class="text-gray-600 text-sm mt-1">${c.desc}</p>
      <p class="text-sm text-gray-400 mt-2">👥 ${c.enrolled} enrolled</p>
      <div class="mt-4 flex justify-between items-center">
        <span class="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">${c.level}</span>
        <button class="enroll-btn px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Enroll</button>
      </div>
    `;
    container.appendChild(card);
  });

  document.getElementById("course-count").textContent = `All Courses (${courses.length})`;
}

// Filtering, search, sort
function initializeFiltering() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn =>
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("bg-blue-600", "text-white"));
      buttons.forEach(b => b.classList.add("bg-blue-100", "text-blue-600"));
      btn.classList.add("bg-blue-600", "text-white");
      filterCourses(btn.dataset.filter);
    })
  );
}

function filterCourses(level) {
  const cards = document.querySelectorAll("#all-courses > div");
  cards.forEach(card => {
    card.style.display = (level === "all" || card.dataset.level === level) ? "" : "none";
  });
}

function initializeSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    document.querySelectorAll("#all-courses > div").forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? "" : "none";
    });
  });
}

function initializeSorting() {
  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", () => {
    const option = sortSelect.value;
    const cards = Array.from(document.querySelectorAll("#all-courses > div"));
    cards.sort((a, b) => {
      if (option === "name")
        return a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent);
      if (option === "enrolled")
        return parseInt(b.querySelector("p").textContent) - parseInt(a.querySelector("p").textContent);
      return 0; // rating can be added later
    });
    const container = document.getElementById("all-courses");
    cards.forEach(c => container.appendChild(c));
  });
}
