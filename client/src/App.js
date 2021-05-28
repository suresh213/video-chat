import './App.css';
import Notification from './Components/Notification/Notification';
import Options from './/Components/Options/Options';
import Video from './/Components/Video/Video';
import { ContextProvider } from './SocketContext';
function App() {
  return (
    <ContextProvider>
      <Video />
      
    </ContextProvider>
  );
}

export default App;
