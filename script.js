
/* NAVIGATION */

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(screenId).classList.add("active");
}

function startMission() {
    showScreen("mission");
}

function sayNo() {
    showScreen("no-screen");
}

function backToWelcome() {
    const letterScreen = document.getElementById("letter-screen");

    letterScreen.classList.remove("paper-out", "show-text");

    showScreen("welcome");
}

function startPuzzle() {
    showScreen("puzzle");
    createPuzzle();
}


/* CONFIGURATION DU PUZZLE */

const TOTAL_PIECES = 20;
const COLONNES = 5;
const LIGNES = 4;

let pieces = [];
let draggedIndex = null;


/* MELANGER LES PIECES */

function shufflePieces() {
    pieces = Array.from(
        { length: TOTAL_PIECES },
        (_, index) => index
    );

    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }

    if (pieces.every((piece, index) => piece === index)) {
        [pieces[0], pieces[1]] = [pieces[1], pieces[0]];
    }
}


/* CREER LE PUZZLE */

function createPuzzle() {
    const board = document.getElementById("puzzle-board");
    const winMessage = document.getElementById("win-message");

    board.innerHTML = "";
    winMessage.style.display = "none";

    shufflePieces();
    renderPuzzle();
}


/* AFFICHER LES PIECES */

function renderPuzzle() {
    const board = document.getElementById("puzzle-board");

    board.innerHTML = "";

    pieces.forEach((piece, index) => {
        const tile = document.createElement("div");

        tile.className = "puzzle-piece";
        tile.draggable = true;

        const col = piece % COLONNES;
        const row = Math.floor(piece / COLONNES);

        const x = col * 100 / (COLONNES - 1);
        const y = row * 100 / (LIGNES - 1);

        tile.style.backgroundImage = 'url("assets/puzzle.png")';
        tile.style.backgroundSize =
            `${COLONNES * 100}% ${LIGNES * 100}%`;
        tile.style.backgroundPosition = `${x}% ${y}%`;

        tile.addEventListener("dragstart", () => {
            draggedIndex = index;
            tile.classList.add("dragging");
        });

        tile.addEventListener("dragend", () => {
            tile.classList.remove("dragging");
        });

        tile.addEventListener("dragover", event => {
            event.preventDefault();
        });

        tile.addEventListener("drop", event => {
            event.preventDefault();

            if (draggedIndex === null || draggedIndex === index) {
                return;
            }

            [pieces[draggedIndex], pieces[index]] =
                [pieces[index], pieces[draggedIndex]];

            draggedIndex = null;
            renderPuzzle();
        });

        board.appendChild(tile);
    });

    updateProgress();
}


/* VERIFIER LA PROGRESSION */

function updateProgress() {
    const correct = pieces.filter(
        (piece, index) => piece === index
    ).length;

    document.getElementById("puzzle-status").textContent =
        `${correct} / ${TOTAL_PIECES} pièces bien placées`;

    if (correct === TOTAL_PIECES) {
        document.getElementById("win-message").style.display = "block";
    }
}


/* PREMIERE SURPRISE */

function showReward() {
    showScreen("reward");
}


/* SI ELLE REFUSE LA SURPRISE */

function refuseLetter() {
    showScreen("reward-no");
}

function backToReward() {
    showScreen("reward");
}


/* OUVERTURE DE L'ENVELOPPE */

function openLetter() {
    const letterScreen = document.getElementById("letter-screen");

    letterScreen.classList.remove("paper-out", "show-text");

    showScreen("letter-screen");

    setTimeout(() => {
        letterScreen.classList.add("paper-out");
    }, 300);

    setTimeout(() => {
        letterScreen.classList.add("show-text");
    }, 2500);
}
