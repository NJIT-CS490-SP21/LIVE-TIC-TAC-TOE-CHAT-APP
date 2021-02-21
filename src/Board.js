import React from 'react';
import './Board.css';
import { Square } from './Square.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

const styles = {
    width: '200px',
    margin: '10 px auto',
};

export function Board() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXisNext] = useState(true);
    const winner = calculateWinner(board);
    function handleClick(i){
    	const boardCopy = [...board];
    	// If user click an occupied square or if game is won, return
    	if ( winner || boardCopy[i]) return;
    	// Put an X or an O in the clicked square
    	boardCopy[i] = xIsNext ? "X" : "O";
    	setBoard(boardCopy);
    	setXisNext(!xIsNext);
    	socket.emit('board', {board: boardCopy, xIsNext:board});
    }
    
    function calculateWinner(board) {
        const squares = board;
    	const lines = [
    		[0, 1, 2],
    		[3, 4, 5],
    		[6, 7, 8],
    		[0, 3, 6],
    		[1, 4, 7],
    		[2, 5, 8],
    		[0, 4, 8],
    		[2, 4, 6],
    	];
    	for (let i = 0; i < lines.length; i++) {
    		const [a, b, c] = lines[i];
    		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    			return squares[a];
    		}
    	}
    	return null;
    }   
    
      useEffect(() => {
        // Listening for a chat event emitted by the server. If received, we
        // run the code in the function that is passed in as the second arg
        socket.on('board', (data) => {
          console.log('Board event received!');
          console.log(data);
          // If the server sends a message (on behalf of another client), then we
          // add it to the list of messages to render it on the UI.
        //   setXisNext(!xIsNext);
          setBoard(data.board);
        //   setBoard(prevMessages => [...prevMessages, data.board]);
        });
      }, []);

    
    return(
        <>
            <div style={styles}>
                <p>
                  {winner ? "Winner is Player: " + winner : "Next Player: " + (xIsNext ? "X" : "O")}
                </p>
            </div>
            <div class="board">
                {board.map((square, i) => (
                  <Square class="box" key={i} value={square} onClick={() => handleClick(i)} />
                ))}
            </div>
            <button onClick={() => setBoard(Array(9).fill(null))} >
                Start Game
            </button>
        </>
    );
}

