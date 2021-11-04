import React, { useEffect,useState } from 'react';
import {Row,Col, Button,Card} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
 import "../createAccount/create.css"
 import '../upcomingmoives/upcoming.css'
 import { useHistory} from 'react-router-dom';
 
import  "../movieView/view404.css";
import OwlCarousel from 'react-owl-carousel';  
import YouTube from 'react-youtube';
import LoginHeader from '../header/loginHeader'

export default function RelatedMovies(props)
{
    let { movieId ,displayName} = useParams();

     const[similar,setsimilar]=useState([]);
     const [loading, setLoading] = useState(false);
        
     let history=useHistory();

     //  const query = useLocation();
        async function fetchData()
        {
            let movielink="https://api.themoviedb.org/3/movie/"+props.movieId+"/similar?api_key=0612d44670c9d53eb57dd9ec885631d6&language=en-US";
            await fetch(movielink)
                    .then(res => res.json())
                .then(res =>  
                    {
                        console.log("res",res);
                            setsimilar(res.results);
                        console.log("similar",similar);
                        setLoading(true)    

                    })
                .catch(() =>console.log("here error occured"));
        }
      useEffect(()=>
     {
           fetchData();
      },[loading])
     

const playVideo=()=>
{
 }

 function viewMovie(id)
{
      console.log("id",id)
      history.push("/relatedViewMovie/"+id+"/"+displayName)
   }

       return(
          <> 
          {similar.length>0?
          
           (<Row>
           <Col  sm={12}>

           <OwlCarousel items={3}  
           className="owl-theme"  
           dots={false} 
            rewind={true}
           autoplay={true}
           autoplayTimeout={4000}
 >  
           {
               similar.map(item=>
               {
                   let imageShow=false;
                   let poster_path;
 
                  if(item.poster_path!=null)
                  {
                      console.log("path not null")
                          imageShow=true;
                          poster_path="https://image.tmdb.org/t/p/original/"+item.poster_path;
                   }
                    return(
                     <>
                     
                      {imageShow?(<div  key={item.id} className="loginContainer">
                    <Card>
                    <Card.Img variant="top" src={poster_path} />
                    <Button onClick={()=>viewMovie(item.id)}   className="btn">View</Button>
                   </Card>
                   </div>)
                    : " " 
                    }
                </>
                      )
               })
           }
        </OwlCarousel> 
            </Col>
            </Row>)
            :(<h1 className="Acctitle">No Movies Available </h1>) 
}
        </>
      )
}

