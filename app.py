"""APP"""
import os
import operator
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv()) #This is to load your env Variables from .env

APP = Flask(__name__, static_folder='./build/static')
# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)
# IMPORTANT: This must be AFTER creating DB variable to prevent
# circular import issues
import models
DB.create_all()

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})
SOCKETIO = SocketIO(
    APP,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

activeUsersList = []
activeUsers = {}
@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """Index Function"""
    return send_from_directory('./build', filename)

def usersDictFunct():
    """usersDictFunct"""
    all_people = models.Person.query.all()
    users = {}
    for person in all_people:
        users[person.username] = person.score
    # print(users)
    return users

# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    """on_connect"""
    print('User connected!')
    users = usersDictFunct()
    users = dict(sorted(users.items(), key=operator.itemgetter(1), reverse=True))
    print('sorted dict: ' + str(users))

# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    """on_disconnect"""
    print('User disconnected!')
# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@SOCKETIO.on('chat')
def on_chat(data): # data is whatever arg you pass in your emit call on client
    """on_chat"""
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('chat', data, broadcast=True, include_self=False)

@SOCKETIO.on('send_message')
def handle_send_message_event(data):
    """handle_send_message_event"""
    print("{} has sent message: {}".format(data['username'], data['message']))
    SOCKETIO.emit('receive_message', data)
    return data['username'] + " " + data['message']
# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided

@SOCKETIO.on('join_room')
def handle_join_room_event(data):
    """handle_join_room_event"""
    users = add_user(data)
    # To sort dictionary in desending order
    users1 = dict(sorted(users.items(), key=operator.itemgetter(1), reverse=True))
    print('sorted dict: ' + str(users1))
    SOCKETIO.emit('user_list', users1, broadcast=True, include_self=True)
    #adding new joined user to the active list and broadcasting join msg
    activeUsersList.append(data['username'])
    print("{} has joined the room".format(data['username']))
    SOCKETIO.emit('join_room_announcement', data, broadcast=True, include_self=False)
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    activeUsers['username'] = activeUsersList
    print(activeUsers['username'])
    data = activeUsers['username']
    print(data)
    print('Active User List Python: ', activeUsersList)
    SOCKETIO.emit('active_user_list', data, broadcast=True, include_self=True)

def add_user(data):
    """add_user"""
    #adding new joined user to the DB
    users = usersDictFunct()
    if data['username'] not in users:
        new_user = models.Person(username=data['username'], score=100)
        DB.session.add(new_user)
        DB.session.commit()
        users[data['username']] = 100
    return users

@SOCKETIO.on('leave_room')
def handle_leave_room_event(data):
    """handle_leave_room_event"""
    # print(data)
    print("{} has left the room.".format(data['username']))
    SOCKETIO.emit('leave_room_announcement', data, broadcast=True, include_self=False)
    activeUsersList.remove(data['username'])
    activeUsers['username'] = activeUsersList
    print(activeUsers['username'])
    data = activeUsers['username']
    # print(data)
    print('Updated Active User List Python: ', activeUsersList)
    SOCKETIO.emit('active_user_list', data, broadcast=True, include_self=True)
    return data

@SOCKETIO.on('board')
def on_board(data): # data is whatever arg you pass in your emit call on client
    """on_board"""
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('board', data, broadcast=True, include_self=True)

def winnerFoundUpdateDB(data):
    """winnerFoundUpdateDB"""
    if data['winner'] == None:
        print(' ')
    elif data['winner'] == 'X':
        winner = DB.session.query(models.Person).filter_by(username=data['X_player']).first()
        loser = DB.session.query(models.Person).filter_by(username=data['O_player']).first()
        winner.score += 1
        loser.score -= 1
        DB.session.commit()
        return [winner.score, loser.score]
    elif data['winner'] == 'O':
        winner = DB.session.query(models.Person).filter_by(username=data['O_player']).first()
        loser = DB.session.query(models.Person).filter_by(username=data['X_player']).first()
        winner.score += 1
        loser.score -= 1
        DB.session.commit()

@SOCKETIO.on('winnerFound')
def on_win(data): # data is whatever arg you pass in your emit call on client
    """on_win"""
    print('============================================================')
    print(data)
    winnerFoundUpdateDB(data)
    users = usersDictFunct()
    # To sort dictionary in desending order
    users1 = dict(sorted(users.items(), key=operator.itemgetter(1), reverse=True))
    print('sorted dict: ' + str(users1))
    SOCKETIO.emit('user_list', users1, broadcast=True, include_self=True)
    return users1

# Note we need to add this line so we can import APP in the python shell
if __name__ == "__main__":
# Note that we don't call APP.run anymore. We call SOCKETIO.run with APP arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
    