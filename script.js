const questions = [
  {
    sentence: "Ég ætla ___ læra fyrir prófið.",
    answer: "að",
    explanation: "Hér kemur sögn á eftir: að læra. Þá er notað nafnháttarmerkið „að“."
  },
  {
    sentence: "Við ætlum ___ fara í sund á morgun.",
    answer: "að",
    explanation:"Sögnin 'ætla' er oft fylgt af 'að' í nafnhætti."
  },
  {
    sentence: "Við fórum ___ stað snemma um morguninn.",
    answer: "af",
    explanation: "Orðasambandið er „fara af stað“ — þá er notað „af“."
  },
  {
    sentence: "Mig langar ___ baka köku.",
    answer: "að",
    explanation: "Á eftir „langar“ kemur oft sögn í nafnhætti: að baka."
  },
  {
    sentence: "Hann datt ___ hjólinu sínu.",
    answer: "af",
    explanation: "Ef maður dettur niður frá einhverju er notað „af“: af hjólinu."
  },
  {
    sentence: "Það er gaman ___ syngja.",
    answer: "að",
    explanation: "Hér er sögnin „syngja“ í nafnhætti og þarf „að“ á undan."
  },
  {
    sentence: "Ég tók bókina ___ borðinu.",
    answer: "af",
    explanation: "Ef eitthvað er tekið frá yfirborði er notað „af“: af borðinu."
  },
  {
    sentence: "Kennarinn bað okkur ___ hlusta vel.",
    answer: "að",
    explanation: "Hér fylgir sögn: að hlusta. Þá er „að“ rétt."
  },
  {
    sentence: "Hún er stolt ___ verkefninu sínu.",
    answer: "af",
    explanation: "Maður er stoltur/stolt af einhverju. Hér er „af“ rétt."
  },
  {
    sentence: "Við ætlum ___ horfa á myndina.",
    answer: "að",
    explanation: "Sögnin „horfa“ er í nafnhætti: að horfa."
  },
  {
    sentence: "Ég fékk lánaðan penna ___ vini mínum.",
    answer: "af",
    explanation: "Þegar eitthvað kemur frá einhverjum er oft notað „af“: af vini mínum."
  },
  {
    sentence: "Það þarf ___ vanda sig.",
    answer: "að",
    explanation: "„Að vanda sig“ er nafnháttarsetning. Þá er „að“ rétt."
  }
];

let shuffledQuestions = [];
let currentQuestion = 0;
let lives = 3;
let timer = 60;
let timerInterval;
let paused = false;
let answered = false;

const bestTime = localStorage.getItem("adAfBestTime");
if (bestTime) {
  document.getElementById("highscore").innerText = bestTime;
  document.getElementById("menuHighscore").innerText = bestTime;
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startGame() {
  document.getElementById("titleScreen").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  restartGame();
}

function pauseGame() {
  paused = true;
  clearInterval(timerInterval);
  document.getElementById("pauseOverlay").style.display = "flex";
}

function resumeGame() {
  paused = false;
  document.getElementById("pauseOverlay").style.display = "none";
  startTimer();
}

function goToTitle() {
  clearInterval(timerInterval);
  document.getElementById("pauseOverlay").style.display = "none";
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("titleScreen").style.display = "flex";
}

function restartGame() {
  currentQuestion = 0;
  lives = 3;
  timer = 60;
  paused = false;
  answered = false;
  shuffledQuestions = shuffle(questions);

  document.getElementById("lives").innerText = lives;
  document.getElementById("timer").innerText = timer;
  document.getElementById("feedback").innerText = "";
  document.getElementById("explanation").innerText = "";

  loadQuestion();
  startTimer();
}

function loadQuestion() {
  answered = false;
  const q = shuffledQuestions[currentQuestion];

  document.getElementById("level").innerText = currentQuestion + 1;
  document.getElementById("sentence").innerHTML = q.sentence.replace("___", "<span class='blank'>___</span>");
  document.getElementById("feedback").innerText = "";
  document.getElementById("explanation").innerText = "";

  document.querySelectorAll(".choiceBtn").forEach(btn => {
    btn.disabled = false;
  });
}

function playSound(id) {
  const sound = document.getElementById(id);
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function checkAnswer(choice) {
  if (paused || answered) return;
  answered = true;

  document.querySelectorAll(".choiceBtn").forEach(btn => {
    btn.disabled = true;
  });

  const q = shuffledQuestions[currentQuestion];
  const gameBox = document.getElementById("game");

  if (choice === q.answer) {
    document.getElementById("feedback").innerText = "✅ Rétt!";
    document.getElementById("sentence").innerHTML = q.sentence.replace("___", `<span class='blank'>${q.answer}</span>`);
    gameBox.classList.add("correctFlash");
    playSound("correctSound");
  } else {
    lives--;
    document.getElementById("lives").innerText = lives;
    document.getElementById("feedback").innerText = `❌ Rangt — rétt svar er „${q.answer}“`;
    document.getElementById("sentence").innerHTML = q.sentence.replace("___", `<span class='blank'>${q.answer}</span>`);
    gameBox.classList.add("wrongFlash");
    playSound("wrongSound");
  }

  document.getElementById("explanation").innerText = q.explanation;

  setTimeout(() => {
    gameBox.classList.remove("correctFlash", "wrongFlash");

    if (lives <= 0) {
      gameOver("💀 Þú misstir öll lífin!");
      return;
    }

    currentQuestion++;

    if (currentQuestion < shuffledQuestions.length) {
      loadQuestion();
    } else {
      winGame();
    }
  }, 1500);
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (paused) return;
    timer--;
    document.getElementById("timer").innerText = timer;

    if (timer <= 0) {
      clearInterval(timerInterval);
      gameOver("💀 Tíminn rann út!");
    }
  }, 1000);
}

function gameOver(message) {
  clearInterval(timerInterval);
  document.getElementById("sentence").innerHTML = `<h2>${message}</h2>`;
  document.getElementById("choices").style.display = "none";
  document.getElementById("feedback").innerText = "Ýttu á Restart til að reyna aftur.";
  document.getElementById("explanation").innerText = "";
}

function winGame() {
  clearInterval(timerInterval);
  playSound("winSound");
  launchConfetti();

  const timeUsed = 60 - timer;
  document.getElementById("choices").style.display = "none";
  document.getElementById("sentence").innerHTML = `<h2>🎉 ÞÚ VANNST!<br><br>Tími: ${timeUsed} sekúndur</h2>`;
  document.getElementById("feedback").innerText = "Vel gert! Þú kannt muninn á að og af.";
  document.getElementById("explanation").innerText = "";

  const oldBest = localStorage.getItem("adAfBestTime");
  if (!oldBest || timeUsed < Number(oldBest)) {
    localStorage.setItem("adAfBestTime", timeUsed);
    document.getElementById("highscore").innerText = timeUsed;
    document.getElementById("menuHighscore").innerText = timeUsed;
  }
}

// Fix choices display when restarting after game over/win
const originalRestartGame = restartGame;
restartGame = function() {
  document.getElementById("choices").style.display = "flex";
  originalRestartGame();
};

// CONFETTI
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let pieces = [];
let confettiRunning = false;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function launchConfetti() {
  pieces = [];
  for (let i = 0; i < 250; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360},100%,50%)`
    });
  }

  if (!confettiRunning) {
    confettiRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pieces.forEach(p => {
    p.y += p.speed;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });

  pieces = pieces.filter(p => p.y < canvas.height + 20);

  if (pieces.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
