import unittest
import os
import sys
sys.path.append(os.path.abspath('../../'))
import app

winner = "winner"
username = "username"
message = "message"
X_player = 'X_player'
O_player = 'O_player'
KEY_EXPECTED = "expected"
    
class unmockedTest(unittest.TestCase):
    def setUp(self):
        self.success_test_winnerFoundUpdateDB_success = [
            {
                winner: 'X',
                X_player: 'Naman',
                O_player: 'Anshul',
                KEY_EXPECTED: [ 194, 63],
            },
            {
                winner: 'X',
                X_player: 'Anshul',
                O_player: 'Akul',
                KEY_EXPECTED: [ 62, 942],
            },
            {
                winner: 'X',
                X_player: 'Akul',
                O_player: 'Naman',
                KEY_EXPECTED: [ 941, 195],
            },
            # TODO add another
        ]
        self.success_test_on_win_success = [
            {
                winner: 'X',
                X_player: 'Naman',
                O_player: 'Anshul',
                KEY_EXPECTED: {'Akul': 942, 'Naman': 195, 'Anshul': 62},
            },
            {
                winner: 'X',
                X_player: 'Anshul',
                O_player: 'Akul',
                KEY_EXPECTED: {'Akul': 941, 'Naman': 195, 'Anshul': 63},
            },
            {
                winner: 'X',
                X_player: 'Akul',
                O_player: 'Naman',
                KEY_EXPECTED: {'Akul': 942, 'Naman': 194, 'Anshul': 63},
            },
            # TODO add another
        ]
        self.success_usersDictFunct_success = [
            {
                KEY_EXPECTED: {'Akul': 956, 'Naman"s': 168, 'Anshul': 75},
            },
            {
                KEY_EXPECTED: {'Akul': 956, 'Naman': 168, 'Anshul"s': 75},
            },
            {
                KEY_EXPECTED: {'Akul': 956, 'Naman"s': 168, 'Anshul': 75},
            },
            # TODO add another
        ]


    def test_winnerFoundUpdateDB_success(self):
        for test in self.success_test_winnerFoundUpdateDB_success:
            actual_result = app.winnerFoundUpdateDB(test)
            # print('actual_result: ' , actual_result)
            
            expected_result = test[KEY_EXPECTED]
            # print('expected_result: ' , expected_result)
            self.assertEqual(len(actual_result), len(expected_result))
            self.assertGreater(actual_result[0], expected_result[0])
            self.assertLess(actual_result[1], expected_result[1])
            
    def test_on_win(self):
        for test in self.success_test_on_win_success:
            actual_result = app.on_win(test)
            # print('actual_result: ' , actual_result)
            expected_result = test[KEY_EXPECTED]
            # print('expected_result: ' , expected_result)
            self.assertNotEqual(len(actual_result), len(expected_result))
            self.assertEqual(actual_result['Naman'], expected_result['Naman'])
            self.assertEqual(actual_result['Akul'], expected_result['Akul'])
    
    def test_usersDictFunct(self):
        for test in self.success_usersDictFunct_success:
            actual_result = app.usersDictFunct()
            # print('actual_result: ' , actual_result)
            expected_result = test[KEY_EXPECTED]
            # print('expected_result: ' , expected_result)
            self.assertNotEqual(len(actual_result), len(expected_result))
            self.assertNotEqual(actual_result['x1'], expected_result['Akul'])
            self.assertLess(actual_result['x1'], expected_result['Akul'])

if __name__ == '__main__':
    unittest.main()