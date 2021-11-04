import React, { useEffect,useState } from 'react';
import {Row,Col,Image,ListGroup ,Modal} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
 import "../createAccount/create.css"
import  "../movieView/view404.css";
import OwlCarousel from 'react-owl-carousel';  
import YouTube from 'react-youtube';
import LoginHeader from '../header/loginHeader'
import RelatedMovies from '../movieView/relatedMovie'
import Comment from '../movieView/commentSection'

export default function ViewMovies(props)
{
     //  const query = useLocation();
    let { movieId ,displayName} = useParams();
    const[backdrop_path,setbackdrop_path]=useState("");
    const[movieName,setmovieName]=useState("");
    const[genres,setgenres]=useState([]);
    const[overview,setoverview]=useState("");
    const[character,setcharacter]=useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [youTube, setyouTube] = useState();

    const opts = {
      height: '527',
      width: '800',
      playerVars: { 'autoplay': 0, 'controls': 0 ,'rel' : 0,'fs':0,'modestbranding':0},
     };
     async function fetchData()
{
    let movielink="https://api.themoviedb.org/3/movie/"+movieId+"?api_key=0612d44670c9d53eb57dd9ec885631d6&language=en-US";
    await fetch(movielink)
           .then(res => res.json())
          .then(res =>  
            {
                setbackdrop_path(res.backdrop_path)
                setmovieName(res.title)
                setgenres(res.genres)
                setoverview(res.overview);
               })
          .catch(() =>console.log("here error occured"));
}

async function fetchcast()
{
    let movielink="https://api.themoviedb.org/3/movie/"+movieId+"/credits?api_key=0612d44670c9d53eb57dd9ec885631d6";
    await fetch(movielink)
           .then(res => res.json())
          .then(res =>  
            {
              
                   setcharacter(res.cast)
                  setLoading(true)
                })
          .catch(() =>console.log("here error occured"));
}

async function youTubeVideo()
{
    let movielink="https://api.themoviedb.org/3/movie/"+movieId+"/videos?api_key=0612d44670c9d53eb57dd9ec885631d6&language=en-US";
    await fetch(movielink)
           .then(res => res.json())
          .then(res =>  
            {
               setyouTube(res.results[0].key)
                 })
          .catch(() =>console.log("here error occured"));
}

 
useEffect(()=>
{
      fetchData();
      fetchcast();

      youTubeVideo();
},[])


const playVideo=()=>
{
   setShow(true)
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
            <YouTube videoId={youTube} opts={opts} onReady={_onReady} onEnd={_onEnd} />    
         </Modal>
   
)
function _onReady(event) {
  // access to player in all event handlers via event.target
//  event.target.pauseVideo();  
  event.target.playVideo();
 }

 function _onEnd(event) {
  setShow(false)
}

      let poster_path= "https://image.tmdb.org/t/p/original/"+backdrop_path;
     
      return(
          <>  
            <LoginHeader name={displayName}></LoginHeader>
             {show?modal():""}
          <div className="holder">
           <Image  className="imageCrop" src={poster_path}  />
          <i className="fa fa-play-circle fa-4x middle" onClick={playVideo}>{movieName}</i> 
            </div>

             <Row className="row1">
                 
              <Col sm={8}>
                     <h1 className="Acctitle">Overview</h1>
                     <hr className="line"/>
                     <h3>{overview}</h3>
                  </Col>   
            <Col  className="genres" sm={4}>

            <ListGroup as="ul">
                <ListGroup.Item as="li" active>
                   <h3> Genres</h3>
            </ListGroup.Item>
            {genres.map(item=>
                {
                     return(
                        <ListGroup.Item key={item.id} as="li">{item.name}</ListGroup.Item>
                      )   
                })
                }
              </ListGroup>
        </Col>
        <Col className="cast" sm={12}>
        <h1 className="Acctitle">Cast</h1>
                     <hr className="line"/>
                      
        <OwlCarousel items={3}  
           className="owl-theme"  
           dots={false} 
            rewind={true}
           autoplay={true}
           autoplayTimeout={5000}
 >  
           {
               character.map(item=>
               {
                   let imageShow=false;
                   let profile;
 
                  if(item.profile_path!=null)
                  {
                          imageShow=true;
                        profile="https://image.tmdb.org/t/p/original/"+item.profile_path;
                   }
                    return(
                     <>
                      {imageShow?(<div className="holder">
                      <Image  className=" castProfile" src={profile } roundedCircle  />
                    <h4 className="describe">{item.name +" as "+item.character}</h4>
                        </div>)
                    : " " 
                    }
                </>
                      )
               })
           }
        </OwlCarousel> 

        </Col>
        <Col className="cast" sm={12}>
        <h1 className="Acctitle">Similar Movies</h1>
                     <hr className="line"/>
            <RelatedMovies movieId={movieId}  name={displayName}></RelatedMovies>
                     </Col>

       <Col className="cast" sm={6}>
        <Comment movieId={movieId} name={displayName}></Comment>
        </Col>
         </Row>
              </>
      )
}

