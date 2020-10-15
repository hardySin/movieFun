import React, { useState,useEffect} from 'react';
  import firebase from '../firebase';
  import { useHistory } from 'react-router-dom';
  import Modal from '../header/modal';
   
  function Check(props) { 
   const[loginStatus,setloginStatus]=useState(true);
   let history = window.$history;

    function userCheck()
{
       firebase.auth.onAuthStateChanged((res)=>
    {
            if(res)
         { 
           console.log("res value ",res)
          setloginStatus(false)
          }
          else
          {
             console.log("redirect main ",history);
            history.push('/');
           }
          })
  }

function logout()
{
  setloginStatus(true)

  console.log("logout here");
  firebase.logout();
  history.push('/')
 }

useEffect(()=>
{
    userCheck()
},[])

     return (
       <>
       {loginStatus?<div><Modal></Modal></div>
       :<div><a className="login" onClick={logout}  >Sign Out </a></div>}
         
       </>
    );
  }
  
 
  export  default Check;