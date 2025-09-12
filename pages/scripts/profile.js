// profile.js

let profile = {
    username: "Angela",
    fullName: "Angela Cruz",
    email: "angela@example.com",
    role: "Educator",
    location: "Quezon City, Philippines",
    joined: "Jan 15, 2025",
    badges: ["🏅 Top Educator", "🔥 Consistent", "⭐ 100+ Lessons Added"],
    progress: {
      intro: 90,
      intermediate: 45,
      advanced: 20
    },
    recentActivity: [
      { text: "✅ Posted lesson FSL Alphabet", time: "2 days ago" },
      { text: "⭐ Earned badge Consistent Educator", time: "1 week ago" },
      { text: "📌 Added Courses in Intermediate FSL", time: "2 weeks ago" },
      { text: "📖 Reviewed Basic Greetings", time: "3 weeks ago" }
    ]
  };
  
  // Save/load profile
  function saveProfile() {
    localStorage.setItem("profile", JSON.stringify(profile));
  }
  function loadProfile() {
    const stored = localStorage.getItem("profile");
    if (stored) profile = JSON.parse(stored);
  }
  
  // Render function with IDs
  function renderProfile() {
    document.getElementById("profileUsername").textContent = profile.username || "-";
    document.getElementById("profileRole").textContent = profile.role || "-";
    document.getElementById("profileEmail").textContent = "📧 " + (profile.email || "-");
    document.getElementById("profileLocation").textContent = "📍 " + (profile.location || "-");
  
    document.getElementById("profileFullName").textContent = profile.fullName || "-";
    document.getElementById("profileInfoEmail").textContent = profile.email || "-";
    document.getElementById("profileJoined").textContent = profile.joined || "-";
    document.getElementById("profileInfoRole").textContent = profile.role || "-";
  
    // Render badges
    const badgesContainer = document.getElementById("profileBadges");
    badgesContainer.innerHTML = "";
    profile.badges.forEach(b => {
      const span = document.createElement("span");
      span.className = "px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full";
      span.textContent = b;
      badgesContainer.appendChild(span);
    });
  
    // Render progress
    const progressContainer = document.getElementById("profileProgress");
    progressContainer.innerHTML = "";
    Object.entries(profile.progress).forEach(([course, percent]) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="flex justify-between mb-1">
          <span class="text-sm font-medium">${course}</span>
          <span class="text-sm text-gray-500">${percent}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="h-2 rounded-full ${percent >= 70 ? "bg-green-500" : percent >= 40 ? "bg-yellow-500" : "bg-red-500"}" style="width:${percent}%"></div>
        </div>
      `;
      progressContainer.appendChild(li);
    });
  
    // Render activity
    const activityContainer = document.getElementById("profileActivity");
    activityContainer.innerHTML = "";
    profile.recentActivity.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.text} (${item.time})`;
      activityContainer.appendChild(li);
    });
  }
  
  // Edit Modal
  function setupEditModal() {
    const modal = document.getElementById("editModal");
    const form = document.getElementById("editProfileForm");
  
    document.getElementById("editProfileBtn").addEventListener("click", () => {
      document.getElementById("editFullName").value = profile.fullName;
      document.getElementById("editEmail").value = profile.email;
      document.getElementById("editRole").value = profile.role;
      modal.classList.remove("hidden");
    });
  
    document.getElementById("cancelEdit").addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  
    form.addEventListener("submit", e => {
      e.preventDefault();
      profile.fullName = document.getElementById("editFullName").value;
      profile.email = document.getElementById("editEmail").value;
      profile.role = document.getElementById("editRole").value;
      saveProfile();
      renderProfile();
      modal.classList.add("hidden");
    });
  }
  
  // Init
  document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    renderProfile();
    setupEditModal();
  });
  