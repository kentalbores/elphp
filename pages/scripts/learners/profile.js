document.addEventListener("DOMContentLoaded", () => {
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
      const updated = {
        name: document.getElementById("edit-name").value.trim(),
        email: document.getElementById("edit-email").value.trim(),
        avatar: document.getElementById("edit-avatar").value.trim() || "https://via.placeholder.com/150",
        coursesCompleted: getProfileData().coursesCompleted || 0,
        level: getProfileData().level || "Beginner"
      };
      localStorage.setItem("signifi_profile", JSON.stringify(updated));
      modal.classList.add("hidden");
      loadProfile();
    });
  });
  
  function getProfileData() {
    return JSON.parse(localStorage.getItem("signifi_profile")) || {
      name: "Learner Name",
      email: "email@example.com",
      avatar: "https://via.placeholder.com/150",
      coursesCompleted: 0,
      level: "Beginner"
    };
  }
  
  function loadProfile() {
    const data = getProfileData();
    document.getElementById("profile-name").textContent = data.name;
    document.getElementById("profile-email").textContent = data.email;
    document.getElementById("profile-avatar").src = data.avatar;
    document.getElementById("courses-completed").textContent = data.coursesCompleted;
    document.getElementById("current-level").textContent = data.level;
  }
  