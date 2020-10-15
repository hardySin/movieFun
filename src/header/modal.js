import React, { useState} from 'react';
import {Modal,Button,Form , } from 'react-bootstrap';
import firebase from '../firebase';
import Popup from '../header/alert';

   
  function MyModal(props) {
    const [modalShow, setModalShow] =useState(false);
    const[account,setAccount]=useState({email:"",password:""});
    const[loginerror,setloginerror]=useState(false);
    const[errormess,seterrormess]=useState("");
    const[showPass,setshowPass]=useState(false);

    const changeHandler = e => {
      setAccount({...account, [e.target.name]: e.target.value})
  }
   
 const login=()=>
  {
    try {
      let val= firebase.login(account.email,account.password)
     } catch (error) {
       let e=error
       console.log("error",e)
      seterrormess(e.message)  
      setloginerror(true)
    }
    
   }

   const toggle=()=>
   {
     if(!showPass)
     {
      setshowPass(true)
      }
      else{
        setshowPass(false)
       }
     }
    return (
       <>
        <a   className="login" onClick={() => setModalShow(true)}  >Sign In </a>
       <MyVerticallyCenteredModal
        show={modalShow}
        login={login}
        loginerror={loginerror}
        errormess={errormess}
        changeHandler={changeHandler}
        onHide={() => setModalShow(false)}
        toggle={toggle}
        showPass={showPass}
      />
       </>
    );
  }
  

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
        
        <Form>
        <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" name="email" onChange={props.changeHandler}/>
        <Form.Text className="text-muted">
             We'll never share your email with anyone else.
        </Form.Text>
        </Form.Group>
        
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type={!props.showPass?"password":"text"} placeholder="Password" name="password" onChange={props.changeHandler} />
        </Form.Group>
     
        <Form.Group controlId="formBasicCheckbox">
           <Form.Check type="checkbox" onChange={props.toggle} label="Show Password" />
        </Form.Group>
         <Button  onClick={props.login} style={{width:"100%"}} variant="dark" type="button">
          Login
        </Button>
      </Form>
      {props.loginerror?<Popup titleName={props.errormess} state={props.loginerror}></Popup>:""}
        </Modal.Body>
       </Modal>
    );
  }


  export  default MyModal;