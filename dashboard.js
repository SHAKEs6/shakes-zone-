// Connect to the backend socket
const socket = io("http://localhost:5000");

// Simulate logged-in user (replace with real auth later)
const username = localStorage.getItem("username") || prompt("Enter your username:");
localStorage.setItem("username", username);

// Register user on connection
socket.emit("registerUser", username);

// Update online friends list
const onlineUsersList = document.getElementById("online-users");

socket.on("updateOnlineUsers", (users) => {
  onlineUsersList.innerHTML = "";
  users.forEach((user) => {
    if (user !== username) {
      const li = document.createElement("li");
      li.textContent = user;
      li.onclick = () => sendGameRequest(user);
      onlineUsersList.appendChild(li);
    }
  });
});

// Handle incoming game requests
socket.on("receiveGameRequest", ({ from, game }) => {
  alert(`${from} invited you to play ${game}!`);
});

function sendGameRequest(friend) {
  const game = prompt(`Which game do you want to invite ${friend} to? (efootball, pubg, cod)`);
  if (game) {
    socket.emit("sendGameRequest", { to: friend, from: username, game });
    alert(`Game request sent to ${friend} for ${game}`);
  }
}

// Navigate to game pages
function goToGames(game) {
  window.location.href = `games/${game}.html`;
}

// Logout
function logout() {
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

