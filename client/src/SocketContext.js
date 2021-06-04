import { useEffect, createContext, useState, useRef } from 'react';
import Peer from 'simple-peer';
import { io } from 'socket.io-client';
import { v4 } from 'uuid';
import { useHistory } from 'react-router-dom';

import 'antd/dist/antd.css';
import { Input, Button, Tooltip, Modal, message } from 'antd';
const SocketContext = createContext();

const socket = io('http://localhost:5000');

const ContextProvider = ({ children }) => {
  const history = useHistory();
  console.log(history);
  const [socketState, setSocketState] = useState(socket);
  const [me, setMe] = useState('');
  const [call, setCall] = useState({});
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [documentId, setDocumentId] = useState(v4());
  const [myVideoStatus, setMyVideoStatus] = useState(true);
  const [userVideoStatus, setUserVideoStatus] = useState(false);
  const [myMicStatus, setMyMicStatus] = useState(false);
  const [userMicStatus, setUserMicStatus] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notes, setNotes] = useState('');
  const [meetingCode, setMeetingCode] = useState('');
  const [notesOpen, setNotesOpen] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  // useEffect(() => {
  //   if (myVideoStatus === false) return;
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: true })
  //     .then((res) => {
  //       console.log(res);

  //       // res.getVideoTracks()[0].enabled = false;
  //       // res.getAudioTracks()[0].enabled = false;

  //       setStream(res);
  //       console.log(myVideo);
  //       myVideo.current.srcObject = res;
  //     });
  // }, [myVideoStatus]);

  useEffect(() => {
    console.log(navigator.onLine);
    if (!navigator.onLine) alert('Connect to internet!');
  }, [navigator]);

  useEffect(() => {
    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((res) => {
    //     console.log(res);

    //     // res.getVideoTracks()[0].enabled = false;
    //     // res.getAudioTracks()[0].enabled = false;

    //     setStream(res);
    //     console.log(myVideo);
    //     // myVideo.current.srcObject = res;
    //   });

    socket.on('me', (id) => {
      console.log(id);
      setMe(id);
    });
    socket.on('calluser', ({ from, name: callerName, signal, documentId }) => {
      console.log({ from, callerName, signal, documentId });

      setCall({
        from,
        callerName,
        signal,
        isRecievedCall: true,
        documentId,
      });
    });

    socket.on('updateUserMedia', ({ type, mediaStatus }) => {
      console.log({ type, mediaStatus });
      if (!type || !mediaStatus || !mediaStatus.length) {
        return;
      }
      if (type === 'video') {
        message.info(`User turned ${mediaStatus[0] ? 'on' : 'off'} his video`);
        setUserVideoStatus(mediaStatus[0]);
        return;
      }
      if (type === 'audio') {
        message.info(`User ${mediaStatus[0] ? 'unmuted' : 'muted'} his mic`);
        setUserMicStatus(mediaStatus[0]);
        return;
      }
      setUserMicStatus(mediaStatus[0]);
      setUserVideoStatus(mediaStatus[1]);
    });

    // const handler = (delta) => {
    //   console.log(delta);
    //   // quill.updateContents(delta);
    // };

    // socket.on('recieve-changes', handler);

    socket.on('callended', () => {
      setCall(null);
      setCallAccepted(false);
      setCallEnded(true);
    });
  }, []);

  useEffect(() => {
    console.log(messages);
  }, [setMessages]);

  const answerCall = () => {
    setCallAccepted(true);
    setOtherUser(call.from);
    // console.log(documentId);
    setDocumentId(call.documentId);
    // console.log(documentId);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      console.log(call);
      console.log(documentId);
      socket.emit('answercall', {
        signal: data,
        to: call.from,
        documentId: call.documentId,
        type: 'both',
        mediaStatus: [myMicStatus, myVideoStatus],
      });
    });

    peer.on('stream', (currentStream) => {
      console.log(userVideo);
      if (userVideo.current) userVideo.current.srcObject = currentStream;
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
      // console.log(currentStream);
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    socket.on('callaccepted', (signal) => {
      socket.emit('updateMyMedia', {
        data: {
          type: 'both',
          mediaStatus: [myMicStatus, myVideoStatus],
        },
        userToUpdate: id,
      });
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const endCall = () => {
    socket.emit('callended', otherUser);
    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.destroy();
    history.push('/');
    // window.location.reload();
  };

  const updateVideoStatus = () => {
    console.log('video staus');
    socket.emit('updateMyMedia', {
      data: { type: 'video', mediaStatus: [!myVideoStatus] },
      userToUpdate: otherUser,
    });
    // if (myVideoStatus) {
    //   console.log(stream.getTracks());
    //   stream.getTracks().forEach(function (track) {
    //     console.log(track);
    //     if (track.readyState == 'live' && track.kind === 'video') {
    //       track.stop();
    //     }
    //   });
    // } else {
    //   console.log(stream.getTracks());
    //   // stream.getTracks().forEach(function (track) {
    //   //   console.log(track)
    //   //   if (track.readyState == 'live' && track.kind === 'video') {
    //   //     track.start();
    //   //   }
    //   // });
    //   navigator.mediaDevices
    //     .getUserMedia({ video: true, audio: true })
    //     .then((res) => {
    //       console.log(res);
    //       setStream(res);
    //       console.log(myVideo);
    //       myVideo.current.srcObject = res;
    //     });
    // }
    stream.getVideoTracks()[0].enabled = !myVideoStatus;
    setMyVideoStatus(!myVideoStatus);
    console.log(stream.getVideoTracks()[0]);
  };

  const updateMicStatus = () => {
    socket.emit('updateMyMedia', {
      data: { type: 'audio', mediaStatus: [!myMicStatus] },
      userToUpdate: otherUser,
    });
    stream.getAudioTracks()[0].enabled = !myMicStatus;
    setMyMicStatus(!myMicStatus);
    console.log(stream.getAudioTracks()[0]);
  };

  return (
    <SocketContext.Provider
      value={{
        me,
        call,
        callAccepted,
        setCallAccepted,
        callEnded,
        setCallEnded,
        name,
        setName,
        myVideo,
        userVideo,
        stream,
        setStream,
        answerCall,
        callUser,
        endCall,
        otherUser,
        documentId,
        myVideoStatus,
        myMicStatus,
        userVideoStatus,
        userMicStatus,
        setUserVideoStatus,
        updateMicStatus,
        updateVideoStatus,
        setShowEditor,
        showEditor,
        socketState,
        showChatBox,
        setShowChatBox,
        messages,
        setMessages,
        notes,
        setNotes,
        notesOpen,
        setNotesOpen,
        meetingCode,
        setMeetingCode,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export { SocketContext, ContextProvider };
