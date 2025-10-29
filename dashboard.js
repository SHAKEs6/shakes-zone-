/* ===============================
   Shakes Zone Dashboard Script
   =============================== */

// 👇 REPLACE this URL with your actual Render backend URL
const BACKEND_URL = "https://shakes-zone.onrender.com";

// Connect to backend using Socket.IO
const socket = io(BACKEND_URL);

// Get username from localStorage or prompt
let username = localStorage.getItem("loggedUser");
if (!username) {
  username = prompt("Enter your gamer name:") || `Guest${Math.floor(Math.random() * 1000)}`;
  localStorage.setItem("loggedUser", username);
}

// When connected to server
socket.on("connect", () => {
  console.log("✅ Connected to backend via socket:", socket.id);
  socket.emit("registerUser", username);
});

// Update online user list
socket.on("updateOnlineUsers", (users) => {
  const list = document.getElementById("online-users");
  if (!list) return;
  list.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user;
    li.className = user === username ? "self-user" : "online-user";

    if (user !== username) {
      li.addEventListener("click", () => sendGameRequest(user));
    }

    list.appendChild(li);
  });
});

// Receive a game request
socket.on("receiveGameRequest", ({ from, game }) => {
  const accept = confirm(`${from} invited you to play ${game}. Accept?`);
  if (accept) {
    alert(`Launching ${game}... 🎮`);
    window.location.href = `games/${game}.html`;
  } else {
    alert(`You declined ${from}'s invitation.`);
  }
});

// Send a game request to another user
function sendGameRequest(targetUser) {
  const game = prompt(`Which game do you want to invite ${targetUser} to? (efootball, pubg, cod)`);
  if (!game) return;
  socket.emit("sendGameRequest", { to: targetUser, from: username, game });
  alert(`Invite sent to ${targetUser} for ${game}.`);
}

// Go to game pages
function goToGames(game) {
  window.location.href = `games/${game}.html`;
}

// Logout function
function logout() {
  localStorage.removeItem("loggedUser");
  socket.disconnect();
  window.location.href = "login.html";
}
