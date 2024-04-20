import React from "react"
import contactService from "./services/contacts";
import {useState,useEffect} from "react";
import './App.css';
const App = () => {
  const [phonelist,setphonelist] = useState([]);
  const [notify,setNotify] =useState(false);
  const [name,setName] = useState("")
  const [number,setNumber] = useState("")
  const [button,setbutton] = useState(false)
  const [Id,setId] = useState()
  const[content,setcontent] = useState("")
  const [message,setMessage] = useState("")
  const handleName = (event) => {
    setName(event.target.value)
  }
  const handleNumber = (event) => {
    setNumber(event.target.value)
  }

  useEffect(() => {
    console.log("useEffect");
    contactService.getAll().then(initialcontacts => 
      setphonelist(initialcontacts))
  }, []);
  const addInto = () => {
    const newcontact = {
      name: name, 
      number: number
    };
  
    if (name=="" || number=="") {
      setNotify(true);
      setcontent("Enter the details in the fields.");
      setTimeout(() => setNotify(false), 5000);
    } else {
      console.log(name, number);
      contactService.create(newcontact).then((newcontact) => {
        const exist = phonelist.some(
          (item) => item.name === newcontact.name || item.number === newcontact.number);
        if (!exist) {
          setphonelist(phonelist.concat(newcontact));
          setNotify(true);
          setMessage(`Successfully added ${newcontact.name}`);
          setTimeout(() => setNotify(false), 5000);
          setName("");
          setNumber("");
        } else {
          setNotify(true);
          setcontent("Number or phone number already exists.");
          setName("");
          setNumber("");
        }
      });
    }
  };
  
  const editInto = (id) => {
    console.log(id)
    const contact = phonelist.find(n => n.id == id )
    console.log(contact)
    setName(contact.name)
    setNumber(contact.number)
    setbutton(true)
    setId(id)
  }
  const editContact = () => {
    const econtact = phonelist.find(n => n.id == Id )
    const changedcontact = { ...econtact,name:name,number:number}
    contactService.update(Id,changedcontact).then( editedcontact  => 
      setphonelist(phonelist.map(n => n.id !=Id ? n : editedcontact)))
    setName("")
    setNumber("")
    setNotify(true)
    setMessage(`Succesfully edited the  ${changedcontact.name}`)
    setTimeout(() => setNotify(false), 5000);
    setbutton(false)
  }
  const deleteContact = (id) => {
    contactService.remove(id)
      .then(() => {
        return contactService.getAll();
      })
      .then(updatedContacts => {
        setphonelist(updatedContacts);
      })
      .catch(error => {
        console.error('Error deleting contact:', error);
      });
  };
  
  return (
    <>
    {notify ? <Notify message={message} content={content}/> : null }
    <h1>Phone Book</h1>
    <Filtercontacts contacts={phonelist} />
    <Addcontact addInto={addInto} handleName={handleName} handleNumber={handleNumber} name={name} number={number} button={button} />

    { button ? <button onClick={editContact}>Edit</button>  : null }
    <h2>Numbers</h2>
    <Phonebook list={phonelist} editInto={editInto} deleteContact={deleteContact}/>
    </>
  )
  }
export default App

const Notify = ({ message, content }) => {
  if (message == null) {
    return null;
  } else {
    return (
      <div className={`notify ${message === "" ? "content" : ""}`}>
        {message === "" ? content : message}
      </div>
    );
  }
};
const Edit = ({handleEdit}) => {
  return (
    <button onClick={handleEdit}>Edit</button>
  )
}
const Delete = ({handleDelete}) => {
  return (
    <button onClick={handleDelete}>Delete</button>
  )
}
const List = (props) => {
  const {list}= props
  return (
    <ul>
      {list.map((contact,index) => <li key={index}>{contact.name} --- {contact.number}</li>)}
    </ul>
  )
 }

const Filtercontacts = (props) => {
  const {contacts} = props
  const [searchlist,setsearchlist] = useState([]);
  const [searchTerm,setsearchTerm] = useState("")
  const onSearch = (event) => {
    event.preventDefault()

    const slist = (contacts.filter((contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase())))
    console.log(slist)
    setsearchlist(slist)
  }
const handleFilter = (e) => {
  setsearchTerm(e.target.value)
    }
  return (
    <>
      <form onSubmit={onSearch} >
        <h4>Filter contacts</h4>
        <input type="text" onChange={handleFilter} value={searchTerm} />
        <button type="submit">Submit</button>
      </form>
      <p>searching contacts for <strong>{searchTerm}</strong></p>
      <List list={searchlist}/>
    </>
  )
}
const Phonebook = ({ list, editInto, deleteContact }) => {
  const [check, setCheck] = useState({});

  const handleCheck = (id) => {
    console.log(check);
    setCheck(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleEditof = (id) => {
    editInto(id);
  };

  const handleDeleteof = (id) => {
    deleteContact(id);
  };

  return (
    <ul>
      {list.map((phone) => (
        <li key={phone.id}>
          <input
            type="checkbox"
            checked={check[phone.id] || false}
            onChange={() => handleCheck(phone.id)}
          />
          {phone.name} -- {phone.number}
          {check[phone.id] && <Edit handleEdit={() => handleEditof(phone.id)} />}
          {check[phone.id] && <Delete handleDelete={() => handleDeleteof(phone.id)} />}
        </li>
      ))}
    </ul>
  );
};
const Addcontact = (props) => {
  const handleAdd = (event) => {
    event.preventDefault()
    props.addInto()
  }
  return (
    <>
      <h2>Add contact</h2>
      <span>Name</span>
      <input type="text" onChange={props.handleName} value={props.name} placeholder="enter name" />
      <br/>
      <span>Number</span>
      <input type="text" onChange={props.handleNumber} value={props.number} placeholder="Add" />
      <br/>
      <button onClick={handleAdd}>Add</button>
    </>
  )
}
