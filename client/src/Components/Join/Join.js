import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../SocketContext';
import Editor from '../Editor/Editor';
import Options from '../Options/Options';
import Notification from '../Notification/Notification';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import './Join.css';
import homeIcon from '../../assets/video-call.png';

const Join = (props) => {
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
    meetingCode,
    setMeetingCode,
    setCallEnded,
    setCallAccepted,
  } = useContext(SocketContext);

  useEffect(() => {
    if (stream) return;
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
    if (callAccepted) props.history.push('meet');
  }, [callAccepted]);

  return (
    <>
      <div className='navbar'>
        <div className='title-div'>
          <img src={homeIcon} alt='' />
          <h3>Meet</h3>
        </div>
      </div>
      <div className='join-page'>
        <div>
          <div className='video-div'>
            <video
              width='250'
              height='140'
              src=''
              ref={myVideo}
              autoPlay
              muted
            ></video>
          </div>
          <div className='join-btns-div'>
            <button onClick={() => callUser(meetingCode)}>Join now</button>
            <button
              onClick={() => {
                setMeetingCode('');
                props.history.push('/');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Join;
