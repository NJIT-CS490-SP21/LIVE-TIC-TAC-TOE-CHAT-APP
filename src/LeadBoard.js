import React from 'react';
import './App.css';
import { ListItem } from './ListItem.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function LeadBoard(props) {
    const usersList = props.usersList;
    const activeLoggedUser=props.user; 
    console.log(usersList)
    // useEffect(() => {
    //     // Listening for a user_list event emitted by the server. If received, we
    //     // run the code in the function that is passed in as the second arg
    //     socket.on('user_list', (data) => {
    //       console.log('User list event received!');
    //       console.log(data);
    //       setUserList(data.users);
    //       console.log(usersList);
    //     });
    // }, []);
    console.log("added to usersList: "+ usersList); 
    return(
        <>
            <table>
                <tr>
                  <th>Username</th>
                  <th>Score</th>
                </tr>
                  {Object.keys(usersList).map((key, index) => ( 
                <tr>
                  <td key={index}>{key}</td>
                  <td>{usersList[key]}</td>
                </tr>
                ))}
            </table>
        </>
    );
}

//  <div>
//             {
//               Object.keys(usersList).map((key, index) => ( 
//                 <p key={index}> this is my key {key} and this is my value {usersList[key]}</p> 
//               ))
//             }
//           </div>

