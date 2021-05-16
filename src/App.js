import React, { createContext } from 'react'
import { Route, Switch } from 'react-router-dom'

import Navbar from './app/Navbar';
import './css/app.css'
import RecipeWrapper from './features/recipes/RecipeWrapper';
import About from './features/About'

export const RecipeContext = createContext();

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Switch>
        <Route path="/about/">
          <About />
        </Route> 
        <Route path="/">
          <RecipeWrapper />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
