import './App.css';
import Notification from './Components/Notification/Notification';
import Options from './/Components/Options/Options';
import Video from './Components/Video/Video';
import Join from './Components/Join/Join';
import Home from './Components/Home/Home';
import { ContextProvider } from './SocketContext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
function App() {
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
