(function () {
  const container = document.getElementById("confetti-container");
  if (!container) return;

  const colors = ["#FFC107", "#FF5722", "#4CAF50", "#2196F3", "#9C27B0"];

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.animationDelay = Math.random() * 2 + "s";
    container.appendChild(confetti);
  }
})();

