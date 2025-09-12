window.addEventListener("DOMContentLoaded", async () => {
    try {
      const res = await fetch("sidebar.html");
      if (!res.ok) throw new Error(`Failed to fetch sidebar.html: ${res.status}`);
  
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const remoteTemplate = doc.querySelector("template#card-template");
      if (!remoteTemplate) {
        console.error("No <template id='card-template'> found in sidebar.html");
        return;
      }
  
      // import and append the sidebar markup
      const importedTemplate = document.importNode(remoteTemplate, true);
      const container = document.getElementById("container");
      container.appendChild(importedTemplate.content.cloneNode(true));
  
      // grab links and helper functions
      const links = container.querySelectorAll("nav a");
  
      const normalize = href => {
        if (!href) return "";
        return href.split("/").pop().replace(/^\.\//, "");
      };
  
      function setActive(activeLink) {
        links.forEach(l => {
          // clear active classes
          l.classList.remove("bg-blue-700", "hover:bg-blue-800");
          // ensure default hover for inactive
          if (!l.classList.contains("hover:bg-blue-700")) {
            l.classList.add("hover:bg-blue-700");
          }
        });
  
        if (!activeLink) return;
  
        // make clicked/current link visually active and slightly change its hover
        activeLink.classList.remove("hover:bg-blue-700");
        activeLink.classList.add("bg-blue-700", "hover:bg-blue-800");
      }
  
      // click handler: set active immediately (navigation still happens)
      links.forEach(link => {
        link.addEventListener("click", e => {
          setActive(e.currentTarget);
          // don't prevent navigation — the new page should re-run this loader
        });
      });
  
      // auto-highlight based on current path (works with ./foo.html, /path/foo.html, etc.)
      const currentPage = (location.pathname.split("/").pop() || "index.html");
      let matched = false;
      links.forEach(link => {
        if (normalize(link.getAttribute("href")) === currentPage) {
          setActive(link);
          matched = true;
        }
      });
  
      // fallback comparison using full urls if the simple check didn't match
      if (!matched) {
        links.forEach(link => {
          try {
            if (link.href === location.href || link.href === location.origin + location.pathname) {
              setActive(link);
            }
          } catch (e) { /* ignore */ }
        });
      }
    } catch (err) {
      console.error("Error loading sidebar:", err);
    }
  });
  