import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../SocketContext';
import Editor from '../Editor/Editor';
import Options from '../Options/Options';
import Notification from '../Notification/Notification';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import './Video.css';
import homeIcon from '../../assets/home.png';

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
            <div className='video-frame'>
              {myMicStatus ? <MicIcon /> : <MicOffIcon />}
              {stream && (
                <>
                  <video
                    // width='250'
                    // height='140'
                    src=''
                    ref={myVideo}
                    autoPlay
                    muted
                    style={myVideoStatus ? { opacity: 1 } : { opacity: 0 }}
                  ></video>
                  <img
                    src={homeIcon}
                    style={myVideoStatus ? {display:'none'} : { position:'relative',bottom:'120px',right:'180px' }}
                  />
                </>
              )}
            </div>

            {console.log('user mic ', userMicStatus)}
            {callAccepted && !callEnded && (
              <div className='video-frame'>
                {myMicStatus ? <MicIcon /> : <MicOffIcon />}
                {userVideoStatus ? (
                  <video
                    width='250'
                    height='140'
                    src=''
                    ref={userVideo}
                    autoPlay
                    muted
                  ></video>
                ) : (
                  <img src={homeIcon} />
                )}
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
