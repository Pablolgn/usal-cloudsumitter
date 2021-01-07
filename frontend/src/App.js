import React from 'react';
import './App.css';
import Home from './pages/Home';
import Server from './pages/Server';

import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

function App() {

    return(
            <Router>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/server' component={Server}/>
                    </Switch>
            </Router>
    )
      
}

export default App;


