import { useEffect, createContext, useState, useRef } from 'react';
import Peer from 'simple-peer';
import { io } from 'socket.io-client';
import { v4 } from 'uuid';

const SocketContext = createContext();
const socket = io('http://localhost:5000');

const ContextProvider = ({ children }) => {
  const [me, setMe] = useState('');
  const [call, setCall] = useState({});
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [documentId, setDocumentId] = useState(v4());
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((res) => {
        console.log(res);
        setStream(res);
        console.log(myVideo);
        myVideo.current.srcObject = res;
      });

    socket.on('me', (id) => {
      console.log(id);
      setMe(id);
    });
    socket.on('calluser', ({ from, name: callerName, signal, documentId }) => {
      console.log({ documentId });
      setCall({
        from,
        callerName,
        signal,
        isRecievedCall: true,
        documentId,
      });
    });
    socket.on('callended', () => {
      setCallEnded(true);
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    setOtherUser(call.from);
    console.log(documentId);
    setDocumentId(call.documentId);
    console.log(documentId);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      console.log(call);
      console.log(documentId);
      socket.emit('answercall', {
        signal: data,
        to: call.from,
        documentId: call.documentId,
      });
    });
    peer.on('stream', (currentStream) => {
      console.log(userVideo);
      userVideo.current.srcObject = currentStream;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    console.log(id);
    const peer = new Peer({ initiator: true, trickle: false, stream });
    setOtherUser(id);
    peer.on('signal', (data) => {
      socket.emit('calluser', {
        userToCall: id,
        from: me,
        signal: data,
        name,
        documentId,
      });
    });
    peer.on('stream', (currentStream) => {
      console.log(currentStream);
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callaccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const endCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
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
        otherUser,
        documentId,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export { SocketContext, ContextProvider };
