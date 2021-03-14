import ReactDOM from "react-dom";
import "./App.css";
import { App } from "./App.js";
import io from "socket.io-client";

const socket = io(); // Connects to socket connection

export function Login() {
  // body...

  function HandleSubmit(event) {
    var inpt = document.forms["loginForm"]["username"].value;
    if (inpt === null || inpt === "") {
      // alert("Username must be filled out");
      return false;
    }
    let userName = document.getElementById("join_room");
    // TODO- send the address on. a socket to the server
    socket.emit("join_room", { username: userName.value });
    console.log("Sent the address " + userName.value + " to server!");
    ReactDOM.render(
      <App user={userName.value} />,
      document.getElementById("root")
    );
    userName.value = "";
    event.preventDefault();
  }

  return (
    <>
      <div class="toppane">
        <h1>My Chat App</h1>
        <form name="loginForm" onSubmit={HandleSubmit}>
          <div>
            <label>Enter your username:</label>
            <input
              id="join_room"
              placeholder="Username"
              name="username"
            ></input>
            <button type="submit">Join</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
