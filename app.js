const gameScreen = document.querySelector(".screen");
const character = document.querySelector("#cat");

const originLeft = character.getBoundingClientRect().left;
const originBottom = character.getBoundingClientRect().bottom;

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

  gameScreen.appendChild(obstacle);
};

const checkForCollision = () => {
  const characterPosition = character.getBoundingClientRect();
  const obstacle = document.querySelector(".obstacle");
  if (!obstacle) return;

  const obstaclePosition = obstacle.getBoundingClientRect();

  const obstacleLeft = obstaclePosition.left - originLeft;
  const characterBottom = originBottom - characterPosition.bottom;

  if (characterBottom < 55 && obstacleLeft < 50 && obstacleLeft > 0)
    console.log("Collided");
};

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    jump();
  }
});

const setObstacle = setInterval(() => {
  const waitTime = Math.random() * 2000;
  console.log(waitTime);
  setTimeout(generateObstacles, waitTime);
}, 3000);

const collisionChecker = setInterval(checkForCollision, 100);
