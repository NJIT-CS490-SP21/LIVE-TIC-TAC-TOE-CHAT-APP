import ReactDOM from 'react-dom';
import './App.css';
import React from 'react';
import io from 'socket.io-client';
import { App } from './App';

const socket = io(); // Connects to socket connection

export function Login() {
  // body...
  function HandleSubmit(event) {
    const inpt = document.forms.loginForm.username.value;
    if (inpt === null || inpt === '') {
      // alert("Username must be filled out");
      return false;
    }
    const userName = document.getElementById('join_room');
    // TODO- send the address on. a socket to the server
    socket.emit('join_room', { username: userName.value });
    // console.log('Sent the address ' + userName.value + ' to server!');
    ReactDOM.render(<App user={userName.value} />, document.getElementById('root'));
    userName.value = '';
    event.preventDefault();
  }
  return (
    <>
      <div className="toppane">
        <h1>My Chat App</h1>
        <form name="loginForm" onSubmit={HandleSubmit}>
          <div>
            <div>Enter your username:</div>
            <input
              id="join_room"
              placeholder="Username"
              name="username"
            />
            <button type="submit">Join</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
