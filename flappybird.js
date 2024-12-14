//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 50;
let birdHeight = 45;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameStarted = false; 
let gameOver = false;
let score = 0;

let wingSound = new Audio("./sfx_wing.wav");
let hitSound = new Audio("./sfx_hit.wav");
let dieSound = new Audio("./sfx_die.wav");
let pointSound = new Audio("./sfx_point.wav");
let swooshSound = new Audio("./sfx_swooshing.wav");
let bgm = new Audio("bgm_christmas.mp3");
bgm.loop = true;

let selectedBird = 'bird1'; // Default bird

// When the window is loaded
window.onload = function() {
    // Initialize start page behavior
    document.getElementById("chooseBirdBtn").addEventListener("click", chooseBird);
    document.getElementById("gameRuleBtn").addEventListener("click", showGameRulePage);

    
    function chooseBird() {
        document.getElementById("startPage").style.display = "none"; // Hide start page
        document.getElementById("chooseBirdPage").style.display = "flex"; // Show choose bird page
    }

    function showGameRulePage() {
        document.getElementById("startPage").style.display = "none"; // Hide start page
        document.getElementById("gameRulePage").style.display = "flex"; // Show game rule page
    }

    document.querySelectorAll(".birdOption").forEach(birdOption => {
        birdOption.addEventListener("click", function() {
            let bird = birdOption.getAttribute('data-bird'); // Get the bird name from the data attribute
            selectBird(bird);  // Update the selected bird
        });
    });
    
    document.getElementById("backRuleBtn").addEventListener("click", function() {
        document.getElementById("gameRulePage").style.display = "none"; 
        document.getElementById("startPage").style.display = "flex"; 
    });
    
}
    function selectBird(bird) {
        selectedBird = bird;
        console.log("Selected bird:", selectedBird);
    
        // Remove the 'selected' class from all bird options
        document.querySelectorAll(".birdOption").forEach(option => {
            option.classList.remove("selected");
        });
    
        // Add the 'selected' class to the clicked bird option
        const selectedOption = document.querySelector(`[data-bird='${bird}']`);
        selectedOption.classList.add("selected");
        
        
    }
    
    document.addEventListener("DOMContentLoaded", function () {
        const backBtn = document.getElementById("backBtn");
        
        // Đảm bảo nút backBtn tồn tại trước khi gán sự kiện
        if (backBtn) {
            backBtn.addEventListener("click", function () {
                document.getElementById("chooseBirdPage").style.display = "none";
                document.getElementById("startPage").style.display = "flex";
            });
        }
    });
// Function to start the game after bird is selected
function startGameWithBird() {
    document.getElementById("chooseBirdPage").style.display = "none"; // Hide choose bird page
    document.getElementById("gamePage").style.display = "flex"; // Show game page
    initGame(); // Initialize the game with selected bird

    gameStarted = true;
    
    window.addEventListener("keydown", function(event) {
        if (event.key === "c" || event.key === "C") {
            changeBird();
        }
    });
    
}

function changeBird() {
    // Quay lại trang chọn chim
    document.getElementById("gamePage").style.display = "none";
    document.getElementById("chooseBirdPage").style.display = "flex";
    
    // Khởi tạo lại game
    initGame();
    resetGame();
}

// Modify the bird sprite in the game based on the selected bird
function initGame() {
    board = document.getElementById("board");
    board.height = 640;  
    board.width = 360;   
    context = board.getContext("2d");

    // Load the selected bird image
    birdImg = new Image();
    birdImg.src = `./${selectedBird}.png`; // Dynamic source based on selected bird

    // Ensure the bird is drawn after the image is loaded
    birdImg.onload = function() {
        context.clearRect(0, 0, board.width, board.height); // Clear canvas before drawing
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // Every 1.5 seconds
    document.addEventListener("keydown", moveBird);
}




function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        if (!bgm.paused) {
            bgm.pause();
            bgm.currentTime = 0;
        }
        // Game Over Screen
        context.fillStyle = "#FFA500";
        context.font = "55px sans-serif";
        let scoreText = "Score: " + score;
        let scoreTextWidth = context.measureText(scoreText).width;
        context.fillText(scoreText, (boardWidth - scoreTextWidth) / 2, 80);

        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        context.strokeText(scoreText, (boardWidth - scoreTextWidth) / 2, 80);

        context.fillStyle = "#FFD700";
        context.font = "50px sans-serif";
        let gameOverText = "GAME OVER";
        let gameOverTextWidth = context.measureText(gameOverText).width;
        context.fillText(gameOverText, (boardWidth - gameOverTextWidth) / 2, 130);

        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        context.strokeText(gameOverText, (boardWidth - gameOverTextWidth) / 2, 130);

        context.fillStyle = "#90EE90";
        context.font = "20px sans-serif";
        let restartText = "Press key 'R' to restart";
        let restartTextWidth = context.measureText(restartText).width;
        context.fillText(restartText, (boardWidth - restartTextWidth) / 2, 160);

        context.strokeStyle = "#505050";
        context.lineWidth = 0.3;
        context.strokeText(restartText, (boardWidth - restartTextWidth) / 2, 160);

        context.fillStyle = "#90EE90";
        context.font = "20px sans-serif";
        let changeBirdText = "Press key 'C' to change bird";
        let changeBirdTextWidth = context.measureText(changeBirdText).width;
        context.fillText(changeBirdText, (boardWidth - changeBirdTextWidth) / 2, 190);

        context.strokeStyle = "#505050";
        context.lineWidth = 0.3;
        context.strokeText(changeBirdText, (boardWidth - changeBirdTextWidth) / 2, 190);
        
        return;
    }
    

    context.clearRect(0, 0, board.width, board.height);

    // Bird Physics
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); // Apply gravity, limit to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
        dieSound.play();
    }

    // Pipe Physics
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
            pointSound.play();
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
            hitSound.play();
        }
    }

    // Remove off-screen pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // Removes the first element
    }

    // Score Display
    if (!gameOver) {
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText(score, 5, 45);
    }

    // Canvas Border
    context.strokeStyle = "black";
    context.lineWidth = 4;
    context.strokeRect(0, 0, board.width, board.height);
}


function placePipes() {
    if (gameOver) return;

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        if (bgm.paused) {
            bgm.play();
        }
        swooshSound.play();
        wingSound.play();
        velocityY = -6; // Jump

    
    }
}
// Reset game when 'R' is pressed
document.addEventListener("keydown", function (e) {
    if (gameOver && e.code === "KeyR") {
        resetGame();
    }
});

// Reset game function
function resetGame() {
    velocityY = 0; // Reset fall speed
    bird.y = boardHeight / 2;
    pipeArray = [];
    score = 0;
    gameOver = false;
    gameStarted = false;

    // Kiểm tra sự tồn tại của phần tử startButton
    const startButton = document.getElementById("startGameBtn");
    if (startButton) {
        startButton.style.display = "block"; // Show start button again
    } else {
        console.error("Không tìm thấy phần tử có id 'startButton'");
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
