document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      // Get user data from localStorage
      const storedUser = localStorage.getItem(email);

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser.password === password) {
          alert("Login successful!");
          window.location.href = "./pages/home.html";
        } else {
          alert("Incorrect password.");
        }
      } else {
        alert("User not found. Please create an account.");
      }
    });
  }
});