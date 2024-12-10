const socket = io();
const usernameInput = document.getElementById("username");
const joinBtn = document.getElementById("join-btn");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const emojiBtn = document.getElementById("emoji-btn");
const emojiPicker = document.getElementById("emoji-picker");
const emojiButtons = document.querySelectorAll(".emoji");
const usersList = document.getElementById("users-list");

let username = "";

joinBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (username) {
    socket.emit("joinChat", username);
    document.getElementById("username-section").style.display = "none";
    document.getElementById("chat-section").style.display = "block";
  }
});

sendBtn.addEventListener("click", () => {
  const message = chatInput.value.trim();
  if (message) {
    socket.emit("chatMessage", message);
    chatInput.value = "";
  }
});

emojiBtn.addEventListener("click", () => {
  emojiPicker.classList.toggle("hidden");
});

emojiButtons.forEach(button => {
  button.addEventListener("click", () => {
    chatInput.value += button.dataset.emoji;
    emojiPicker.classList.add("hidden");
  });
});

socket.on("chatMessage", (data) => {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = `${data.username}: ${data.message}`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("updateUsers", (users) => {
  usersList.innerHTML = "";
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user;
    li.addEventListener("click", () => {
      const message = prompt(`Send a private message to ${user}`);
      if (message) {
        socket.emit("privateMessage", { recipient: user, message });
      }
    });
    usersList.appendChild(li);
  });
});

socket.on("privateMessage", (data) => {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = `Private from ${data.username}: ${data.message}`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});
