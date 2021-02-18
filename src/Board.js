import React from 'react';
import './Board.css';
import { Square } from './Square.js';
import { useState } from 'react';

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
    
    // function renderMoves(){
    //     <button onClick={() => setBoard(Array(9).fill(null))} >
    //         Start Game
    //     </button>
    // }
    
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

