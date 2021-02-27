import os
from flask import Flask, send_from_directory, json, session, request
from flask_socketio import SocketIO, join_room, leave_room
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)
usersList = []
@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')

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
    socketio.emit('chat',  data, broadcast=True, include_self=False)

@socketio.on('send_message')
def handle_send_message_event(data):
    print("{} has sent message: {}".format(data['username'], data['message']))
    socketio.emit('receive_message', data)
    
# # When a client emits the event 'chat' to the server, this function is run
# # 'chat' is a custom event name that we just decided
@socketio.on('join_room')
def handle_join_room_event(data):
    usersList.append(data['username'])
    print("{} has joined the room".format(data['username']))
    socketio.emit('join_room_announcement', data, broadcast=True, include_self=False)
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('user_list',  data, broadcast=True, include_self=True)
    


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
    socketio.emit('board',  data, broadcast=True, include_self=True)

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)