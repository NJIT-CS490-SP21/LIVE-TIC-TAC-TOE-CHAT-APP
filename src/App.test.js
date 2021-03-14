import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import Login from './Login';
import Square from './Square';
import LeadBoard from './LeadBoard';
import Board from './Board';

test('Checking all three parts appears', () => {
  const appPage = render(<App />);
  
  // Finding the 'Leadboard!' element and clicking it!
  const BoardElement = screen.getByText('Tic Tac Toe Board');
  expect(BoardElement).toBeInTheDocument();
  
  const SendButtonElement = screen.getByText('Chat Messages');
  expect(SendButtonElement).toBeInTheDocument();
  
  const allUsersElement = screen.getByText('All Users');
  expect(allUsersElement).toBeInTheDocument();
});

test('Leadboard appears and diappears', () => {
  const appPage = render(<App />);
  
  // Finding the 'Leadboard!' element and clicking it!
  const leadboardButtonElement = screen.getByText('Leadboard!');
  expect(leadboardButtonElement).toBeInTheDocument();
  fireEvent.click(leadboardButtonElement);
  
  // Finding the 'Score' element and checking if it appeared after
  // clicking the 'Leadboard!' button
  const ScoreElement = screen.getByText('Score');
  expect(ScoreElement).toBeInTheDocument();
  
  // Clicking 'Leadboard!' button again and checking if the 
  // leadboard disappeared.
  expect(leadboardButtonElement).toBeInTheDocument();
  fireEvent.click(leadboardButtonElement);
  expect(ScoreElement).not.toBeInTheDocument();
});

test('appears', () => {
  // const loginPage = render(<Login />);
  const appPage = render(<App />);
  
  // const button = shallow((<Button ></Button>));
  // button.find('button').simulate('click');
  // // Finding the 'Leadboard!' element and clicking it!
  // const joinElement = screen.getByText('Join');
  // expect(joinElement).toBeInTheDocument();
  
 const { getAllByTestId, getByText } = render(<App />);

  // Click 'X' to start game as player X
  fireEvent.click(getByText("X"));

  // Check that the correct number of squares is rendered
  expect(getAllByTestId(/square/).length).toEqual(9);
});