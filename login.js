// login.js — connects to your Render backend

const backendURL = "https://shakes-zone-backend.onrender.com"; // 🔥 Replace with your real backend Render URL

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    try {
      const res = await fetch(`${backendURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Store token for future use
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      alert("Login successful!");
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error — check backend server.");
    }
  });
});
