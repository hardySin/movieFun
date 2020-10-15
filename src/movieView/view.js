import React, { Component } from 'react';
import {Row,Col} from 'react-bootstrap';
import Upcoming from '../upcomingmoives/upcoming';


export default function view()
{
    return (<>
        <Row>
        <Col  sm={12}><Upcoming></Upcoming> </Col>
         </Row>
        </>)
}

 
