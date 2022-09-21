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

const levelInfo = [
  {
    speed: 2.5,
    interval: 2000,
    waitTime: 1000,
  },
  {
    speed: 2,
    interval: 1500,
    waitTime: 1200,
  },
  {
    speed: 1.5,
    interval: 1000,
    waitTime: 800,
  },
];
let level = 0;

const getSpeed = (level) => {
  return `${levelInfo[level].speed}s`;
};

const initGame = () => {
  setScoreBoard();

  setObstacle = setInterval(() => {
    const waitTime = Math.random() * levelInfo[level].waitTime;
    timeoutObstacle = setTimeout(generateObstacles, waitTime);
  }, levelInfo[level].interval);

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

const setScoreBoard = () => {
  setScore(highScoreEle, highScore);
  setScore(currentScoreEle, currentScore);
  highScoreTextEle.innerText = "Highscore";
};

const setScore = (screenEle, type) => {
  screenEle.innerText = String(type).padStart(5, "0");
};

const addScore = () => {
  currentScore++;
  if ((currentScore % 250 === 0) & (level < levelInfo.length)) level++;
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
