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
    const [usersList, setUserList] = useState({"X": "", "Y":"", "Spectators":[]});
    
    function handleClick(i){
    	const boardCopy = [...board];
    	// If user click an occupied square or if game is won, return
    	if ( winner || boardCopy[i] ) return;
    	// Put an X or an O in the clicked square
    	boardCopy[i] = xIsNext ? "X" : "O";
    	setBoard(boardCopy);
    	setXisNext(!xIsNext);
    	socket.emit('board', {board: boardCopy, xIsNext:xIsNext});
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
        
        socket.on('gettingXO', (data) => {
          console.log('gettingXO event received!');
          console.log(data);
          if (usersList.X == ""){
            setUserList(usersList.X = data[0]);    
          }
          else if (usersList.O == ""){
            setUserList(usersList.Y = data[1]);    
          }
          else {
             setUserList(usersList.S = data.slice(2));
          }
          console.log(data);
        });
      }, []);

    
    return(
        <>
            <div style={styles}>
                <h3>
                  {winner ? "Winner is : " + winner : "Next Player: " + (xIsNext ? "X" : "O")}
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
