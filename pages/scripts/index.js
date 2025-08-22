document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
  
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        //test users for now
        if (email === "user123" && password === "password123") {
          window.location.href = "./pages/home.html";
        } else {
          alert("Invalid email or password. Try user123 / password123.");
        }
      });
    }
  });
  