import axios from 'axios';
import {useState,useEffect} from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

const App = () => {
  
  const [data,setData] = useState([])
  const [name,setName] = useState('')
  const [age,setAge] = useState(1)

  const [nameEdit,setNameEdit] = useState('')
  const [ageEdit,setAgeEdit] = useState(1)
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (id) => setShow(id);

  const handleGenerateData = (e) => {
    e.preventDefault();
      axios({
        method: 'post',
        url: 'http://localhost:7777/employee',
        data: {
          name: name,
          age: parseInt(age)
        }
      })
      .then(function (response) {
        setName('')
        setAge(1)
          axios({
            method: 'get',
            url: 'http://localhost:7777/employee', 
          })
          .then(function (response) {
            setData(response.data.data)
          })
      })
  }

  const handleEdit = () => {
    console.log(show);
    axios({
      method: 'put',
      url: `http://localhost:7777/employee/${show}`,
      data: {
        name: nameEdit,
        age: parseInt(ageEdit)
      }
    })
    .then(function (response) {
      handleClose()
      setNameEdit('')
      setAgeEdit(1)
        axios({
          method: 'get',
          url: 'http://localhost:7777/employee', 
        })
        .then(function (response) {
          setData(response.data.data)
        })
    })
  }

  const handleDelete = (id) => {
    if(window.confirm(`Are you sure delete this ID ${id}?`)){
      axios({
        method: 'post',
        url: `http://localhost:7777/employee/delete/${id}`,
      })
      .then(function (response){
        axios({
          method: 'get',
          url: 'http://localhost:7777/employee', 
        })
        .then(function (response) {
          setData(response.data.data)
        })
      })
    }
  }

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:7777/employee',
      })
      .then(function (response) {
        console.log(response.data.data)
        setData(response.data.data)
    })
  },[])


  return (
    <>
    <p>Name</p>
    <input value={name} placeholder='Enter Name' type='text' onChange={(e)=>setName(e.target.value)}></input>
    <p>Age</p>
    <input value={age} placeholder='Enter Age' type='number' onChange={(e)=>setAge(e.target.value)}></input><br/><br/>
    <Button onClick={handleGenerateData}>Input Data | Now : {data.length}</Button>
    {data.map((item, index) => {
      return (
        <ul key={index}>
          <p>{item.id}</p>
          <li>
            {item.name}
          </li>
          <li>
            {item.age}
          </li>
          <Button variant="success" onClick={() => handleShow(item.id)}>Edit</Button>-
          <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
        </ul>
      )
    })}

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Name</p>
          <input value={nameEdit} placeholder='Enter Name' type='text' onChange={(e)=>setNameEdit(e.target.value)}></input>
          <p>Age</p>
          <input value={ageEdit} placeholder='Enter Age' type='number' onChange={(e)=>setAgeEdit(e.target.value)}></input><br/><br/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
    </Modal>
    </>  
  );
}

export default App;