import logo from './logo.svg';
import './App.css';
import { ListItem } from './ListItem.js';
import { useState, useRef } from 'react';
import { Board } from './Board.js';

function App() {
  const [ myList, changeList ] = useState([]);
  const inputRef = useRef(null);
  
  
  function onClickButton() {
    const userText = inputRef.current.value;
    changeList(prevList => [...prevList, userText]);
  }
  
  
  return (
    <div>
      <h1>Play some Tic Tac Toe!!!</h1>
      <Board />
      <h1>My Favorites</h1>
      <input ref={inputRef} type='text' />
      <button onClick={onClickButton}>Add to list</button>
      <ul>
        {myList.map(item => <ListItem name={item} />)}
      </ul>
    </div>
  );
}

export default App;
