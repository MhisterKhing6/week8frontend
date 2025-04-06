import { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { EditTodo } from './components/EditComponent'
import { FaEdit } from "react-icons/fa";
import  Button from 'react-bootstrap/Button';
import { FaDeleteLeft } from 'react-icons/fa6';
import { host } from './config';
import { Spinner } from 'react-bootstrap';

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('pending')
  const [dueTime, setDueTime] = useState('')
  const [selectedTodo, setSelectedTodo] = useState('')
  const [showEdit, setShowEdit] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [addTask, setAddTask] = useState(false)

  const addTodo = async (e) => {
    e.preventDefault();
    setAddTask(true)
    const newTodo = {
      title,
      description,
      status,
      dueTime: new Date(dueTime).toISOString(),
    };
  
    try {
      const url = `${host}/api/todos`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
  
      if (!res.ok) {
        alert('Could not add todo');
        setAddTask(false)
        return;
      }
  
      const data = await res.json();
  
      setTodos([...todos, data]); // use response data instead of original newTodo
      setTitle('');
      setDescription('');
      setStatus('pending');
      setDueTime('');
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Could not add todo');
    }

    setAddTask(false)
  };
  


  const deleteTodo = async (id) => {
    setDeleting(true)
    try {
      const res = await fetch(`${host}/api/todos/${id}`, { method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }});
      if (res.status !== 204) {
        alert("Couldn't delete todo")
        setDeleting(false)
        return;
      }
      
      setTodos(todos.filter(todo => todo.id !== id))
    }catch(err){
      console.log(err)
    }
    setDeleting(false)
  };

    
  

  const updateStatus = async (id, newStatus) => {
    let todo = todos.filter((todo) => todo.id === id)
    todo[0].status = newStatus;
    
    const url = `${host}/api/todos/${id}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo[0]),
    });

    if (!res.ok) {
      alert('Could not updateTodo todo');
      return;
    }

    setTodos(todos.map(newTodo => 
      newTodo.id === id ? { ...newTodo, status: newStatus } : newTodo
    ))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#eab308'
      case 'in-progress':
        return '#3b82f6'
      case 'completed':
        return '#22c55e'
      default:
        return '#94a3b8'
    }
  }

  const showEditTodo= (todo) => {
    setSelectedTodo(todo)
    setShowEdit(true)
  }


  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`${host}/api/todos`);
        if (!res.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await res.json();
        setTodos(data); // assuming data is an array of todos
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
  
    fetchTodos();
  }, []);
  
  return (
    <div className="todo-container">
      <h1>Week8 Todo App</h1>
    
      <form onSubmit={addTodo} className="todo-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Due Time</label>
          <input
            type="datetime-local"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            required
          />
        </div>

        <Button  disabled={addTask} type="submit">
          {!addTask ? 'Add Task' : <Spinner />}
        </Button>
      </form>

      <div className="todo-list">
      <EditTodo  showEdit={showEdit} setShowEdit={setShowEdit} selectedTodo={selectedTodo} setTodos={setTodos} todos={todos} />
        {todos.map(todo => (
          <div key={todo.id} className="todo-item">
          
         
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Due: {new Date(todo.dueTime).toLocaleString()}
            </p>
            <div 
              className="status-badge" 
              style={{ 
                backgroundColor: `${getStatusColor(todo.status)}15`,
                color: getStatusColor(todo.status)
              }}
            >
              {todo.status}
            </div>
              
             
              
            
              <div className="p-2 action d-flex">
              <select
                value={todo.status}
                onChange={(e) => updateStatus(todo.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              </div>

         
              <Button variant="primary " onClick={()=> showEditTodo(todo)}><FaEdit /></Button>
              <Button disabled={deleting} variant="dark mx-1" onClick={() => deleteTodo(todo.id)} >{!deleting ?<FaDeleteLeft />: <Spinner />}</Button>  


            </div>
        ))}
      </div>
    </div>
  )
}

export default App