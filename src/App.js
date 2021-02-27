import './App.css';
import { ListItem } from './ListItem.js';
import { useState, useRef, useEffect } from 'react';
import { Board } from './Board.js';
import io from 'socket.io-client';


const socket = io(); // Connects to socket connection

export function App() {
  const [messages, setMessages] = useState([]); // State variable, list of messages
  const inputRef = useRef(null); // Reference to <input> element
  const joinRef = useRef(null); // Reference to <input> element
  const [usersList, setUserList] = useState([]);
  const [login, setlogin] = useState(false);
  
  function onClickButton() {
    if (inputRef.current.value != 0) {
      const message = inputRef.current.value;
      // If your own client sends a message, we add it to the list of messages to 
      // render it on the UI.
      setMessages(prevMessages => [...prevMessages, message]);
      socket.emit('chat', { message: message });
    }
  }
  
  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('chat', (data) => {
      console.log('Chat event received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setMessages(prevMessages => [...prevMessages, data.message]);
    });
    // socket.on('receive_message', function (data) {
    //     console.log(data);
    //     const newNode = document.createElement('div');
    //     newNode.innerHTML = `<b>${data.username}:&nbsp;</b> ${data.message}`;
    //     document.getElementById('messages').appendChild(newNode);
    // });
    
     socket.on('user_list', (data) => {
      console.log('User list event received!');
      console.log(data);
      setUserList(prevUser => [...prevUser, data.username]);
      console.log(usersList);
    });
    
    socket.on('join_room_announcement', function (data) {
        console.log(data);
        if (data.username !== "{{ username }}") {
            const newNode = document.createElement('div');
            newNode.innerHTML = `<b>${data.username}</b> just slided in!!!`;
            document.getElementById('messages').appendChild(newNode);
        }
    });
    
    socket.on('leave_room_announcement', function (data) {
      console.log(data);
      if (data.username !== "{{ username }}") {
        const newNode = document.createElement('div');
        newNode.innerHTML =  `<b>${data.username}</b> has left the room`;
        document.getElementById('messages').appendChild(newNode);
      }
    });
    
    window.onbeforeunload = function () {
        socket.emit('leave_room', {
            username: "{{ username }}",
        });
    };
    
  }, []);

  return (
    <div>
      <div class='toppane'>
      </div>
      <div class="row">
        <div class="column">
            <h1>All Users</h1>
            {usersList.map((user, index) => <ListItem key={index} name={user} />)}
        </div>  
        <div class="column">
            <h1>Tic Tac Toe Board</h1>
            <Board />
        </div>  
        <div class="column">
            <h1>Chat Messages</h1>
            Enter message here: <input ref={inputRef} type="text"/>
            <button onClick={onClickButton}>Send</button>
            <div id="messages">
              {messages.map((item, index) => <ListItem key={index} name={item} />)}
            </div>
        </div>
      </div>
    </div>
  );
}

