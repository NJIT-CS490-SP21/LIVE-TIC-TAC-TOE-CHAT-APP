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

export function Board(props) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXisNext] = useState(true);
    const winner = calculateWinner(board);
    const usersList = props.activeList;
    const user = props.user;
    const X_player = usersList[0];
    const O_player = usersList[1];
    
    function handleClick(i){
        const boardCopy = [...board];
    	// If user click an occupied square or if game is won, return
    	if ( winner || boardCopy[i] ) return;
        if (user === X_player && xIsNext === true){
        	// Put an X or an O in the clicked square
        	boardCopy[i] = xIsNext ? "X" : "O";
	        setBoard(boardCopy);
    	    setXisNext(!xIsNext);    
        	socket.emit('board', {board: boardCopy, xIsNext:xIsNext});    
        }
        else if(user === O_player && xIsNext === false){
            // Put an X or an O in the clicked square
        	boardCopy[i] = xIsNext ? "X" : "O";
	        setBoard(boardCopy);
    	    setXisNext(!xIsNext);    
        	socket.emit('board', {board: boardCopy, xIsNext:xIsNext});    
        }
    }
    
    function resartBoard(){
        var board = Array(9).fill(null);
        console.log('boardCopy');
        console.log(board);
        socket.emit('board', {board: board});
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
          setXisNext(!data.xIsNext);
          setBoard(data.board);
        });
      }, []);

    
    return(
        <>
            <div style={styles}>
                <h3>
                  {winner ? "Winner is : " + (winner ? X_player+"(X)" : O_player+"(O)"): "Next turn: " +(xIsNext ? X_player : O_player)+" ("+(xIsNext ? "X" : "O")+")"}
                </h3>
            </div>
            <div class="board">
                {board.map((square, i) => (
                  <Square class="box" key={i} value={square} onClick={() => { (handleClick(i): null)}} />
                ))}
            </div>
            <button onClick={resartBoard} >
                Restart Game
            </button>
        </>
    );
}
