import React,{useState,useEffect} from 'react';
 import './App.css';
  import viewmovie from './movieView/view';
import notfound from './movieView/404error';
import Home from "./Home/Home";
import view from './movieView/viewMovies'
import related from './movieView/relatedViewMovie'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
 

function App(props) {
 const routers=() =>(<Router>
               <Switch>
                  <Route exact path='/' component={Home} />
                  <Route exact  path='/viewMovies' component={viewmovie} />
                      <Route exact  path='/viewMovie/:movieId/:displayName' component={view} />
                      <Route  path='/relatedViewMovie/:relatedID/:displayName' component={related} />

                  <Route path="*" component={notfound} />
                </Switch>
            </Router>);

   return  (
      <>
               {routers()}
       </>
     )  
}
export default App;
