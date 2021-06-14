import React, { useContext, useEffect, useRef } from 'react';
import { SocketContext } from '../../SocketContext';
import './Join.css';
import homeIcon from '../../assets/video-call.png';
import { message } from 'antd';
import { APP_NAME } from '../../constants';
import Spinner from '../../common/Spinner';

const Join = (props) => {
  const {
    callAccepted,
    name,
    setName,
    stream,
    setStream,
    callUser,
    meetingCode,
    setMeetingCode,
    newMeet,
  } = useContext(SocketContext);

  const myPreviewVideo = useRef();

  useEffect(() => {
    if (!newMeet && meetingCode.length === 0) {
      props.history.push('/');
      return;
    }
    // if (stream) return;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((res) => {
        res.getAudioTracks()[0].enabled = false;
        setStream(res);
        myPreviewVideo.current.srcObject = res;
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
          <h3>{APP_NAME}</h3>
        </div>
      </div>
      <div className='join-page'>
        <div>
          <div className='video-div'>
            {stream ? (
              <video
                width='250'
                height='140'
                src=''
                ref={myPreviewVideo}
                autoPlay
                muted
              ></video>
            ) : (
              <Spinner />
            )}
          </div>
          {stream && (
            <>
              <input
                type='text'
                placeholder='Enter your name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value.trim());
                }}
              />
              <div className='join-btns-div'>
                {newMeet ? (
                  <button
                    className='btn'
                    onClick={() => {
                      if (name.length === 0) {
                        message.error('Please enter your name');
                        return;
                      }
                      props.history.push('meet');
                    }}
                  >
                    Start new meeting
                  </button>
                ) : (
                  <button className='btn' onClick={() => callUser(meetingCode)}>
                    Join now
                  </button>
                )}
                <button
                  className='btn'
                  onClick={() => {
                    setMeetingCode('');
                    props.history.push('/');
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Join;
