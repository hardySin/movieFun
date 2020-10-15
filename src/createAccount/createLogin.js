import React, { useState } from 'react';
import '../createAccount/create.css';
import {Form,Button} from 'react-bootstrap';
import Popup from '../header/alert';
import firebase from '../firebase';
import Loader from '../loader/Loader';
import { useHistory } from 'react-router-dom';

 
function Account(props) {
  const[account,setAccount]=useState({name:"",email:"",password:""});
  const[pass,confirmPass]=useState();
  const[state,setstate]=useState(false);
  const[loader,setloader]=useState(false);
  const[autherror,setautherror]=useState(false);
  const[mess,setmess]=useState("");
  let history=useHistory();
  let weakPassword;
    const changeHandler = e => {
    setAccount({...account, [e.target.name]: e.target.value})
}
 
  async function update(e)
  {
    e.preventDefault()
     if(account.email!==""& account.password!=="")
      {
        setstate(false)
        setloader(true);
        setautherror(false);
         try
        {
         let val= await firebase.register(account.email,account.password)
         history.push("/viewMovies")
          }
        catch(error)
        {
          setmess(error.message);
          setautherror(true);
          setloader(false);
          console.log(error);
        }
       }
      else
      {
        setstate(true)
      } 
  
  }
  return (
        <div className="accContainer"> 
       
        <h2 className="Acctitle">Create your Account</h2>
        <hr className="line"/>
      
        <Form className="account" >
        
        <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" name="email"    onChange={changeHandler} />
        <Form.Text className="text-muted">
            We'll never share your email with anyone else.
        </Form.Text>
        </Form.Group>
        
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password"  name="password"  onChange={changeHandler} />
        </Form.Group>
    
        <Form.Group controlId="confirmPass">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password"  onChange={e=>confirmPass(e.target.value)} placeholder="Confirm Password" />
        </Form.Group>
        

        <Button onClick={update} style={{width:"100%"}}   disabled={account.password===pass?false:true} variant="dark">
          Create Account
        </Button>
      </Form>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {state?<Popup titleName="Please fill all Fields" state={state}></Popup>:""}
      {loader?<Loader state={loader}></Loader>:""}
      {autherror?<Popup titleName={mess} state={autherror}></Popup>:""}
        </div>
      );
  }
  
  export default Account;