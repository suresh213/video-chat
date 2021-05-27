import React, { useContext, useState } from 'react';
import { SocketContext } from '../../SocketContext';
import './Video.css';
const Video = () => {
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
  const [state, setState] = useState();
  return (
    <div className='flex-div'>
      <div className='left'>
        <div className='video-div'>
          {' '}
          <video
            width='250'
            height='140'
            src=''
            ref={myVideo}
            autoPlay
            muted
          ></video>
          {callAccepted && !callEnded && (
            <video
              width='250'
              height='140'
              src=''
              ref={userVideo}
              autoPlay
              muted
            ></video>
          )}
        </div>
      </div>
      <div className='right'>
        <div className='editor-div'></div>
      </div>
    </div>
  );
};

export default Video;
