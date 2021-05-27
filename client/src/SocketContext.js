import { useEffect, createContext, useState, useRef } from 'react';
import Peer from 'simple-peer';
import { io } from 'socket.io-client';

const SocketContext = createContext();
const socket = io('http://localhost:5000');

const ContextProvider = ({ children }) => {
  const [me, setMe] = useState('');
  const [call, setCall] = useState({});
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  const myVideo = useRef();
  const userVideo = useRef();
  const connection = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((res) => {
        console.log(res);
        setStream(res);
        myVideo.current.srcObject = res;
      });

    socket.on('me', (id) => setMe(id));
    socket.on('calluser', ({ from, name: callerName, signal }) => {
      // console.log({ from, callerName, signal, isRecievedCall: true });
      setCall({ from, callerName, signal, isRecievedCall: true });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answercall', { signal: data, to: call.from });
    });
    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(call.signal);
    connection.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('calluser', { userToCall: id, from: me, signal: data, name });
    });
    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on('callaccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connection.current = peer;
  };

  const endCall = () => {
    setCallEnded(true);
    connection.current.destroy();
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        me,
        call,
        callAccepted,
        callEnded,
        name,
        setName,
        myVideo,
        userVideo,
        stream,
        answerCall,
        callUser,
        endCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export { SocketContext, ContextProvider };
