function gameBoard() {
    const board = [];
    const rows = 3;
    const cols = 3;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
          board[i].push(cell());
        }
    }

    const getBoard = () => board;

    const placeMarker = (col, row, player) => {
        //need to ensure move doesn't switch if invalid selection.
        if (board[row][col].getValue() === '') {
            board[row][col].setValue(player);
        } else {
            alert("invalid move");
        }
    }

    const printBoard = () => {
        const output = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(output);
    }
    
    return { getBoard, printBoard, placeMarker };
}

function cell() {
    let value = '';
    const setValue = (player) => {
        value = player;
    };
    const getValue = () => value;

    return {
        setValue, getValue
    };
}

function gameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const board = gameBoard();

    const players = [
        {
            name: playerOneName,
            marker : 'X'
        },
        {
            name: playerTwoName,
            marker : 'O'
        }
    ];
    let activePlayer = players[0];
    
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
      };

    const getActivePlayer = () => activePlayer;

    const printCurrentBoard = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const makeMove = (col, row) => {
        
        board.placeMarker(col, row, getActivePlayer().marker);
        printCurrentBoard();
        if (checkWinTie(board, activePlayer) !== null) {
            alert(`Player ${getActivePlayer().name} wins!`);
        }
        console.log(`${getActivePlayer().name} placed a move in:` + col + ', ' + row);
        switchPlayerTurn();
    }

    printCurrentBoard();

    return {
        makeMove,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

function screenController() {
    const game = gameController();
    const boardDiv = document.getElementById('game-board');

    const updateScreen = () => {
        boardDiv.textContent = '';

        const board = game.getBoard();
        
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const item = document.createElement('div');
                item.classList.add('item');
                item.dataset.row = rowIndex;
                item.dataset.column = colIndex;
                item.textContent = cell.getValue();
                boardDiv.appendChild(item);
            })
      
        })
    }

    function clickHandlerBoard(event) {
        const selectedColumn = event.target.dataset.column;
        const selectedRow = event.target.dataset.row;

        game.makeMove(selectedColumn, selectedRow);
        updateScreen();
    }
    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();
}

function checkWinTie (g_board, activePlayer) {
    //const board = gameController().getBoard();
    const board = g_board.getBoard();
    let gameOver = false;
    let winner = null;
    // by rows
    console.log(board[1][1].getValue());
    for (row = 0; row < 3; row++) {
        console.log('testing rows - ' + board[row][0].getValue() + ' ' + board[row][1].getValue() + ' ' + board[row][2].getValue() + ' ');
        if (board[row][0].getValue() === activePlayer.marker && board[row][1].getValue() === activePlayer.marker && board[row][2].getValue() === activePlayer.marker ) {
            if (board[row][0].getValue() === board[row][1].getValue() && board[row][1].getValue() === board[row][2].getValue) {
                gameOver = true;
            }
        }
    }
    // by columns
    for (column = 0; column < 3; column++) {
        if (board[0][column].getValue() === activePlayer.marker && board[1][column].getValue() === activePlayer.marker && board[2][column].getValue() === activePlayer.marker) {
            if (board[0][column].getValue() === board[1][column].getValue() && board[1][column].getValue() === board[2][column].getValue()) {
                gameOver = true;
            }
        }
    }

    //by diagonals
    if (board[0][0].getValue() === activePlayer.marker && board[1][1].getValue() === activePlayer.marker && board[2][2].getValue() === activePlayer.marker) {
        if (board[0][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][2].getValue()) {
            gameOver = true;
        }
    }

    if (board[2][0].getValue() === activePlayer.marker && board[1][1].getValue() === activePlayer.marker && board[0][2].getValue() === activePlayer.marker) {
        if (board[2][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[0][2].getValue()) {
            gameOver = true;
        }
    }
    if (gameOver === true) {
        winner = activePlayer.name;
    }
    
    //tie logic
    for (row = 0; row < 3; row++) {
        let count = 0;

        for (col = 0; col < 3; col++) {
            if (board[row][col].getValue() === 'X' || board[row][col].getValue() === 'O') {
                count++;
            }
            //this could be moved outside of both for loops. count would need rescoped.
            if (count === 9) {
                winner = "It's a Tie!";
            }
        }
    }
    return winner;
}

screenController();