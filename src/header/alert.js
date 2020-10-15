import React, {  } from 'react';
import {Alert} from 'react-bootstrap';


const Popup=(props)=> {
    if(props.state)
    {
        return  <Alert variant="danger">
        {props.titleName}
      </Alert>

    }
    return null;
  }

export default Popup;
