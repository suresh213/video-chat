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
import { Link, Redirect } from 'react-router-dom';

import homeIcon from '../../assets/home.png';

const Video = (props) => {
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
    setStream,
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
    otherUserStream,
    setOtherUserStream,
  } = useContext(SocketContext);

  const [state, setState] = useState();
  const [mobileView, setMobileView] = useState(false);

  const resize = () => {
    setMobileView(window.innerWidth <= 600);
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
  },[])

  useEffect(() => {
    if (stream) {
      myVideo.current.srcObject = stream;
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((res) => {
        console.log(res);

        // res.getVideoTracks()[0].enabled = false;
        // res.getAudioTracks()[0].enabled = false;

        setStream(res);
        console.log(myVideo);
        myVideo.current.srcObject = res;
      });
  }, []);

  useEffect(() => {
    if (userVideo.current) userVideo.current.srcObject = otherUserStream;
    console.log(otherUserStream);
    console.log(userVideo.current);
    console.log(callEnded);
  }, [otherUserStream, userVideoStatus]);

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
                    width='250'
                    height='140'
                    src=''
                    ref={myVideo}
                    autoPlay
                    muted
                    style={myVideoStatus ? { opacity: 1 } : { opacity: 0 }}
                  ></video>
                  <img
                    src={homeIcon}
                    style={
                      myVideoStatus
                        ? { display: 'none' }
                        : {
                            position: 'relative',
                            bottom: '120px',
                            right: '180px',
                          }
                    }
                  />
                </>
              )}
              <div className='name'>{name}</div>
            </div>

            {console.log('user mic ', callAccepted, callEnded)}
            {callAccepted && (
              <div className='video-frame'>
                {userMicStatus ? <MicIcon /> : <MicOffIcon />}
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
                <div className='name'>{name}</div>
              </div>
            )}
          </div>
        </div>
        <div className='bar'>
          <Options history={props.history}/>
        </div>
      </div>
      {showEditor && !mobileView&&(
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
