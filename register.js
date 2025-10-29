const backendURL = "https://shakes-zone-backend.onrender.com"; // Replace if different

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    try {
      const res = await fetch(`${backendURL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Account created successfully! Redirecting to login...");
      window.location.href = "login.html";
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error — check backend server.");
    }
  });
});
