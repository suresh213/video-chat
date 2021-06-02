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
    myVideoStatus,
    myMicStatus,
    userVideoStatus,
    userMicStatus,
    updateMicStatus,
    updateVideoStatus,
    showEditor,
    setShowEditor,
  } = useContext(SocketContext);

  const [state, setState] = useState();
  return (
    <div className={showEditor ? 'flex-div' : 'flex-div hide-editor'}>
      <div className='left'>
        <div className='video-div'>
          {' '}
          <div className='video-frames'>
            {stream && (
              <div className='video-frame'>
                {myMicStatus ? <MicIcon /> : <MicOffIcon />}
                <video
                  width='250'
                  height='140'
                  src=''
                  ref={myVideo}
                  autoPlay
                  muted
                ></video>
              </div>
            )}
            {console.log('user mic ', userMicStatus)}
            {callAccepted && !callEnded && (
              <div className='video-frame'>
                {userMicStatus ? <MicIcon /> : <MicOffIcon />}
                <video
                  width='250'
                  height='140'
                  src=''
                  ref={userVideo}
                  autoPlay
                  muted
                ></video>
              </div>
            )}
          </div>
        </div>
        <div className='bar'>
          <Options />
        </div>
      </div>
      {showEditor && (
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
