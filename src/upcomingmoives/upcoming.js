import OwlCarousel from 'react-owl-carousel';
import React, { useState, useEffect } from 'react';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { Card, Button, Row, Col, Modal } from 'react-bootstrap';
import '../upcomingmoives/upcoming.css'
import firebase from '../firebase';
import { useHistory } from 'react-router-dom';
import Popup from '../header/alert';
import LoginHeader from '../header/loginHeader'
const Upcoming = (props) => {

   const [movie, setmovie] = useState([]);
   const [loading, setLoading] = useState(false);
   const [loginStatus, setloginStatus] = useState(false);
   const [name, setName] = useState("");
   const [showAlert, setshowAlert] = useState(false);

   let history = useHistory();

   function userCheck() {
      firebase.auth.onAuthStateChanged((res) => {
         if (res) {
            console.log("res value ", res)
            setloginStatus(true)
            setName(res.displayName)
         }
         else {
            console.log("redirect main ", history);
            history.push('/');
         }

      })
   }


   async function fetchData() {
      await fetch("https://api.themoviedb.org/3/movie/upcoming?api_key=0612d44670c9d53eb57dd9ec885631d6&language=en-US")
         .then(res => res.json())
         .then(res => {
            setmovie(res.results);
            console.log(res.results);
            setLoading(true);
         })
         .catch(() => console.log("here error occured"));
   }
   function viewMovie(id) {
      if (loginStatus) {
         console.log("id", id)
         history.push("/viewMovie/" + id + "/" + name)
      }
      else {
         setshowAlert(true);
      }
   }
   useEffect(() => {
      userCheck()
      fetchData();
   }, [])

   return (
      <div>
         {loginStatus ? <LoginHeader name={name}></LoginHeader> : ""}
         <div className="movieHolder">
            <Row>
            </Row>

            <h2 className="upcoming">Upcoming Movies</h2>
            <hr className="line" />

            <OwlCarousel items={3}
               className="owl-theme"
               dots={false}
               rewind={true}
               autoplay={true}
               autoplayTimeout={5000}
            >
               {
                  movie.map((item) => {
                     let poster = "https://image.tmdb.org/t/p/w500" + item.poster_path;

                     return (
                        <div key={item.id} className={loginStatus ? "loginContainer" : "container"}>
                           <Card>
                              <Card.Img variant="top" src={poster} />
                              <Button onClick={() => viewMovie(item.id)} className="btn">View</Button>
                           </Card>
                        </div>
                     )
                  })
               }
            </OwlCarousel>

            {showAlert ? <Popup titleName="Hacker I think you Sign out" state="true"></Popup> : ""}

         </div>
      </div>
   );
}

export default Upcoming;
