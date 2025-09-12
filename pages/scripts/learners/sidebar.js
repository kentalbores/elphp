window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("sidebar-learner.html");
    if (!res.ok) throw new Error(`Failed to fetch sidebar-learner.html: ${res.status}`);

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const remoteTemplate = doc.querySelector("template#card-template");
    if (!remoteTemplate) {
      console.error("No <template id='card-template'> found in sidebar-learner.html");
      return;
    }

    // Append sidebar markup
    const importedTemplate = document.importNode(remoteTemplate, true);
    const container = document.getElementById("container");
    container.appendChild(importedTemplate.content.cloneNode(true));

    // Manage active link highlighting
    const links = container.querySelectorAll("nav a");
    const normalize = href => (href ? href.split("/").pop().replace(/^\.\//, "") : "");

    function setActive(activeLink) {
      links.forEach(l => {
        l.classList.remove("bg-blue-700", "hover:bg-blue-800");
        if (!l.classList.contains("hover:bg-blue-700")) {
          l.classList.add("hover:bg-blue-700");
        }
      });

      if (!activeLink) return;
      activeLink.classList.remove("hover:bg-blue-700");
      activeLink.classList.add("bg-blue-700", "hover:bg-blue-800");
    }

    links.forEach(link => {
      link.addEventListener("click", e => {
        setActive(e.currentTarget);
      });
    });

    const currentPage = location.pathname.split("/").pop() || "index.html";
    let matched = false;
    links.forEach(link => {
      if (normalize(link.getAttribute("href")) === currentPage) {
        setActive(link);
        matched = true;
      }
    });

    if (!matched) {
      links.forEach(link => {
        try {
          if (link.href === location.href || link.href === location.origin + location.pathname) {
            setActive(link);
          }
        } catch {}
      });
    }
  } catch (err) {
    console.error("Error loading learner sidebar:", err);
  }
});
