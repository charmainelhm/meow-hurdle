"use strict";

const gameScreen = document.querySelector(".screen");
const character = document.querySelector("#cat");
const overlay = document.querySelector(".overlay");
const highScoreTextEle = document.querySelector(".highscore-text");
const currentScoreEle = document.querySelector(".currentscore");
const highScoreEle = document.querySelector(".highscore");

let obstacles = [];
let [highScore, currentScore] = [0, 0];
let level = 0;
let playingGame = false;

let timeoutObstacle, updateGame;

const levelInfo = [
  {
    speed: 2.5,
    min: 1.5,
    max: 4,
  },
  {
    speed: 2,
    min: 0.9,
    max: 3,
  },
  {
    speed: 1.5,
    min: 0.7,
    max: 2,
  },
];

const getSpeed = (level) => {
  return `${levelInfo[level].speed}s`;
};

const initGame = () => {
  setScoreBoard();
  setObstacle();

  updateGame = setInterval(() => {
    checkForCollision();
    updateScore();
  }, 100);
};

const setObstacle = () => {
  const lvl = levelInfo[level];
  const waitTime = Math.random() * (lvl.max - lvl.min) + lvl.min;

  timeoutObstacle = setTimeout(() => {
    generateObstacles();
    setObstacle();
  }, waitTime * 1000);
};

const resetGameElements = function () {
  obstacles.forEach((obstacle) => {
    obstacle.remove();
  });

  character.removeAttribute("style");
  obstacles = [];
  currentScore = 0;
  level = 0;
};

const pauseGameElements = () => {
  character.style.animationPlayState = "paused";

  obstacles.forEach((obstacle) => {
    obstacle.style.animationPlayState = "paused";
  });
};

const setScoreBoard = () => {
  setScore(highScoreEle, highScore);
  setScore(currentScoreEle, currentScore);
  highScoreTextEle.innerText = "Highscore";
};

const setScore = (screenEle, type) => {
  screenEle.innerText = String(type).padStart(5, "0");
};

const updateScore = () => {
  currentScore++;
  if ((currentScore % 100 === 0) & (level < levelInfo.length - 1)) level++;
  setScore(currentScoreEle, currentScore);
};

const updateHighScore = () => {
  if (currentScore <= highScore) return;

  highScore = currentScore;
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
  clearInterval(updateGame);
  clearTimeout(timeoutObstacle);
};

const clearObstacle = function () {
  this.remove();
  obstacles.shift();
};

const generateObstacles = () => {
  const randomImgNum = Math.ceil(Math.random() * 3);
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.backgroundImage = `url(assets/water_0${randomImgNum}.png)`;
  obstacle.style.animationDuration = getSpeed(level);

  console.log(`Speed set at level ${level}`);

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
  const characterInfo = character.getBoundingClientRect();

  const obstacleLeft = getPosition(obstacle, "left");
  const characterBottom = getPosition(character, "bottom");

  // console.log(`left: ${obstacleLeft}`);
  // console.log(`bottom: ${characterBottom}`);

  if (
    characterBottom < 48 &&
    obstacleLeft < characterInfo.width &&
    obstacleLeft > 0
  ) {
    clearIntervals();
    pauseGameElements();
    overlay.classList.remove("hidden");
    character.style.backgroundImage = "url(assets/cat_gameover.png)";
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
