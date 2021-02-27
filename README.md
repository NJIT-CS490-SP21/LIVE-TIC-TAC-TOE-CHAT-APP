# Flask and create-react-app

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## 
1. Controling user clicks on board: If I had more time and resources I would do more reasearch on how to allow first 2 users to control board 'X' or 'O' respectively and others as 'Spectator'.
2. Implementation of Database: On window close I cannot track which user have exited because I am not using a database. If I had database I would add a database which can track user info and can be updated live when user joins and exit.

## Technical Problems
1. Adding a Login page: I was trying to have a user login page before user can see the board and I can dynamically get user login information from login page which I can use in the next page which is the main page where I have my board and chat functionality. Since I was using professors code I was not able to make a path to login page directly from app.py I have taken my friends help where he guided me that I have to make change in index.js. Since it has resrtiction for react-DOM rendering I had to change whole line for which react documentation helped me to understand the concept.
2. Making Restart button to emit empty Board to all users: I was trying to use setBoard function to make board empty by passing "Array(9).fill(null)" into the function. I was getting error for passing empty array in the setBoard function. After trying lots of diffrent techniques to make board restart I discoverd I just have to emit empty array dirrectly instead of calling setBoard.
3. I accidentally deleted 2 files while I wanted to remove untracked file from git status. I used "git cleane -f -X" which I found from google to delete untracked files but Google does not always help. This command deleted ".env.development.local" and "sql.env", second file was not important to me beacuse I have not used a database in my code. But first file was an important file which caused my webpage to give an "Invalid host header."message on webpage instead of showing my actual page.


