document.addEventListener("DOMContentLoaded", () => {
    // Load preferences from localStorage
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const notifyEmail = document.getElementById("notify-email");
    const notifyPush = document.getElementById("notify-push");
    const languageSelect = document.getElementById("language-select");
  
    const prefs = JSON.parse(localStorage.getItem("signifi_settings")) || {
      darkMode: false,
      notifyEmail: true,
      notifyPush: true,
      language: "en"
    };
  
    // Initialize UI
    darkModeToggle.checked = prefs.darkMode;
    notifyEmail.checked = prefs.notifyEmail;
    notifyPush.checked = prefs.notifyPush;
    languageSelect.value = prefs.language;
    applyDarkMode(prefs.darkMode);
  
    // Event listeners
    darkModeToggle.addEventListener("change", (e) => {
      applyDarkMode(e.target.checked);
      saveSettings();
    });
  
    notifyEmail.addEventListener("change", saveSettings);
    notifyPush.addEventListener("change", saveSettings);
    languageSelect.addEventListener("change", saveSettings);
  
    function saveSettings() {
      const settings = {
        darkMode: darkModeToggle.checked,
        notifyEmail: notifyEmail.checked,
        notifyPush: notifyPush.checked,
        language: languageSelect.value
      };
      localStorage.setItem("signifi_settings", JSON.stringify(settings));
    }
  
    function applyDarkMode(enabled) {
      if (enabled) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("bg-gray-900", "text-gray-100");
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("bg-gray-900", "text-gray-100");
      }
    }
  
    // Logout button
    document.getElementById("logout-btn").addEventListener("click", () => {
      alert("Logging out...");
      // Here you can redirect to login page or clear session
      // window.location.href = "./login.html";
    });
  });
  