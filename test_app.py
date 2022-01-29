from unittest import TestCase
from app import app, games
from flask import json

# Make Flask errors be real errors, not HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class BoggleAppTestCase(TestCase):
    """Test flask app of Boggle."""

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_homepage(self):
        """Make sure information is in the session and HTML is displayed"""

        with self.client as client:
            response = client.get('/')
            html = response.get_data(as_text=True)

            self.assertEqual(response.status_code, 200)
            #look for unique to endpoint
            self.assertIn("<title>Boggle</title>", html)
            # test that you're getting a template

    def test_api_new_game(self):
        """Test starting a new game."""

        with self.client as client:
            response = client.post('/api/new-game')

            data = response.get_json()

            self.assertIsInstance(data["game_id"], str)
            self.assertIsInstance(data["board"], list)
            # write a test for this route

    def test_score_word(self):
        """Test the case of not a word, not on board, or OK"""

        with self.client as client:
            game_id = client.post('/api/new-game').get_json()["game_id"]
            game = games[game_id]
            count = 0
            while(count < 5):
                game.board[count] = ["C","A","T","X","X"]
                count += 1
            response = client.post(
                '/api/score-word',
                json = {"game_id": game_id, "word": "CAT"})
            self.assertEqual(response.get_json(), {"result" : "ok"})
                
            response = client.post(
                '/api/score-word',
                json = {"game_id": game_id, "word": "DOG"})    
            self.assertEqual(response.get_json(), {"result": "not-on-board"})

            response = client.post(
                '/api/score-word',
                json = {"game_id": game_id, "word": "XYZ"})
            self.assertEqual(response.get_json(), {"result" : "not-word"})

