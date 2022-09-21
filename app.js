"use strict";

const gameScreen = document.querySelector(".screen");
const character = document.querySelector("#cat");
const overlay = document.querySelector(".overlay");
const highScoreTextEle = document.querySelector(".highscore-text");
const currentScoreEle = document.querySelector(".currentscore");
const highScoreEle = document.querySelector(".highscore");

let obstacles = [];
let [highScore, currentScore] = [0, 0];

let playingGame = false;
let setObstacle, collisionChecker, timeoutObstacle, scoreUpdate;

const initGame = () => {
  setScoreBoard();

  setObstacle = setInterval(() => {
    const waitTime = Math.random() * 2000;
    timeoutObstacle = setTimeout(generateObstacles, waitTime);
  }, 3000);

  collisionChecker = setInterval(checkForCollision, 100);

  scoreUpdate = setInterval(() => {
    addScore();
    setScore(currentScoreEle, currentScore);
  }, 100);
};

const resetGameElements = function () {
  obstacles.forEach((obstacle) => {
    // console.log("clear");
    // const clearThisObstacle = clearObstacle.bind(obstacle);
    // clearThisObstacle();
    obstacle.remove();
  });

  obstacles = [];

  character.removeAttribute("style");

  currentScore = 0;
  // console.log(obstacles);
};

const pauseGameElements = () => {
  character.style.animationPlayState = "paused";

  obstacles.forEach((obstacle) => {
    obstacle.style.animationPlayState = "paused";
  });
};

const setScore = (screenEle, type) => {
  screenEle.innerText = String(type).padStart(5, "0");
};

const addScore = () => {
  currentScore++;
};

const updateHighScore = () => {
  if (currentScore <= highScore) return;

  highScore = currentScore;
};

const setScoreBoard = () => {
  setScore(highScoreEle, highScore);
  setScore(currentScoreEle, currentScore);
  highScoreTextEle.innerText = "Highscore";
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
  clearInterval(scoreUpdate);
  clearTimeout(timeoutObstacle);
};

const clearObstacle = function () {
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

const updateOverlayContent = () => {
  const title = overlay.querySelector(".overlay__title");
  const content = overlay.querySelector(".overlay__text");

  title.innerText = "Game Over";
  content.innerText = "Press spacebar to try again";
};

const getPosition = (element, side) => {
  const parentPosition = gameScreen.getBoundingClientRect()[side];
  const elementPosition = element.getBoundingClientRect()[side];

  return side === "left"
    ? elementPosition - parentPosition
    : parentPosition - elementPosition;
};

const checkForCollision = () => {
  if (obstacles.length === 0) return;

  const obstacle = obstacles[0];

  const obstacleLeft = getPosition(obstacle, "left");
  const characterBottom = getPosition(character, "bottom");

  // console.log(`left: ${obstacleLeft}`);
  // console.log(`bottom: ${characterBottom}`);

  if (characterBottom < 55 && obstacleLeft < 50 && obstacleLeft > 0) {
    // console.log(`Screen left: ${gameScreen.getBoundingClientRect().left}`);
    // console.log(`Obstacle left: ${obstacle.getBoundingClientRect().left}`);
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

      updateOverlayContent();
      updateHighScore();
      resetGameElements();
      initGame();
    } else {
      jump();
    }
  }
});
