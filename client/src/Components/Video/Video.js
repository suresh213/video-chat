import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../SocketContext';
import Editor from '../Editor/Editor';
import Options from '../Options/Options';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import './Video.css';
import homeIcon1 from '../../assets/video-call.png';
import { APP_NAME } from '../../constants';

const Video = (props) => {
  const {
    callAccepted,
    name,
    myVideo,
    userVideo,
    stream,
    setStream,
    myVideoStatus,
    myMicStatus,
    userVideoStatus,
    userMicStatus,
    showEditor,
    otherUserStream,
  } = useContext(SocketContext);

  const [mobileView, setMobileView] = useState(false);

  const resize = () => {
    setMobileView(window.innerWidth <= 600);
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (stream) {
      myVideo.current.srcObject = stream;
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((res) => {
        setStream(res);
        myVideo.current.srcObject = res;
      });
  }, []);

  useEffect(() => {
    if (userVideo.current) userVideo.current.srcObject = otherUserStream;
  }, [otherUserStream, userVideoStatus]);

  return (
    <div className={showEditor ? 'flex-div' : 'flex-div hide-editor'}>
      <div className='left'>
        <div className='navbar'>
          <div className='title-div'>
            <img src={homeIcon1} alt='' />
            <h3>{APP_NAME}</h3>
          </div>
        </div>
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
                  {/* <img
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
                  /> */}
                </>
              )}
              <div className='name'>{name}</div>
            </div>

            {callAccepted && (
              <div className='video-frame'>
                {userMicStatus ? <MicIcon /> : <MicOffIcon />}
                {/* {userVideoStatus ? ( */}
                <video
                  width='250'
                  height='140'
                  src=''
                  ref={userVideo}
                  autoPlay
                  // muted
                ></video>
                {/* ) : (
                  <img src={homeIcon} />
                )} */}
                <div className='name'>{name}</div>
              </div>
            )}
          </div>
        </div>
        <div className='bar'>
          <Options history={props.history} />
        </div>
      </div>
      {!mobileView && (
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
