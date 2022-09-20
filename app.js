"use strict";

const gameScreen = document.querySelector(".screen");
const character = document.querySelector("#cat");
const overlay = document.querySelector(".overlay");

const screenLeft = gameScreen.getBoundingClientRect().left;
const screenBottom = gameScreen.getBoundingClientRect().bottom;

let obstacles = [];

let playingGame = false;
let setObstacle, collisionChecker, timeoutObstacle;

const initGame = () => {
  setObstacle = setInterval(() => {
    const waitTime = Math.random() * 2000;
    timeoutObstacle = setTimeout(generateObstacles, waitTime);
  }, 3000);

  collisionChecker = setInterval(checkForCollision, 100);
};

const resetGameElements = function () {
  obstacles.forEach((obstacle) => {
    const clearThisObstacle = clearObstacle.bind(obstacle);
    clearThisObstacle();
  });

  character.removeAttribute("style");
};

const pauseGameElements = () => {
  character.style.animationPlayState = "paused";

  obstacles.forEach((obstacle) => {
    obstacle.style.animationPlayState = "paused";
  });
};

const jump = () => {
  if (character.classList !== "jump") {
    character.classList.add("jump");
  }

  character.addEventListener("animationend", function () {
    this.classList.remove("jump");
  });
};

const clearIntervals = () => {
  clearInterval(setObstacle);
  clearInterval(collisionChecker);
  clearTimeout(timeoutObstacle);
};

const clearObstacle = function () {
  console.log(this);
  this.remove();
  obstacles.shift();
};

const generateObstacles = () => {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacles.push(obstacle);
  gameScreen.appendChild(obstacle);

  obstacle.addEventListener("animationend", clearObstacle);
};

const getPosition = (element, side) => {
  const elementPosition = element.getBoundingClientRect();
  return elementPosition[side];
};

const checkForCollision = () => {
  if (obstacles.length === 0) return;

  const obstacle = obstacles[0];

  const obstacleLeft = getPosition(obstacle, "left") - screenLeft;
  const characterBottom = screenBottom - getPosition(character, "bottom");

  if (characterBottom < 55 && obstacleLeft < 50 && obstacleLeft > 0) {
    clearIntervals();
    pauseGameElements();
    overlay.classList.remove("hidden");
    playingGame = false;
  }
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
