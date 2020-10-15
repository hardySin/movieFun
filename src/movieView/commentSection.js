import React, { useEffect,useState } from 'react';
import {Row,Col,Modal,Button,InputGroup,FormControl,Card } from 'react-bootstrap';
  import "../createAccount/create.css"
import  "../movieView/view404.css";
import firebase from '../firebase';
import { database } from 'firebase';

 
export default function Comment(props)
{
    const [show, setShow] = useState(false);
    const [comment, setcomment] = useState();
    const [fetchcomment, setfetchcomment] = useState([]);

    const [loadComment, setloadComment] = useState(false);
    const [userId, setuserId] = useState(false);

    const [FirebaseUserID, setFirebaseUserID] = useState(false);
    const [FirebaseUserName, setFirebaseUserName] = useState(false);

    function fetchComment()
    {
        firebase.auth.onAuthStateChanged((res)=>
        {
                if(res)
             {
                  setuserId(res.uid)
                let docRef=  firebase.getCommentOnId(res.uid);
 
                docRef.then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        // doc.data() is never undefined for query doc snapshots
                        console.log("Document data:", doc.data());
                        setfetchcomment(fetchcomment =>[...fetchcomment,doc.data()]);
                      });
                });
                 
                              }
            })
       }
useEffect(()=>
{
    
   fetchComment()
},[loadComment])

function replay(username,userId)
{
     setShow(true)
     setFirebaseUserID(userId)
     setFirebaseUserName("Replied to "+username)
}

function  setComments(value)
{
     setcomment(value)
     setloadComment(false)
}
   function post(e)
  {
    e.preventDefault()
     if(comment!=="" &&  comment!=undefined)
      {
           let val= firebase.addComment(userId,comment,props.name,props.movieId)
          console.log("val",val)
            setloadComment(true)
            setcomment()
            setfetchcomment([])
          }
       else
       {
        }
    }
const modal=()=>
(
  <Modal
          size="lg"
          show={show}
          onHide={() => setShow(false)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
              <InputGroup className="mb-3">
            <FormControl
             placeholder={FirebaseUserName}
            aria-label="Your Comments"
            aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
            <Button variant="outline-secondary">Post</Button>
            </InputGroup.Append>
        </InputGroup>
          </Modal>
   
)

      
      return(
          <> 
           {show?modal():""}
          <span>Leave a  comment</span>
          <InputGroup className="mb-3">
            <FormControl
            value={comment}
            onChange={event=> setComments(event.target.value)}
            placeholder="Your Comments"
            aria-label="Your Comments"
            aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
            <Button onClick={post} variant="outline-secondary">Post</Button>
            </InputGroup.Append>
        </InputGroup>

        {fetchcomment.map(item=>
            {
                 if(item.movieId==props.movieId )
                {
                    console.log("fetchcomment",item.movieId,props.movieId);

              let year= item.year;
             let month=item.month;
             let date= item.date;
             let timing=date+"/"+month+"/"+year;
               return(
                    <div style={{ marginTop:'20px' }}>
        <Card style={{ width: '25rem' }}>
        <Row>
            <Col sm={6}>
               <p>{item.userName}</p>
             </Col>
            <Col sm={6}>
               <p>{timing}</p>
            </Col>
             <Col sm={8}>
               <p>{item.userComment}</p> 
            </Col>
            <Col sm={4}>
             <Button onClick={()=>replay(item.userName,item.userId)} variant="outline-dark" >Replay</Button>
            </Col>
        </Row>
        </Card>
                    </div>
               )
                }
                else
                {
                    // return(
                    //     <>No Comment for More!!</>
                    // ) 
                }
                
            })}
                    </>
      )
}

