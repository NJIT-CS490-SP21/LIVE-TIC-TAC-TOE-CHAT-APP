import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
import app
import models

username = "username"
message = "message"
KEY_EXPECTED = "expected"
data = {}

INITIAL_USERNAME = 'user1'

class AddUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                username: 'Jack',
                KEY_EXPECTED: {INITIAL_USERNAME: 300, 'Jack': 100},
            },
            {
                username: 'Ruby',
                KEY_EXPECTED: {INITIAL_USERNAME: 300, 'Jack': 100, 'Ruby': 100},
            },
            {
                username: 'Matt',
                KEY_EXPECTED: {INITIAL_USERNAME: 300, 'Jack': 100, 'Ruby': 100, 'Matt': 100},
            },
            {
                username: 'CarryMinatti',
                KEY_EXPECTED: {INITIAL_USERNAME: 300, 'Jack': 100, 'Ruby': 100, 'Matt': 100, 'CarryMinatti': 100},
            },
        ]
        self.success_test_handle_send_message_event = [
            {
                username: 'Jack', 
                message: 'Hello there!',
                KEY_EXPECTED: 'Jack Hello there!',
            },
            {
                username: 'Ruby', 
                message: 'Hello there!',
                KEY_EXPECTED: 'Ruby Hello there!',
            },
            {
                username: 'Ram', 
                message: 'Hello there!',
                KEY_EXPECTED: 'Ram Hello there!',
            },
            {
                username: 'CarryMinatti', 
                message: 'Hello there!',
                KEY_EXPECTED: 'CarryMinatti Hello there!',
            },
        ]
        self.success_test_handle_leave_room_event = [
            {
                username: 'Jack', 
                KEY_EXPECTED: ['user1', 'Ruby', 'Matt', 'CarryMinatti'],
            },
            {
                username: 'Ruby', 
                KEY_EXPECTED: ['user1', 'Matt', 'CarryMinatti'],
            },
            {
                username: 'Matt', 
                KEY_EXPECTED: ['user1', 'CarryMinatti'],
            },
            {
                username: 'CarryMinatti', 
                KEY_EXPECTED: ['user1'],
            },
        ]
        
        initial_person = models.Person(username=INITIAL_USERNAME, score=300)
        self.initial_db_mock = [initial_person]
        self.initial_activeUserList_mock = ['user1', 'Jack', 'Ruby', 'Matt', 'CarryMinatti']
    def mocked_db_session_add(self, username):
        self.initial_db_mock.append(username)
    
    def mocked_db_session_commit(self):
        pass
    
    def mocked_person_query_all(self):
        return self.initial_db_mock
        
    def mocked_activeUserList_session_remove(self, username):
        self.initial_activeUserList_mock.remove(username)
    
    def test_success(self):
        # testing add_user
        for test in self.success_test_params:
            with patch('models.Person.query') as mocked_query:
                mocked_query.all = self.mocked_person_query_all
                with patch('app.db.session.add', self.mocked_db_session_add):
                    with patch('app.db.session.commit', self.mocked_db_session_commit):
        
                            # print(self.initial_db_mock)
                            actual_result = app.add_user(test)
                            # print(actual_result)
                            expected_result = test[KEY_EXPECTED]
                            # print(self.initial_db_mock)
                            # print(expected_result)
                            
                            self.assertEqual(len(actual_result), len(expected_result))
                            self.assertEqual(actual_result, expected_result)
                            self.assertEqual(actual_result['Jack'], expected_result['Jack'])
                            # print(self.initial_db_mock)
                            
    @mock.patch("app.socketio")
    def test_handle_send_message_event(self, mocked_socket_message):
        for test in self.success_test_handle_send_message_event:
            # print(test[message])
            actual_result = app.handle_send_message_event(test)
            # print(actual_result)
            expected_result = test[KEY_EXPECTED]
            mocked_socket_message = expected_result
            
            self.assertEqual(len(actual_result), len(expected_result))
            self.assertEqual(actual_result, expected_result)
            self.assertAlmostEqual(len(actual_result), len(expected_result))
    
    @mock.patch("app.socketio")
    def test_handle_leave_room_event(self, mocked_socket_username):
        for test in self.success_test_handle_leave_room_event:
            with patch('app.activeUsersList') as mocked_list:
                mocked_list.remove = self.mocked_activeUserList_session_remove
                with patch('app.activeUsersList', self.initial_activeUserList_mock):
                
                    # print(test[username])
                    actual_result = app.handle_leave_room_event(test)
                    # print('actual_result: ' , actual_result)
                    expected_result = test[KEY_EXPECTED]
                    mocked_socket_username = expected_result
                    # print('expected_result' , expected_result)
                    
                    self.assertEqual(len(actual_result), len(expected_result))
                    self.assertEqual(actual_result, expected_result)
                    self.assertAlmostEqual(len(actual_result), len(expected_result))
                    # print(self.initial_db_mock)
                
if __name__ == '__main__':
    unittest.main()