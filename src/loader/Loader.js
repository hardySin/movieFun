import React, { Component } from 'react';
import {Spinner} from 'react-bootstrap';

class Loader extends Component
{
    

    render()
    {
        if(this.props.state)
        {
            return(
            
                <center>
                   <Spinner animation="grow" variant="primary" />&nbsp;&nbsp;&nbsp;&nbsp;
                   <Spinner animation="grow" variant="secondary" />&nbsp;&nbsp;&nbsp;&nbsp;
                   <Spinner animation="grow" variant="success" />&nbsp;&nbsp;&nbsp;&nbsp;
                   <Spinner animation="grow" variant="danger" />&nbsp;&nbsp;&nbsp;&nbsp;
                   <Spinner animation="grow" variant="warning" />&nbsp;&nbsp;&nbsp;&nbsp;
                   <Spinner animation="grow" variant="info" />&nbsp;&nbsp;&nbsp;&nbsp;
                   <Spinner animation="grow" variant="primary" />&nbsp;&nbsp;&nbsp;&nbsp;
                   <Spinner animation="grow" variant="dark" />
               </center>
           );   
        }
      return(<></>);
    }
}

export default Loader;