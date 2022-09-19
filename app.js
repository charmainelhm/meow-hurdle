const gameScreen = document.querySelector(".screen");
const character = document.querySelector("#cat");

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

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    jump();
  }
});

// const setObstacle = setInterval(() => {
//   const waitTime = Math.random() * 3000;
//   console.log(waitTime);
//   setTimeout(generateObstacles, waitTime);
// }, 3000);
