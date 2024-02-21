from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# /// = relative path, //// = absolute path
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    complete = db.Column(db.Boolean)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "complete": self.complete,
        }

with app.app_context():
    db.create_all()

@app.route("/get-tasks", methods=["GET"])
def home():
    todo_list = Todo.query.all()
    todo_list_json = [todo.to_dict() for todo in todo_list]  # Convert each Todo object to a dictionary
    return {"todo_list": todo_list_json}



@app.route("/add-task", methods=["POST"])
def add():
    request_data = request.get_json()
    title = request_data["title"]
    new_todo = Todo(title=title, complete=False)
    db.session.add(new_todo)
    db.session.commit()
    return "OK"


@app.route("/update-task/<int:todo_id>", methods=["PUT"])
def update(todo_id):
    session = db.session
    todo = session.get(Todo, todo_id)
    todo.complete = not todo.complete
    db.session.commit()
    return "OK"


@app.route("/delete-task/<int:todo_id>", methods=["DELETE"])
def delete(todo_id):
    session = db.session
    todo = session.get(Todo, todo_id)
    if todo is None:  # Check if the todo item exists
        return "Todo item not found", 404
    session.delete(todo)
    session.commit()
    return "OK"
