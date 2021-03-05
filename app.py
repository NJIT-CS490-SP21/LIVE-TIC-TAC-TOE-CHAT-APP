import os
from flask import Flask, send_from_directory, json, session, request
from flask_socketio import SocketIO, join_room, leave_room
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv()) #This is to load your env Variables from .env

app = Flask(__name__, static_folder='./build/static')
# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models
db.create_all()

cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

activeUsersList = []
activeUsers = {}
@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')
    all_people = models.Person.query.all()
    users = []
    for person in all_people:
        users.append(person.username)
    print(users)
    socketio.emit('user_list', {'users': [users]})

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')
# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('chat')
def on_chat(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('chat', data, broadcast=True, include_self=False)

@socketio.on('send_message')
def handle_send_message_event(data):
    print("{} has sent message: {}".format(data['username'], data['message']))
    socketio.emit('receive_message', data)
# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('join_room')
def handle_join_room_event(data):
    #adding new joined user to the db
    new_user = models.Person(username=data['username'], score=100)
    print(new_user)
    all_people = models.Person.query.all()
    users = []
    for person in all_people:
        users.append(person.username)
    if data['username'] not in users:
        db.session.add(new_user)
        db.session.commit()
        users.append(data['username'])
        db.session.close()
    print(users)
    socketio.emit('user_list', {'users': [users]})
    #adding new joined user to the active list and broadcasting join msg
    activeUsersList.append(data['username'])
    print("{} has joined the room".format(data['username']))
    socketio.emit('join_room_announcement', data, broadcast=True, include_self=False)
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    activeUsers['username'] = activeUsersList
    print(activeUsers['username'])
    data = activeUsers['username']
    print(data)
    print('Active User List Python: ', activeUsersList)
    socketio.emit('active_user_list', data, broadcast=True, include_self=True)
    return None

@socketio.on('leave_room')
def handle_leave_room_event(data):
    print(data)
    print("{} has left the room.".format(data['username']))
    socketio.emit('leave_room_announcement', data, broadcast=True, include_self=False)

@socketio.on('board')
def on_board(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('board', data, broadcast=True, include_self=True)

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
# Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
    