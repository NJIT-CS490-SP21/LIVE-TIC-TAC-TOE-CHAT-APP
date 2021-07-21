## APP LINK:- https://calm-wave-79025.herokuapp.com/
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

## Create a new database on Heroku and connect to our code

4. In your terminal, go to the directory with `app.py`.
5. Let's set up a new _remote_ Postgres database with Heroku and connect to it locally.

- Login and fill creds: `heroku login -i`
- Create a new Heroku app: `heroku create`
- Create a new remote DB on your Heroku app: `heroku addons:create heroku-postgresql:hobby-dev` (If that doesn't work, add a `-a {your-app-name}` to the end of the command, no braces)
- See the config vars set by Heroku for you: `heroku config`. Copy paste the value for DATABASE_URL
- Set the value of `DATABASE_URL` as an environment variable by entering this in the terminal: `export DATABASE_URL='copy-paste-value-in-here'` (mine looked like this `export DATABASE_URL='postgres://lkmlrinuazynlb:b94acaa351c0ecdaa7d60ce75f7ccaf40c2af646281bd5b1a2787c2eb5114be4@ec2-54-164-238-108.compute-1.amazonaws.com:5432/d1ef9avoe3r77f'`)

## Use Python code to update this new database

6. In the terminal, run `python` to open up an interactive session. Let's initialize a new database and add some dummy data in it using SQLAlchemy functions. Then type in these Python lines one by one:

```
>> from app import db
>> import models
>> db.create_all()
>> admin = models.Person(username='admin', score='250')
>> guest = models.Person(username='guest', score='99')
>> db.session.add(admin)
>> db.session.add(guest)
>> db.session.commit()
```

7. In your same `python` session, let's now make sure that data was added successfully by doing some queries.

```
>> models.Person.query.all()
[<Person u'admin'>, <Person u'guest'>] # output
>> models.Person.query.filter_by(username='admin').first()
<Person u'admin'> # output
```

8. Now let's make sure this was written to our Heroku remote database! Let's connect to it using: `heroku pg:psql`
9. `\d` to list all our tables. `person` should be in there now.
10. Now let's query the data with a SQL query (you will submit screenshots of the output in Canvas):

```
SELECT * FROM person;
```

```
SELECT email FROM person WHERE username='admin';
```

## Deploy to Heroku

1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

##

1. Controling user clicks on board: If I had more time and resources I would do more reasearch on how to allow first 2 users to control board 'X' or 'O' respectively and others as 'Spectator'.
2. Implementation of Database: On window close I cannot track which user have exited because I am not using a database. If I had database I would add a database which can track user info and can be updated live when user joins and exit.

## Technical Problems

1. Making LeadBoard
2. Making Restart button to emit empty Board to all users: I was trying to use setBoard function to make board empty by passing "Array(9).fill(null)" into the function. I was getting error for passing empty array in the setBoard function. After trying lots of diffrent techniques to make board restart I discoverd I just have to emit empty array dirrectly instead of calling setBoard.
3. I accidentally deleted 2 files while I wanted to remove untracked file from git status. I used "git cleane -f -X" which I found from google to delete untracked files but Google does not always help. This command deleted ".env.development.local" and "sql.env", second file was not important to me beacuse I have not used a database in my code. But first file was an important file which caused my webpage to give an "Invalid host header."message on webpage instead of showing my actual page.
