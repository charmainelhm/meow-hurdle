const gameScreen = document.querySelector(".screen");
const character = document.querySelector("#cat");
const overlay = document.querySelector(".overlay");

const originLeft = character.getBoundingClientRect().left;
const originBottom = character.getBoundingClientRect().bottom;

const obstacles = [];

let playingGame = false;
let setObstacle, collisionChecker, timeoutObstacle;

const jump = () => {
  if (character.classList !== "jump") {
    character.classList.add("jump");
  }

  character.addEventListener("animationend", function () {
    this.classList.remove("jump");
  });
};

const generateObstacles = () => {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  obstacle.addEventListener("animationend", () => {
    gameScreen.removeChild(obstacle);
  });

  obstacles.push(obstacle);

  gameScreen.appendChild(obstacle);
};

const checkForCollision = () => {
  const characterPosition = character.getBoundingClientRect();
  const obstacle = document.querySelector(".obstacle");
  if (!obstacle) return;

  const obstaclePosition = obstacle.getBoundingClientRect();

  const obstacleLeft = obstaclePosition.left - originLeft;
  const characterBottom = originBottom - characterPosition.bottom;

  if (characterBottom < 55 && obstacleLeft < 50 && obstacleLeft > 0) {
    clearInterval(setObstacle);
    clearInterval(collisionChecker);
    clearTimeout(timeoutObstacle);
    console.log("obstacle interval: " + setObstacle);

    character.style.animationPlayState = "paused";
    const allObstacles = document.querySelectorAll(".obstacle");

    allObstacles.forEach((obstacle) => {
      obstacle.style.animationPlayState = "paused";
    });

    overlay.classList.remove("hidden");
    playingGame = false;
    console.log(playingGame);
  }
};

const resetGameElements = () => {
  const allObstacles = document.querySelectorAll(".obstacle");

  allObstacles.forEach((obstacle) => {
    obstacle.remove();
  });

  character.removeAttribute("style");
};

const initGame = () => {
  setObstacle = setInterval(() => {
    const waitTime = Math.random() * 2000;
    timeoutObstacle = setTimeout(generateObstacles, waitTime);
  }, 3000);

  collisionChecker = setInterval(checkForCollision, 100);
};

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    if (!playingGame) {
      overlay.classList.add("hidden");
      playingGame = true;
      resetGameElements();
      initGame();
    } else {
      jump();
    }
  }
});
