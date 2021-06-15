import React, { useEffect } from 'react';
import './App.css';
import Video from './Components/Video/Video';
import Join from './Components/Join/Join';
import Home from './Components/Home/Home';
import { ContextProvider } from './SocketContext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

function App() {

  useEffect(() => {
    if (!navigator.onLine) alert('Connect to internet!');
  }, [navigator]);

  return (
    <ContextProvider>
      <Router>
        <Switch>
          <Route path='/' component={Home} exact></Route>
          <Route path='/meet' component={Video}></Route>
          <Route path='/join' component={Join}></Route>
        </Switch>
      </Router>
    </ContextProvider>
  );
}

export default App;
