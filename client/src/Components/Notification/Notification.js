import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../../SocketContext';

const Notification = () => {
  const {
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
  } = useContext(SocketContext);
  useEffect(() => {
      console.log(call)
  }, [call])
  return (
    <div>
      {call.isRecievedCall && !callAccepted && (
        <button onClick={() => answerCall()}>Answer</button>
      )}
    </div>
  );
};

export default Notification;
