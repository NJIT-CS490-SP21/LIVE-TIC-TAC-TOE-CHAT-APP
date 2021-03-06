import React from 'react';
import './App.css';
import { ListItem } from './ListItem.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function LeadBoard(props) {
    const [usersList, setUserList] = useState([]);
    
    useEffect(() => {
        // Listening for a chat event emitted by the server. If received, we
        // run the code in the function that is passed in as the second arg
        socket.on('user_list', (data) => {
          console.log('User list event received!');
          console.log(data);
          setUserList(data.users);
          console.log(usersList); 
        });
    }, []);
    return(
        <>
          <div>
            {usersList.map((item, index) => <ListItem key={index} name={item} />)}
          </div>
        </>
    );
}
// <table>
//             <tr>
//               <th>Username</th>
//               <th>Score</th>
//             </tr>
//             {usersList.map((user, index) => (
//             <tr>
//               <td>{user}</td>
//               <td>{index}</td>
//             </tr>
//             )
//             )}
//           </table>