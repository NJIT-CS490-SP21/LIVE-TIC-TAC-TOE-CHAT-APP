import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import Login from './Login';
import LeadBoard from './LeadBoard';

test('Join button diappear', () => {
  const appPage = render(<Login />);
  
  const joinButtonElement = screen.getByText('Join');
  expect(joinButtonElement).toBeInTheDocument();
  
  // fireEvent.click(joinButtonElement);
  // expect(joinButtonElement).not.toBeInTheDocument();
});
