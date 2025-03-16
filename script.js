let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

const svgX = `
<svg viewBox="0 0 40 40" width="90" height="90" stroke="#B30000">
    <line class="x-line" x1="5" y1="5" x2="35" y2="35" stroke-width="5" stroke-dasharray="42.4" stroke-dashoffset="42.4"/>
    <line class="x-line" x1="35" y1="5" x2="5" y2="35" stroke-width="5" stroke-dasharray="42.4" stroke-dashoffset="42.4"/>
</svg>`;

const svgO = `
<svg viewBox="0 0 40 40" width="90" height="90" stroke="#337DFF">
    <circle class="o-circle" cx="20" cy="20" r="15" fill="none" stroke-width="5"/>
</svg>`;

const smallSvgX = `
<svg viewBox="0 0 40 40" width="36" height="36" style="vertical-align: middle;">
    <line x1="5" y1="5" x2="35" y2="35" stroke="#B30000" stroke-width="5"/>
    <line x1="35" y1="5" x2="5" y2="35" stroke="#B30000" stroke-width="5"/>
</svg>`;

const smallSvgO = `
<svg viewBox="0 0 40 40" width="36" height="36" style="vertical-align: middle;">
    <circle cx="20" cy="20" r="15" fill="none" stroke="#337DFF" stroke-width="5"/>
</svg>`;

const microSvgX= `
<svg viewBox="0 0 40 40" width="24" height="24" style="vertical-align: middle;">
    <line x1="5" y1="5" x2="35" y2="35" stroke="#B30000" stroke-width="5"/>
    <line x1="35" y1="5" x2="5" y2="35" stroke="#B30000" stroke-width="5"/>
</svg>`;

const microSvgO= `
<svg viewBox="0 0 40 40" width="24" height="24" style="vertical-align: middle;">
    <circle cx="20" cy="20" r="15" fill="none" stroke="#337DFF" stroke-width="5"/>
</svg>`;


const smallGrid = `
<div class="pastMatch" onclick="?">
    <div class="smallCol">
        <div id="1s" class="smallCell 1" data-col="0" data-row="0">*</div>
        <div id="2s" class="smallCell 2" data-col="0" data-row="1">*</div>
        <div id="3s" class="smallCell 3" data-col="0" data-row="2">*</div>
    </div>
    <div class="smallCol">
        <div id="4s" class="smallCell 4" data-col="1" data-row="0">*</div>
        <div id="5s" class="smallCell 5" data-col="1" data-row="1">*</div>
        <div id="6s" class="smallCell 6" data-col="1" data-row="2">*</div>
    </div>
    <div class="smallCol">
        <div id="7s" class="smallCell 7" data-col="2" data-row="0">*</div>
        <div id="8s" class="smallCell 8" data-col="2" data-row="1">*</div>
        <div id="9s" class="smallCell 9" data-col="2" data-row="2">*</div>
    </div>
</div>`
const pastMatchStats = `
<div class="pastMatchStats">
    <div class="pastMatchTitle">^</div>
    <div class="pastMatchResult">Draw</div>
</div>`

const moveBackButton =`
<button id="moveBack" onclick="?">
    <svg width="50" height="50" viewBox="0 0 50 50">
        <polygon points="33,12 13,27 33,42" fill="black"/>
    </svg>
</button>`
const moveForwardButton =`
<button id="moveForward" onclick="?">
    <svg width="50" height="50" viewBox="0 0 50 50">
        <polygon points="17,12 37,27 17,42" fill="black"/>
    </svg>
</button>`

let currentPlayer = 'X';
let xColor = '#B30000';
let oColor = '#337DFF';

let nextGameX = false;
let gameActive = true;
let pastMatch = false;
let firstBack = true;
let forwardAvailable = false;

let finalRecord = ' ';
let backCounter = 0;
let forwardCounter = 0;
let lastPlayer;
let player;
let result = '';
let last = "D";


const startingGrid = document.getElementById('ticTacToeGrid');
const startingGridRect = startingGrid.getBoundingClientRect();

const xElement = document.querySelector('#turnIndicator .x-symbol');
const oElement = document.querySelector('#turnIndicator .o-symbol');
const turnIndicatorTextSpan = document.querySelector('#turnIndicator #turnText');

drawBoardLines();
updateTurnIndicator(false);
countWins();

function makeMove(cell, row, col, location) {
    const countDelay = 100;

    if (board[row][col] || !gameActive) {
        return;
    }
    board[row][col] = currentPlayer;

    if (result === '') {
        result = result.concat(currentPlayer);
    }

    cell.innerHTML = currentPlayer === 'X' ? svgX : svgO;
    let winner = checkWinner();
    if (winner != null) {
        gameActive = false;
        updateTurnIndicator(true);
        document.getElementById('playAgain').style.visibility = 'visible';
        drawWinningLine(winner);

        result = result.concat(location);
        while (result.length != 10){
            result = result.concat("0");
        }
        result = result.concat(last);
        sendResult(result);

        setTimeout(() => {
            countWins();  
        }, countDelay);

    } else if (checkDraw()) {
        gameActive = false;
        updateTurnIndicator(true);
        document.getElementById('playAgain').style.visibility = 'visible';

        result = result.concat(location);
        result = result.concat(last);
        sendResult(result);

        setTimeout(() => {
            countWins();
        }, countDelay);

    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnIndicator(false);

        result = result.concat(location);
    }
}


function checkWinner() {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            last = currentPlayer;
            return [[i, 0], [i, 1], [i, 2]];  
        }
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            last = currentPlayer;
            return [[0, i], [1, i], [2, i]];
        }
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        last = currentPlayer;
        return [[0, 0], [1, 1], [2, 2]];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        last = currentPlayer;
        return [[0, 2], [1, 1], [2, 0]];
    }
    return null;
}

function updateTurnIndicator(isGameOver) {
    if (!isGameOver) {
        xElement.style.opacity = currentPlayer === 'X' ? '1' : '0';
        oElement.style.opacity = currentPlayer === 'O' ? '1' : '0';
        turnIndicatorTextSpan.textContent = 'Turn';
    } else {
        xElement.style.opacity = '0';
        oElement.style.opacity = '0';
        xElement.classList.add('no-transition');
        oElement.classList.add('no-transition');
        turnIndicatorTextSpan.style.marginLeft = "0";
        turnIndicatorTextSpan.style.position = "absolute";
        turnIndicatorTextSpan.textContent = 'Game Over';
    }
}


function drawWinningLine(winningPositions) {
    const grid = document.getElementById('ticTacToeGrid');
    const cellSize = grid.offsetWidth / 3;
    const padding = 10;
    const strokeWidth = 9;
    const animationDelay = 200;

    let x1, y1, x2, y2;

    if (winningPositions[0][0] === winningPositions[1][0]) {
        y1 = y2 = winningPositions[0][0] * cellSize + cellSize / 2;
        x1 = padding;
        x2 = grid.offsetWidth - padding;
    } else if (winningPositions[0][1] === winningPositions[1][1]) {
        x1 = x2 = winningPositions[0][1] * cellSize + cellSize / 2;
        y1 = padding;
        y2 = grid.offsetHeight - padding;
    } else if (winningPositions[0][1] === 0) {
        x1 = y1 = padding;
        x2 = y2 = grid.offsetWidth - padding;
    } else {
        x1 = padding;
        y1 = grid.offsetHeight - padding;
        x2 = grid.offsetWidth - padding;
        y2 = padding;
    }

    const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');    
    svg.setAttribute('id', 'winning-line');

    setTimeout(() => {
        svg.style.position = 'absolute';
        svg.style.left = '0';
        svg.style.top = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
    
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x1);
        line.setAttribute('y2', y1);
        line.setAttribute('stroke', '#8C8273');
        line.setAttribute('stroke-width', strokeWidth);
        line.setAttribute('stroke-linecap', 'round');
    
        line.style.strokeDasharray = lineLength;
        line.style.strokeDashoffset = lineLength;
    
        svg.appendChild(line);
        grid.appendChild(svg);
    
        requestAnimationFrame(() => {
            line.style.transition = 'stroke-dashoffset 600ms ease-out';
            line.style.strokeDashoffset = '0';
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
        });
    }, animationDelay);

}

function drawBoardLines() {
    const grid = document.getElementById('ticTacToeGrid');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    grid.appendChild(svg);

    const linesData = [
        { x1: '33%', y1: '0', x2: '33%', y2: '100%' },  // Vertical left
        { x1: '66%', y1: '0', x2: '66%', y2: '100%' },  // Vertical right
        { x1: '0', y1: '33%', x2: '100%', y2: '33%' },  // Horizontal top
        { x1: '0', y1: '66%', x2: '100%', y2: '66%' }   // Horizontal bottom
    ];

    linesData.forEach(({ x1, y1, x2, y2 }) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'animline');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        svg.appendChild(line);
    });
}

function checkDraw() {
    return board.flat().every(cell => cell !== '');
}

function resetGame(clearBool, pastBool) {
    if(clearBool){
        last = "D";
        result = "";
        gameActive = true;
        document.getElementById('moveButtons').innerHTML = '';
        document.getElementById('playAgain').style.visibility = 'hidden';
        for(let i = 1; i < 10; i++) {
            let blankCell = document.getElementById(i);
            blankCell.style.pointerEvents = 'auto';
        }
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        pastMatch = false;
        xElement.classList.remove('no-transition');
        oElement.classList.remove('no-transition');
        turnIndicatorTextSpan.style.position = "relative";
        turnIndicatorTextSpan.style.marginLeft = "10px";
    }
    
    if(!pastBool) {
        if (nextGameX) {
            currentPlayer = 'X';
            nextGameX = false;
        } else {
            currentPlayer = 'O';
            nextGameX = true;
        }
    }
    
    updateTurnIndicator(false);
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('grid-fade-out');
        cell.style.opacity = '';
        cell.style.transform = '';
    });

    const clonedCells = document.querySelectorAll('.cloned-cell');
    clonedCells.forEach(cell => cell.remove());

    const clonedLine = document.getElementById('cloned-winning-line');
    if (clonedLine) {
        clonedLine.remove();
    }
    
    const grid = document.getElementById('ticTacToeGrid');
    grid.classList.remove('grid-shrink-fade');
    
    const svgs = grid.querySelectorAll('svg');
    svgs.forEach(svg => grid.removeChild(svg));

    drawBoardLines();
}


function openSidebar() {
    document.getElementById("sidebar").style.width = "375px";
  }

function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
}

function placeMatchHistory() {
    const space = document.getElementById('matchSpace');
    space.innerHTML = '';
    let counter = 0;
    getScores().then(scores => {
        scores.forEach(score => {
            counter++;
            let newGrid = smallGrid.replace("?", `showPastMatch('${score}', '${counter}')`);
            let pos;
            let winner = score[10];
            let firstPlayer = score[0];
            let player1, player2;
            
            let matchStats = pastMatchStats.replace("^", counter + ". Match");
            if (winner === 'D'){
                space.innerHTML += matchStats;
            }
            else if (winner === 'X'){
                matchStats = matchStats.replace("Draw", microSvgX + `<span style=" margin-left: 5px">Win</span>`);
                space.innerHTML += matchStats;
            }
            else if (winner === 'O'){
                matchStats = matchStats.replace("Draw", microSvgO + `<span style=" margin-left: 5px">Win</span>`);
                space.innerHTML += matchStats;
            }
            
            if (firstPlayer === 'X') {
                player1 = smallSvgX;
                player2 = smallSvgO;
            }
            else {
                player1 = smallSvgO;
                player2 = smallSvgX;
            }
            
            for(let i = 1; i < 10; i++){
                cellFilled = score.includes(i);
                if (cellFilled === true) {
                    pos = parseInt(score.indexOf(i));
                    if (pos % 2 != 1) {
                        newGrid = newGrid.replace("*", player2);
                    }
                    else if ((pos % 2 === 1)) {
                        newGrid = newGrid.replace("*", player1);
                    }
                }
                else{
                    newGrid = newGrid.replace("*", "");
                }         
                
            }
            space.innerHTML += newGrid;
        });
    });
    
}

function showPastMatch(record, recordNumber){
    const buttonContainer = document.getElementById('moveButtons');
    const n = parseInt(record.indexOf(0)) === -1 ? 10 : parseInt(record.indexOf(0));

    let backButton = moveBackButton.replace("?", `firstMoveBack('${record}')`);
    let forwardButton = moveForwardButton.replace("?", `firstMoveForward()`);
    let firstPlayer = record[0];
    let player1, player2;
    
    firstBack = true;

    resetGame(false, pastMatch);
    if(!pastMatch) {
        pastMatch = true;
    }
    
    document.getElementById('playAgain').style.visibility = 'visible';
    xElement.classList.add('no-transition');
    oElement.classList.add('no-transition');
    xElement.style.opacity = '0';
    oElement.style.opacity = '0';
    turnIndicatorTextSpan.style.position = "absolute";
    turnIndicatorTextSpan.style.marginLeft = "0";
    turnIndicatorTextSpan.innerHTML = `${recordNumber}. Match`;
    
    if (firstPlayer === 'X') {
        player1 = svgX;
        player2 = svgO;
    }
    else {
        player1 = svgO;
        player2 = svgX;
    }
    
    for(let i = 1; i < 10; i++) {
        let blankCell = document.getElementById(i);
        blankCell.style.pointerEvents = 'none';
    }

    for(let i = 1; i < n; i++){
            let cell = document.getElementById(record[i]);
            if (i % 2 === 1){
                cell.innerHTML = player1;
            }
            else cell.innerHTML = player2;
        } 
    buttonContainer.innerHTML = '';
    buttonContainer.innerHTML += backButton;
    buttonContainer.innerHTML += forwardButton;
}

function firstMoveBack(record) {
    if(firstBack) {
        firstBack = false;
        backCounter = 0;
        forwardCounter = 0;
        setFinalRecord(record);
        player = record[10];
    }
    if (backCounter < finalRecord.length) {
        if (player === 'D'){
            player = record[0];
        }
        
        let targetCell = document.getElementById(finalRecord[backCounter]);
        let svg = targetCell.getElementsByTagName('svg')[0];
        if (player === 'X') {
            svg.style.stroke = '#181A1B';
            player = 'O';
            lastPlayer = 'X';
        }
        else if (player === 'O') {
            svg.style.stroke = '#181A1B';
            player = 'X';
            lastPlayer = 'O';
        }
        backCounter++;
        forwardCounter++;
        forwardAvailable = true;
    }
}

function firstMoveForward() {
    if(forwardAvailable){
        if(forwardCounter === 1) forwardAvailable = false;
        forwardCounter--;
        backCounter--;
        
        let targetCell = document.getElementById(finalRecord[backCounter]);
        if (lastPlayer === 'X') {
            targetCell.innerHTML = svgX;
            lastPlayer = 'O';
            player = 'X'
        }
        else if (lastPlayer === 'O') {
            targetCell.innerHTML = svgO;
            lastPlayer = 'X';
            player = 'O'
        }
    }
}

function setFinalRecord(record) {
    let trimRecord = record.replaceAll("X", '');

    trimRecord = trimRecord.replaceAll("O", '');
    trimRecord = trimRecord.replaceAll("D", '');
    trimRecord = trimRecord.replaceAll("0", '');
    finalRecord = reverseRecord(trimRecord);
}

function reverseRecord(record) {
    let revString = record.split("").reduce((acc, char) => char + acc, ""); 
    return revString;
}

function sendResult(result){
    fetch('index.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded',},
        body: `result=${encodeURIComponent(result)}`
    })
    .then(response => response.text());
}

function getScores() {
    return fetch('index.php?action=getResults', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text();
    })
    .then(text => {
        try {
            const jsonData = JSON.parse(text);
            const scores = jsonData
              .map(item => item.game_record)
              .filter(score => score && score.length >= 11);
            return scores;
        } catch (error) {
            console.error('Parsing error:', error);
            throw new Error('Error parsing JSON: ' + error);
        }
    });
}


function countWins() {
    let xWins = 0, oWins = 0, dWins = 0;
    getScores().then(scores => {
        scores.forEach(score => {
            if (score[10] === 'X') {
                xWins++;
            } else if (score[10] === 'O') {
                oWins++;
            } else if (score[10] === 'D') {
                dWins++;
            }
        });
        document.getElementById('xScore').innerHTML = xWins;
        document.getElementById('oScore').innerHTML = oWins;
        document.getElementById('dScore').innerHTML = dWins;
    });
    placeMatchHistory();
}

function resetScore() {
    const countDelay = 750;
    fetch('index.php', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=deleteResults'
    })
    .then(response => response.text())
    .then(text => console.log(text))
    .catch(error => console.error('Error:', error));
    closeSidebar();
    setTimeout(() => {
        countWins();
    }, countDelay);
    resetGame(true, false);
    resetGame(true, false);
}
