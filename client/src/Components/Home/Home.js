import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../SocketContext';
import './Home.css';
import Footer from '../Footer/Footer';
import homeIcon from '../../assets/video-call.png';
import homeIcon1 from '../../assets/home.png';
import homeVideo from '../../assets/homeVideo1.mp4';
import ChatIcon from '@material-ui/icons/Chat';
import EventNoteIcon from '@material-ui/icons/EventNote';
import SurroundSoundIcon from '@material-ui/icons/SurroundSound';
import DuoIcon from '@material-ui/icons/Duo';
import { Link } from 'react-router-dom';
const Home = () => {
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
  } = useContext(SocketContext);

  useEffect(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    document.getElementById('video').play();
  }, []);

  return (
    <div className='home'>
      <div className='navbar'>
        <div className='title-div'>
          <img src={homeIcon} alt='' />
          <h3>Meet</h3>
        </div>
      </div>
      <div className='body-div'>
        <div className='flex-box'>
          <div className='left-div'>
            <div className='contents'>
              <div className='start-meet'>
                <Link className='home-btn' to='meet'>
                  Start Meeting
                </Link>
              </div>
              <div className='join-meet'>
                <input type='text' placeholder='Enter meeting code' />
                <button className='home-btn'>Join Meeting</button>
              </div>
              <div className='features'>
                <h1>Features</h1>
                <div className='grid-div'>
                  <DuoIcon />
                  <p>1:1 Video chat</p>
                </div>
                <div className='grid-div'>
                  <SurroundSoundIcon />
                  <p>Live Editor for interview</p>
                </div>
                <div className='grid-div'>
                  <EventNoteIcon />
                  <p>Notes</p>
                </div>
                <div className='grid-div'>
                  <ChatIcon />
                  <p>Real time Chat</p>
                </div>
              </div>
              <img src={homeIcon1} alt='' />
            </div>
          </div>
          <div className='right-div'>
            {/* <img src={homeIcon} alt='' /> */}
            <video
              src={homeVideo}
              id='video'
              alt='video'
              autoplay
              muted
              loop
            ></video>
          </div>
        </div>
      </div>
      {/* <div className='footer'></div> */}
      <Footer />
    </div>
  );
};

export default Home;
