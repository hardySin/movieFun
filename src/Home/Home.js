import React, {  useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../firebase';
import {Row,Col} from 'react-bootstrap';
import Account from  '../createAccount/createLogin';
import Upcoming from '../upcomingmoives/upcoming';
import Header from '../header/header';
import Footer from '../footer/footer';

function Home(props) {
let history=useHistory();
function userCheck()
{
           firebase.auth.onAuthStateChanged((res)=>
        {
                if(res)
             { 
                console.log("uid ",res.uid);
                history.push("/viewMovies");
             }
             else
             {

                console.log("on home.js"+history);
                history.push("/");
              }
        })
     
 }
useEffect(()=>
{
    userCheck()
},[])
    return ( 
       <span className="holder">
        <Header  ></Header>
        <Row>
        <Col  sm={6}><Upcoming></Upcoming> </Col>
        <Col  sm={6}><Account ></Account></Col>
        </Row>
         
        <Footer></Footer>
 
         </span>
     );
 }

export default Home;