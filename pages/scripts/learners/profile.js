document.addEventListener("DOMContentLoaded", () => {
  initMockProfile(); // <-- inject fake data if none exists
  loadProfile();

  const editBtn = document.getElementById("edit-profile-btn");
  const modal = document.getElementById("edit-profile-modal");
  const cancelBtn = document.getElementById("cancel-edit");
  const form = document.getElementById("edit-profile-form");

  editBtn.addEventListener("click", () => {
    const data = getProfileData();
    document.getElementById("edit-name").value = data.name;
    document.getElementById("edit-email").value = data.email;
    document.getElementById("edit-avatar").value = data.avatar;
    modal.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const current = getProfileData();
    const updated = {
      ...current,
      name: document.getElementById("edit-name").value.trim(),
      email: document.getElementById("edit-email").value.trim(),
      avatar: document.getElementById("edit-avatar").value.trim() || "https://via.placeholder.com/150"
    };
    localStorage.setItem("signifi_profile", JSON.stringify(updated));
    modal.classList.add("hidden");
    loadProfile();
  });
});

function getProfileData() {
  return JSON.parse(localStorage.getItem("signifi_profile")) || {};
}

// Mock data for first-time visitors
function initMockProfile() {
  if (!localStorage.getItem("signifi_profile")) {
    const mock = {
      name: "Alex Cruz",
      email: "alex.cruz@example.com",
      avatar: "https://i.pravatar.cc/150?img=32",
      coursesCompleted: 6,
      level: "Intermediate",
      achievements: [
        { title: "Quick Starter", icon: "fa-bolt", desc: "Completed first lesson" },
        { title: "Consistent Learner", icon: "fa-calendar-check", desc: "1 week streak" },
        { title: "Halfway There", icon: "fa-flag-checkered", desc: "50% of Beginner course" }
      ]
    };
    localStorage.setItem("signifi_profile", JSON.stringify(mock));
  }
}

function loadProfile() {
  const data = getProfileData();

  document.getElementById("profile-name").textContent = data.name;
  document.getElementById("profile-email").textContent = data.email;
  document.getElementById("profile-avatar").src = data.avatar;
  document.getElementById("courses-completed").textContent = data.coursesCompleted ?? 0;
  document.getElementById("current-level").textContent = data.level ?? "Beginner";

  // Progress bar width (max 10 for demo)
  const percent = Math.min((data.coursesCompleted ?? 0) * 10, 100);
  document.getElementById("progress-bar").style.width = `${percent}%`;

  // Achievements grid
  const container = document.getElementById("achievements");
  container.innerHTML = "";
  (data.achievements || []).forEach(a => {
    const card = document.createElement("div");
    card.className = "flex items-center gap-3 bg-blue-50 p-3 rounded-lg";
    card.innerHTML = `
      <i class="fa ${a.icon} text-blue-600 text-xl"></i>
      <div>
        <p class="font-semibold text-gray-800">${a.title}</p>
        <p class="text-sm text-gray-600">${a.desc}</p>
      </div>`;
    container.appendChild(card);
  });
}
