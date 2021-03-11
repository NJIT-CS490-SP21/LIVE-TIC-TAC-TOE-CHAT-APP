import './App.css';
import { ListItem } from './ListItem.js';
import { useState, useRef, useEffect } from 'react';
import { Board } from './Board.js';
import { LeadBoard } from './LeadBoard.js';
import io from 'socket.io-client';


const socket = io(); // Connects to socket connection

export function App(props) {
  const [messages, setMessages] = useState([]); // State variable, list of messages
  const inputRef = useRef(null); // Reference to <input> element
  const [usersList, setUserList] = useState({});
  const activeLoggedUser = props.user;
  console.log('User name is received in APP: ', activeLoggedUser)
  const [activeUsersList, setActiveUserList] = useState([]);
  const [isShown, setShown] = useState(false);
  const activeWindowName = useRef(null);
  function onClickButton() {
    if (inputRef.current.value !== 0) {
      const message = inputRef.current.value;
      // If your own client sends a message, we add it to the list of messages to 
      // render it on the UI.
      setMessages(prevMessages => [...prevMessages, activeLoggedUser+': '+message]);
      socket.emit('chat', { message: activeLoggedUser+': '+ message });
    }
  }
  
  function showLeadboard() {
    // setShown(!isShown);
    setShown((prevShown) => {
      return !prevShown;
    });
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
    
    socket.on('active_user_list', (data) => {
      console.log('Active user list event received!');
      console.log(data);
      setActiveUserList(data);
      console.log(activeUsersList); 
    });
    
    socket.on('join_room_announcement', function (data) {
        console.log(data);
        if (data.username !== "{{ username }}") {
            var colors = [" came to relax here", " is eating popcorn","  brought pizza for the Chat","Welcome to the Chat"," just slided in"];
            var randomWelcomeMsg = colors[Math.floor(Math.random()*colors.length)]; //pluck a random color
            const newNode = document.createElement('div');
            newNode.innerHTML = `<b>${data.username}</b> ${randomWelcomeMsg}!!!`;
            document.getElementById('messages').appendChild(newNode);
        }
    });
    
    socket.on('leave_room_announcement', function (data) {
      console.log(data);
      if (data.username !== "{{ username }}") {
        var colors = [" sad to see you goooo!!!", " has abandoned us.","  left us"," got bored and left us"," has to finish homework...abandoned us!"];
        var randomLeftMsg = colors[Math.floor(Math.random()*colors.length)]; //pluck a random color
        const newNode = document.createElement('div');
        newNode.innerHTML = `<b>${data.username}</b> ${randomLeftMsg}!!!`;
        document.getElementById('messages').appendChild(newNode);
      }
    });
    
        // Listening for a user_list event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('user_list', (data) => {
      console.log('User list event received!');
      console.log(data);
      setUserList(data);
      console.log(usersList);
    });
    
    window.onbeforeunload = function () {
        socket.emit('leave_room', {
            username: activeLoggedUser,
        });
    };
    
  }, []);

  return (
    <div>
      <h1 class='toppane'>
      Tic Tac Toe & Chatting APP
      </h1>
      <h2>
        Username: {activeLoggedUser}
      </h2>
      <div>
        <button onClick={() => showLeadboard()}>Leadboard!</button>
        { isShown === true ? <LeadBoard user={activeLoggedUser} usersList={usersList}/> : null}
      </div>
      <div class="row">
        <div class="column1">
            <h1>All Users</h1>
            <div class="column1">
            {activeUsersList.map((user, index) => (<><b><ListItem key={index} name={user}/></b></>)
            )}
            </div>
        </div>  
        <div class="column2">
            <h1>Tic Tac Toe Board</h1>
            <Board user={activeLoggedUser} activeList={activeUsersList} usersList={usersList}/>
        </div>  
        <div class="column3">
            <h1>Chat Messages</h1>
            Enter message here: <input ref={inputRef} type="text"/>
            <button onClick={onClickButton}>Send</button>
            <div class="column3"  id="messages">
              {messages.map((item, index) => <ListItem key={index} name={item} />)}
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;