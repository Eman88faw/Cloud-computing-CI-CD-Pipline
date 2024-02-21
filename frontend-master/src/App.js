import { useEffect, useRef, useState } from "react";
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const inputRef = useRef();

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://10.100.8.142:5000/get-tasks');
      if (response.ok) {
        const data = await response.json();
        setTodos(data['todo_list'] || []);
      } else {
        console.error("Failed to fetch todos");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    const text = inputRef.current.value;
    if (text) {
      const newItem = { completed: false, title: text };
      try {
        const response = await fetch('http://10.100.8.142:5000/add-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: text }),
        });
        if (response.ok) {
          setTodos([...todos, newItem]);
          inputRef.current.value = '';
        } else {
          console.error("Failed to add item");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleItemDone = (index) => {
    const newTodos = [...todos];
    updateTask(newTodos[index]);
    newTodos[index].complete = !newTodos[index].complete;
    setTodos(newTodos);
    // Update task in the backend
  };

  const handleDeleteTodo = async (index) => {
    const itemToDelete = todos[index];
    try {
      const response = await fetch(`http://10.100.8.142:5000/delete-task/${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const remainingTodos = todos.filter((_, i) => i !== index);
        setTodos(remainingTodos);
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateTask = async (task) => {
    try {
      const response = await fetch(`http://10.100.8.142:5000/update-task/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: task.completed }),
      });
      if (!response.ok) {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <h2>To Do List</h2>
      <div className="to-do-container">
        <input ref={inputRef} placeholder="Enter item..." />
        <button onClick={handleAddTodo}>Addieren</button>
        <ul>
          {todos.map((item, index) => (

            <li key={index} className={item.complete ? 'done' : ''}>
              {item.title}
              <button onClick={() => handleItemDone(index)}>Done</button>
              <button onClick={() => handleDeleteTodo(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
