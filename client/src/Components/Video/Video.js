import React, { useContext, useState } from 'react';
import { SocketContext } from '../../SocketContext';
import Editor from '../Editor/Editor';
import Options from '../Options/Options';
import Notification from '../Notification/Notification';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
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
          {stream && (
            <video
              width='250'
              height='140'
              src=''
              ref={myVideo}
              autoPlay
              muted
            ></video>
          )}
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
          <div className='options'>
            <Options />
          </div>
          <div className='bar'>
            <VideocamIcon />
            <VideocamOffIcon />
            <MicIcon />
            <MicOffIcon />
          </div>
        </div>
      </div>
      {callAccepted && !callEnded && (
        <div className='right'>
          <div className='editor-div'>
            <Editor />
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;
