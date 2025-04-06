import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form  from 'react-bootstrap/Form';
import { host } from '../config';

function EditTodo({showEdit, selectedTodo, setShowEdit, setTodos, todos}) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(selectedTodo.title)
  const [description, setDescription] = useState(selectedTodo.description)
  const [dueTime, setDueTime] = useState(selectedTodo.dueTime)

  const handleClose = () => setShowEdit(false);

  const updateDate = async (event) => {
    event.preventDefault()
    selectedTodo.title = title;
    selectedTodo.dueTime = dueTime;
    selectedTodo.description = description;
  }

  useEffect(() => {
    setTitle(selectedTodo.title);
    setDescription(selectedTodo.description);
    setDueTime(selectedTodo.dueTime);
    
  }, [selectedTodo])


  const updateStatus = async (e) => {
    e.preventDefault()
    selectedTodo.title = title
    selectedTodo.description = description
    selectedTodo.dueTime = dueTime

    const url = `${host}/api/todos/${selectedTodo.id}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedTodo),
    });

    if (!res.ok) {
      alert('Could not updateTodo todo');
      return;
    }


    setTodos(todos.map(todo => 
      todo.id === selectedTodo.id ? selectedTodo : todo
    ))
    alert("Updated")
    setShowEdit(false)

  }


  return (
    <>
      <Modal
        show={showEdit}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form  onSubmit={updateStatus}>
      <Form.Group className="mb-3" controlId="formBasicEmail" >
        <Form.Label>Title</Form.Label>
        <Form.Control as="textarea" rows={2} value={title} onChange={(val) => {
          setTitle(val.target.value)
        }}  />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={10} value={description} onChange={(val => setDescription(val.target.value))} />
      </Form.Group>

      <Form.Group className='mb-3' controlId='formBasicDateTime'>
          <Form.Label>Due Date</Form.Label>
          <Form.Control type='datetime-local' value={dueTime} onChange={val => setDueTime(val.target.value)}/>
      </Form.Group>

      <Button variant="primary" type="submit">
        Update
      </Button>
    </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export {EditTodo};