document.addEventListener("DOMContentLoaded", () => {
    loadLearnerHome();
  });
  
  function loadLearnerHome() {
    // Simulate learner profile (replace with real data later)
    const learnerName = "Alex"; // e.g., from API or session
    document.getElementById("learner-name").textContent = learnerName;
  
    // Load progress stats (mock data)
    const enrolledCount = localStorage.getItem("enrolledCount") || 3;
    const achievements = localStorage.getItem("achievementsCount") || 5;
    const hours = localStorage.getItem("hoursLearned") || 12;
  
    document.getElementById("enrolled-count").textContent = enrolledCount;
    document.getElementById("achievements-count").textContent = achievements;
    document.getElementById("hours-count").textContent = hours;
  
    // Recommended courses (mock data)
    const recommended = [
      { title: "Basic Filipino Sign Language", level: "Beginner", desc: "Start your journey with FSL basics." },
      { title: "Everyday Conversations in FSL", level: "Intermediate", desc: "Learn practical phrases for daily use." },
      { title: "Advanced Hand Expressions", level: "Advanced", desc: "Master expressive signing and gestures." }
    ];
  
    const container = document.getElementById("recommended-courses");
    container.innerHTML = ""; // Clear first
  
    recommended.forEach(course => {
      const card = document.createElement("div");
      card.className =
        "bg-white shadow rounded-xl p-6 hover:shadow-lg transition cursor-pointer";
      card.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-800">${course.title}</h3>
        <p class="text-gray-500 text-sm mt-2">${course.desc}</p>
        <div class="flex justify-between items-center mt-4">
          <span class="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">${course.level}</span>
          <a href="./courses.html" class="text-blue-600 text-sm hover:underline">View</a>
        </div>
      `;
      container.appendChild(card);
    });
  }
  