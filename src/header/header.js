import React, {  } from 'react';
import '../header/header.css';
import {Row,Col } from 'react-bootstrap';
import Modal from '../header/modal'

function Header(props) {
    return (
   <Row   className="header"  >
    <Col  sm={4 }> <span className="mylogo"> </span></Col>
    <Col  sm={4}><h1 className="title">Movie Spot</h1></Col>
    <Col  sm={4}><Modal ></Modal></Col>
  </Row>
      );
  }
  
  export default Header;