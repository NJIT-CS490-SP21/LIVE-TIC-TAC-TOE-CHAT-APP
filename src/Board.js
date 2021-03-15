import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import './Board.css';
import io from 'socket.io-client';
import { Square } from './Square';

const socket = io(); // Connects to socket connection

const styles = {
  width: '200px',
  margin: '10 px auto',
};

export function Board(props) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXisNext] = useState(true);
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
    for (let i = 0; i < lines.length; i + 1) {
      const [a, b, c] = lines[i];
      if (
        squares[a]
        && squares[a] === squares[b]
        && squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }
  const winner = calculateWinner(board);
  console.log(winner);
  // const usersList = props.activeList;
  const { user, usersList } = props;
  const xPlayer = usersList[0];
  const oPlayer = usersList[1];

  // function winnerFound(winner){
  //     socket.emit('winnerFound', {winner: winner, xPlayer:xPlayer, oPlayer});
  // }
  function handleClick(i) {
    const boardCopy = [...board];
    // If user click an occupied square or if game is won, return
    if (winner || boardCopy[i]) return;
    if (user === xPlayer && xIsNext === true) {
      // Put an X or an O in the clicked square
      boardCopy[i] = xIsNext ? 'X' : 'O';
      setBoard(boardCopy);
      setXisNext(!xIsNext);
      socket.emit('board', { board: boardCopy, xIsNext });
    } else if (user === oPlayer && xIsNext === false) {
      // Put an X or an O in the clicked square
      boardCopy[i] = xIsNext ? 'X' : 'O';
      setBoard(boardCopy);
      setXisNext(!xIsNext);
      socket.emit('board', { board: boardCopy, xIsNext });
    }
  }

  function resartBoard() {
    socket.emit('winnerFound', {
      winner,
      xPlayer,
      oPlayer,
    });
    const board = Array(9).fill(null);
    console.log('boardCopy');
    console.log(board);
    socket.emit('board', { board });
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

  // winnerFound(winner);
  return (
    <>
      <div style={styles}>
        <h3>
          {winner
            ? `Winner is : ${winner ? `${xPlayer}(X)` : `${oPlayer}(O)`}`
            : `Next turn: ${
              xIsNext ? xPlayer : oPlayer
            } (${
              xIsNext ? 'X' : 'O'
            })`}
        </h3>
      </div>
      <div className="board">
        {board.map((square, i) => (
          <Square class="box" key={i} value={square} onClick={() => { handleClick(i); }} />
        ))}
      </div>
      <button onClick={resartBoard} type="button">Restart Game</button>
    </>
  );
}
Board.propTypes = {
  user: PropTypes.func,
  usersList: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
    PropTypes.array,
  ]),
};

Board.defaultProps = {
  user: PropTypes.func,
  usersList: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
    PropTypes.array,
  ]),
};
export default Board;
