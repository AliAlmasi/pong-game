const canvas = document.querySelector("#canv");
const context = canvas.getContext("2d");
const grid = 15;
const paddleHeight = grid * 5; // 80
const maxPaddleY = canvas.height - grid - paddleHeight;

const rightScoreEl = document.querySelector(`.score_right`);
const leftScoreEl = document.querySelector(`.score_left`);

var paddleSpeed = 6;
var ballSpeed = 4;
var audioVolume = 0.7;
var missTimeout = 900;
var rightplayer = 0;
var leftplayer = 0;

const wallHit = document.getElementById("wallHit");
const paddleHit = document.getElementById("paddleHit");
const miss = document.getElementById("miss");
wallHit.volume = audioVolume;
paddleHit.volume = audioVolume;
miss.volume = audioVolume;

const leftPaddle = {
  x: grid * 2,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,

  dy: 0,
};
const rightPaddle = {
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,

  dy: 0,
};
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: grid,
  height: grid,

  resetting: false,

  dx: ballSpeed,
  dy: -ballSpeed,
};

function collides(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  if (leftPaddle.y < grid) {
    leftPaddle.y = grid;
  } else if (leftPaddle.y > maxPaddleY) {
    leftPaddle.y = maxPaddleY;
  }

  if (rightPaddle.y < grid) {
    rightPaddle.y = grid;
  } else if (rightPaddle.y > maxPaddleY) {
    rightPaddle.y = maxPaddleY;
  }

  context.fillStyle = "lightgrey";
  context.fillRect(
    leftPaddle.x,
    leftPaddle.y,
    leftPaddle.width,
    leftPaddle.height
  );
  context.fillRect(
    rightPaddle.x,
    rightPaddle.y,
    rightPaddle.width,
    rightPaddle.height
  );

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y < grid) {
    ball.y = grid;
    ball.dy *= -1;
    wallHit.play();
  } else if (ball.y + grid > canvas.height - grid) {
    ball.y = canvas.height - grid * 2;
    ball.dy *= -1;
    wallHit.play();
  }

  if (ball.x < 0 && !ball.resetting) {
    rightplayer++;
    rightScoreEl.textContent = rightplayer;
  }
  if (ball.x > canvas.width && !ball.resetting) {
    leftplayer++;
    leftScoreEl.textContent = leftplayer;
  }

  if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    ball.resetting = true;
    miss.play();

    setTimeout(() => {
      ball.resetting = false;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
    }, missTimeout);
  }

  if (collides(ball, leftPaddle)) {
    ball.dx *= -1;

    ball.x = leftPaddle.x + leftPaddle.width;
    paddleHit.play();
  } else if (collides(ball, rightPaddle)) {
    ball.dx *= -1;

    ball.x = rightPaddle.x - ball.width;
    paddleHit.play();
  }

  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  context.fillStyle = "lightgrey";
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }
}

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowUp") {
    rightPaddle.dy = -paddleSpeed;
  } else if (e.key === "ArrowDown") {
    rightPaddle.dy = paddleSpeed;
  }
  if (e.key === "w") {
    leftPaddle.dy = -paddleSpeed;
  } else if (e.key === "s") {
    leftPaddle.dy = paddleSpeed;
  }
  if (e.key === "Escape") {
    location.reload();
  }
});

document.addEventListener("keyup", function (e) {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    rightPaddle.dy = 0;
  }

  if (e.key === "w" || e.key === "s") {
    leftPaddle.dy = 0;
  }
});

document.querySelector(`.reset`).addEventListener(`click`, () => {
  location.reload();
});

requestAnimationFrame(loop);
