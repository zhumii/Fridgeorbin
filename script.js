let playerName = "";
let progress = 0;
let interval;

// Ambil elemen
let bar = document.getElementById("loading-bar");
let text = document.getElementById("loading-text");
let loadingScreen = document.getElementById("loading-screen");
let nameScreen = document.getElementById("name-screen");
let gameContainer = document.getElementById("game-container");
let welcomeText = document.getElementById("welcome-text");
let leaderboard = document.getElementById("leaderboard");

let currentIndex = 0;
let score = 0;
let lives = 3;

// ---------------------
// Loading Screen
function startLoading() {
  playerName = document.getElementById("playerName").value;
  if (!playerName) {
    alert("Masukkan nama dulu ya!");
    return;
  }

  // sembunyikan name screen, tampilkan loading
  nameScreen.classList.add("hidden");
  loadingScreen.classList.remove("hidden");
  welcomeText.textContent = "Halo, " + playerName + "! Sedang menyiapkan game...";

  progress = 0;
  interval = setInterval(() => {
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add("hidden");
        gameContainer.classList.remove("hidden");
        startGame();
      }, 500);
    } else {
      progress++;
      bar.style.width = progress + "%";
      text.textContent = progress + "%";
    }
  }, 40);
}

// ---------------------
// Data Game (pakai tanggal Exp)
let foods = [
  { img: "assets/food/apel.png", exp: "2025-08-25" },
  { img: "assets/food/brokoli.png", exp: "2025-09-01" },
  { img: "assets/food/daging1.png", exp: "2025-08-19" },
  { img: "assets/food/daging2.png", exp: "2025-08-25" },
  { img: "assets/food/keju.png", exp: "2025-09-01" },
  { img: "assets/food/mi.png", exp: "2025-08-19" },
  { img: "assets/food/pisang.png", exp: "2025-08-25" },
  { img: "assets/food/stroberi.png", exp: "2025-09-01" },
  { img: "assets/food/tahu.png", exp: "2025-08-19" },
  { img: "assets/food/tomat.png", exp: "2025-08-25" },
  { img: "assets/food/kaleng.png", exp: "2025-10-15" },
  { img: "assets/food/burger.png", exp: "2025-11-10" },
  { img: "assets/food/pasta.png", exp: "2025-07-24" },

  // rotten food
  { img: "assets/food_rotten/apel-basi.png", exp: "2023-08-25" },
  { img: "assets/food_rotten/brokoli-basi.png", exp: "2023-09-01" },
  { img: "assets/food_rotten/daging1-basi.png", exp: "2023-08-19" },
  { img: "assets/food_rotten/daging2-basi.png", exp: "2023-08-25" },
  { img: "assets/food_rotten/keju-basi.png", exp: "2023-09-01" },
  { img: "assets/food_rotten/mi-basi.png", exp: "2023-08-19" },
  { img: "assets/food_rotten/pisang-basi.png", exp: "2023-08-25" },
  { img: "assets/food_rotten/stroberi-basi.png", exp: "2023-09-01" },
  { img: "assets/food_rotten/tahu-basi.png", exp: "2023-08-19" },
  { img: "assets/food_rotten/tomat-basi.png", exp: "2023-08-25" },
  { img: "assets/food_rotten/kaleng-basi.png", exp: "2023-10-15" },
  { img: "assets/food_rotten/burger-basi.png", exp: "2023-11-10" },
  { img: "assets/food_rotten/pasta-basi.png", exp: "2023-07-24" },
];

// ---------------------
// Game Logic
function shuffleFoods() {
  for (let i = foods.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [foods[i], foods[j]] = [foods[j], foods[i]];
  }
}

function startGame() {
  shuffleFoods();
  currentIndex = 0;
  score = 0;
  lives = 3;
  document.getElementById("score").textContent = "Score: " + score;
  document.getElementById("lives").textContent = "Lives: " + lives;
  showFood();
}

function showFood() {
  let food = foods[currentIndex];
  document.getElementById("foodImage").src = food.img;
  document.getElementById("foodInfo").textContent = "Exp: " + food.exp;
}

function checkAnswer(answer) {
  let food = foods[currentIndex];

  // tanggal hari ini
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  // tanggal expired
  let expDate = new Date(food.exp);

  // validasi: true = layak, false = tidak layak
  let valid = expDate >= today;

  if (answer === valid) {
    score += 10;
  } else {
    lives--;
  }

  document.getElementById("score").textContent = "Score: " + score;
  document.getElementById("lives").textContent = "Lives: " + lives;

  currentIndex++;
  if (lives > 0) {
    if (currentIndex >= foods.length) {
      shuffleFoods();
      currentIndex = 0;
    }
    showFood();
  } else {
    endGame();
  }
}

// ---------------------
// Leaderboard
function endGame() {
  alert("Game Over! Skor kamu: " + score);

  saveScore(playerName, score);

  // sembunyikan game
  gameContainer.classList.add("hidden");

  // tampilkan leaderboard
  showRanking();
}

function saveScore(name, score) {
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  scores.push({ name: name, score: score });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(scores));
}

function showRanking() {
  leaderboard.classList.remove("hidden");
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  let rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "";

  scores.forEach((entry, index) => {
    let li = document.createElement("li");
    li.textContent = (index + 1) + ". " + entry.name + " - " + entry.score;
    rankingList.appendChild(li);
  });
}

function restartGame() {
  leaderboard.classList.add("hidden");
  nameScreen.classList.remove("hidden");
}


