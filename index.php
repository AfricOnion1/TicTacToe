<?php
session_start();
$session_id = session_id();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['result'])) {
    insertResult($_POST['result']);
    exit;
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getResults') {
    header('Content-Type: application/json; charset=utf-8');
    getResults();
    exit;
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'deleteResults') {
    deleteResults();
    exit;
}

function insertResult($result) {
    global $session_id;
    $servername = "db";
    $username   = "root";
    $password   = "example";
    $dbname     = "tictactoe";
    
    $result = strval($result);

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        echo json_encode(["success" => false, "error" => $conn->connect_error]);
        exit;
    }

    $sql = "INSERT INTO games (game_record, session_id) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "error" => $conn->error]);
        $conn->close();
        exit;
    }
    $stmt->bind_param("ss", $result, $session_id);
    $stmt->execute();
    $stmt->close();
    $conn->close();
}

function getResults() {
    global $session_id;
    $servername = "db";
    $username   = "root";
    $password   = "example";
    $dbname     = "tictactoe";

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        echo json_encode([]);
        exit;
    }

    $sql = "SELECT game_record FROM games WHERE session_id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode([]);
        $conn->close();
        exit;
    }
    $stmt->bind_param("s", $session_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $resultsArray = array();
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $resultsArray[] = $row;
        }
    }
    echo json_encode($resultsArray);
    $stmt->close();
    $conn->close();
}

function deleteResults() {
    global $session_id;
    $servername = "db";
    $username   = "root";
    $password   = "example";
    $dbname     = "tictactoe";

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        echo json_encode(["success" => false, "error" => $conn->connect_error]);
        exit;
    }

    $sql = "DELETE FROM games WHERE session_id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "error" => $conn->error]);
        $conn->close();
        exit;
    }
    $stmt->bind_param("s", $session_id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "All records deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    $stmt->close();
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tic Tac Toe</title>
  <link rel="stylesheet" href="style.css">
  <script defer src="script.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
</head>
<body>
    <div id="sidebar" class="sidebar">
        <div class="sidebarButtons">
            <button id="resetScore" onclick="resetScore()">Reset Score</button>
            <a class="closeSidebar" href="javascript:void(0)" onclick="closeSidebar()">&times;</a> 
        </div>
        <div id="matchSpace"></div>
        <div id="emptySpace"></div>
    </div>

    <div class="openSidebar" onclick="openSidebar()">
        <svg viewBox="0 0 100 60" width="40" height="40">
            <rect width="100" height="10"></rect>
            <rect y="25" width="100" height="10"></rect>
            <rect y="50" width="100" height="10"></rect>
        </svg>
    </div>
        
    <div id="gameContainer">
        <h1>TicTacToe Game</h1>
        <p id="turnIndicator">
            <span id="symbolsContainer" style="position: relative; display: inline-block;">
                <span class="x-symbol">
                    <svg viewBox="0 0 40 40" width="36" height="36" style="vertical-align: middle;">
                        <line x1="5" y1="5" x2="35" y2="35" stroke="#B30000" stroke-width="5"/>
                        <line x1="35" y1="5" x2="5" y2="35" stroke="#B30000" stroke-width="5"/>
                    </svg>
                </span>
                <span class="o-symbol">
                    <svg viewBox="0 0 40 40" width="36" height="36" style="vertical-align: middle;">
                        <circle cx="20" cy="20" r="15" fill="none" stroke="#337DFF" stroke-width="5"/>
                    </svg>
                </span>
            </span>
            <span id="turnText" style="margin-left: 10px;">Turn</span>
        </p>  
        <div id="ticTacToeGrid">
            <div class="col">
                <div id="1" class="cell" data-col="0" data-row="0" onclick="makeMove(this, 0, 0, 1)"></div>
                <div id="2" class="cell" data-col="0" data-row="1" onclick="makeMove(this, 1, 0, 2)"></div>
                <div id="3" class="cell" data-col="0" data-row="2" onclick="makeMove(this, 2, 0, 3)"></div>
            </div>
            <div class="col">
                <div id="4" class="cell" data-col="1" data-row="0" onclick="makeMove(this, 0, 1, 4)"></div>
                <div id="5" class="cell" data-col="1" data-row="1" onclick="makeMove(this, 1, 1, 5)"></div>
                <div id="6" class="cell" data-col="1" data-row="2" onclick="makeMove(this, 2, 1, 6)"></div>
            </div>
            <div class="col">
                <div id="7" class="cell" data-col="2" data-row="0" onclick="makeMove(this, 0, 2, 7)"></div>
                <div id="8" class="cell" data-col="2" data-row="1" onclick="makeMove(this, 1, 2, 8)"></div>
                <div id="9" class="cell" data-col="2" data-row="2" onclick="makeMove(this, 2, 2, 9)"></div>
            </div>
        </div>

        <div id="scoreGrid">
            <div class="scoreCol">
                <div id="xCell" class="scoreCell" data-col="0" data-row="0">
                    <svg viewBox="0 0 40 40" width="36" height="36" style="vertical-align: middle;">
                        <line x1="5" y1="5" x2="35" y2="35" stroke="#B30000" stroke-width="5"/>
                        <line x1="35" y1="5" x2="5" y2="35" stroke="#B30000" stroke-width="5"/>
                    </svg>
                </div>
                <div id="xScore" class="scoreCell" data-col="0" data-row="1">0</div>
            </div>
            <div class="scoreCol">
                <div id="drawCell" class="scoreCell" data-col="1" data-row="0">Draw</div>
                <div id="dScore" class="scoreCell" data-col="1" data-row="1">0</div>
            </div>
            <div class="scoreCol">
                <div id="oCell" class="scoreCell" data-col="2" data-row="0">
                    <svg viewBox="0 0 40 40" width="36" height="36" style="vertical-align: middle;">
                        <circle cx="20" cy="20" r="15" fill="none" stroke="#337DFF" stroke-width="5"/>
                    </svg>
                </div>
                <div id="oScore" class="scoreCell" data-col="2" data-row="1">0</div>
            </div>
        </div>
        <div id="moveButtons"></div>
        <button id="playAgain" onclick="resetGame(true, false)">Play Again</button>
    </div>
</body>
</html>
