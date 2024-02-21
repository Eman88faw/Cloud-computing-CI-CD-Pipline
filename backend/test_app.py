import unittest
from flask_testing import TestCase
from app import app, db, Todo

class TestFlaskApp(TestCase):

    def create_app(self):
        # Configure the app for testing
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_db.sqlite'
        return app

    def setUp(self):
        # Set up test database
        db.create_all()

    def tearDown(self):
        # Tear down database
        db.session.remove()
        db.drop_all()

    def test_home_route(self):
        # Test home route
        response = self.client.get('/get-tasks')
        self.assertEqual(response.status_code, 200)

    def test_add_todo(self):
        # Test adding a new todo item
        self.client.post('/add-task', json={'title': 'Test Todo'})
        todo = Todo.query.first()
        self.assertIsNotNone(todo)
        self.assertEqual(todo.title, 'Test Todo')

    def test_update_todo(self):
        # Test updating a todo item
        todo = Todo(title='Test Todo', complete=False)
        db.session.add(todo)
        db.session.commit()

        self.client.put(f'/update-task/{todo.id}')
        updated_todo = db.session.get(Todo, todo.id)  # Use session.get() method
        self.assertTrue(updated_todo.complete)


if __name__ == '__main__':
    unittest.main()