import React from 'react';
import tete from './en-tête.png';
import pied from './pied.png'
import './App.css';
import { BrowserRouter, Switch, Route} from 'react-router-dom';

import Home from "./pages/Home";
import Insert from "./pages/Insert";

function App() {

  return (
    <div><body>
    <header className="App-header">
      <img src={tete} className="App-image-bord"/>
    </header>
      <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/insert">
              <Insert />
            </Route>
          </Switch>
      </BrowserRouter>
      <footer>
          <img src={pied} className="App-image-bord"/>
      </footer></body></div>  
  );
}

export default App;