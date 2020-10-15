import React, {  } from 'react';
import '../header/header.css';
import {Row,Col } from 'react-bootstrap';
import Modal from '../header/modal'
import firebase from '../firebase';
import '../header/loginHeader.css';
import { useHistory} from 'react-router-dom';

function LoginHeader(props) 
{
    let history=useHistory();

    function logout()
    {
      console.log("logout here");
      firebase.logout();
      history.push('/');
     }

    return (
   <Row   className="header"  >
        <Col  sm={6}><h4 className="title"  > {props.name}</h4></Col>
        <Col  sm={6}><a  className="logout"   onClick={logout} >Sign Out </a></Col>
  </Row>
      );
  }
  
  export default LoginHeader;