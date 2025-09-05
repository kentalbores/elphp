// settings.js

// Mock "database"
let settings = {
    emailNotifications: "enabled",
    passwordLastChanged: "Jan 1, 2025"
  };
  
  // Save/load from localStorage
  function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
  }
  function loadSettings() {
    const stored = localStorage.getItem("settings");
    if (stored) settings = JSON.parse(stored);
  }
  
  // CRUD API
  const SettingsAPI = {
    create(newSettings) {
      settings = { ...settings, ...newSettings };
      saveSettings();
      renderSettings();
    },
    read() {
      loadSettings();
      return settings;
    },
    update(field, value) {
      if (field in settings) {
        settings[field] = value;
        saveSettings();
        renderSettings();
        return true;
      }
      return false;
    },
    delete(field) {
      if (field in settings) {
        delete settings[field];
        saveSettings();
        renderSettings();
        return true;
      }
      return false;
    }
  };
  
  // Render current settings to UI
  function renderSettings() {
    document.getElementById("emailNotifications").value = settings.emailNotifications;
  }
  
  // Event bindings
  function setupEvents() {
    // Change email notifications
    document.getElementById("emailNotifications").addEventListener("change", (e) => {
      SettingsAPI.update("emailNotifications", e.target.value);
    });
  

    document.getElementById("savePasswordBtn").addEventListener("click", () => {
        const newPass = document.getElementById("newPassword").value.trim();
        const confirmPass = document.getElementById("confirmPassword").value.trim();
      
        if (!newPass || !confirmPass) {
          alert("Please fill in both fields.");
          return;
        }
        if (newPass !== confirmPass) {
          alert("Passwords do not match.");
          return;
        }
        let userSession = JSON.parse(localStorage.getItem("signifi_users"));

        if (userSession && userSession.email) {
            // Update the session object
            userSession.password = newPass;
            localStorage.setItem("signifi_users", JSON.stringify(userSession));

            // Update the registered user record (the "database")
            let storedUser = localStorage.getItem(userSession.email);
            if (storedUser) {
            let parsedUser = JSON.parse(storedUser);
            parsedUser.password = newPass;
            localStorage.setItem(userSession.email, JSON.stringify(parsedUser));
            }
        }
        SettingsAPI.update("passwordLastChanged", new Date().toLocaleDateString());
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";
        alert("Password updated successfully!");
      });
    // Reset settings
    document.getElementById("resetSettingsBtn").addEventListener("click", () => {
      localStorage.removeItem("settings");
      settings = { emailNotifications: "enabled", theme: "light", passwordLastChanged: "Jan 1, 2025" };
      renderSettings();
      alert("Settings reset to default.");
    });
  
  }
  
  // Init
  document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    renderSettings();
    setupEvents();
  });
  