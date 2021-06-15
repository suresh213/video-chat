import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../SocketContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './Options.css';
import 'antd/dist/antd.css';
import Menu from '@material-ui/core/Menu';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { Button, message } from 'antd';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CallEndIcon from '@material-ui/icons/CallEnd';
import ChatIcon from '@material-ui/icons/Chat';
import Messages from '../Messages/Messages';
import Notes from '../Notes/Notes';
import CloseIcon from '@material-ui/icons/Close';
import AntSwitch from '../../common/AntSwitch';
import { APP_URL } from '../../constants';

const Options = (props) => {
  const [callId, setCallId] = useState('');

  const {
    me,
    call,
    callAccepted,
    callEnded,
    name,
    setCall,
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
    showChatBox,
    setShowChatBox,
    setShowEditor,
    notesOpen,
    setNotesOpen,
  } = useContext(SocketContext);

  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileView, setMobileView] = useState(false);
  const resize = () => {
    setMobileView(window.innerWidth <= 600);
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (call && call.isRecievedCall && !callAccepted) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [call, callEnded]);

  return (
    <>
      <div className={showEditor ? 'options' : 'options w100'}>
        <button className='tooltip' onClick={handleClick}>
          <MoreVertIcon />
          <span className='tooltiptext'>Options</span>
        </button>

        <button
          onClick={() => updateVideoStatus()}
          className={!myVideoStatus ? 'bg-grey tooltip' : 'bg-white tooltip'}
        >
          {myVideoStatus ? <VideocamIcon /> : <VideocamOffIcon />}
          <span className='tooltiptext'>
            {myVideoStatus ? 'Turn off video' : 'Turn on video'}
          </span>
        </button>
        {/* {callAccepted && !callEnded && ( */}
        <button
          className='red-btn tooltip'
          type='primary'
          onClick={() => {
            endCall(props.history);
          }}
        >
          <CallEndIcon />
          <span className='tooltiptext'>End call</span>
        </button>

        {/* )} */}
        <button
          onClick={() => updateMicStatus()}
          type='primary'
          className={!myMicStatus ? 'bg-grey tooltip' : 'bg-white tooltip'}
        >
          {' '}
          {myMicStatus ? <MicIcon /> : <MicOffIcon />}
          <span className='tooltiptext'>
            {myMicStatus ? 'Turn off mic' : 'Turn on mic'}
          </span>
        </button>
        <button
          className='tooltip'
          type='primary'
          onClick={() => setShowChatBox(!showChatBox)}
        >
          <ChatIcon />
          <span className='tooltiptext'>Chat</span>
        </button>

        <Notes />

        <Menu
          id='long-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <div className='options-menu'>
            <div className='btn-div'>
              <h3>Options</h3>
              <button type='primary' onClick={handleClose}>
                <CloseIcon />
              </button>
            </div>
            <h3 className='name'>Hi, {name}</h3>
            <div>
              <input
                type='text'
                readOnly
                value={`${APP_URL}?${me}`}
                style={{ marginBottom: '1rem' }}
              />
              <br />
              <CopyToClipboard
                text={`${APP_URL}?${me}`}
                onCopy={() => {
                  message.success('Url Copied');
                }}
              >
                <Button type='primary'>Copy Link</Button>
              </CopyToClipboard>
              <h3 style={{ padding: '10px 0 0px 0' }}>Or</h3>
              <CopyToClipboard
                text={me}
                onCopy={() => {
                  message.success('Id Copied');
                }}
              >
                <Button type='primary'>Copy ID</Button>
              </CopyToClipboard>
            </div>

            {!mobileView && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: 'auto',
                }}
              >
                <h3
                  style={{
                    margin: 'auto 0',
                  }}
                >
                  Interview mode
                </h3>
                <AntSwitch
                  style={{
                    margin: 'auto 0',
                  }}
                  checked={showEditor}
                  onChange={() => {
                    message.info(
                      `Switched to ${showEditor ? 'normal' : 'interview'} mode`
                    );
                    setShowEditor(!showEditor);
                  }}
                />
              </div>
            )}

            {/* <div>
              <input
                type='text'
                placeholder='Enter Id to call'
                value={callId}
                onChange={(e) => setCallId(e.target.value)}
              />
            </div> */}

            {/* {!callAccepted && !callEnded && ( */}
            {/* <div>
              <Button type='primary' onClick={() => callUser(callId)}>
                Join
              </Button>
            </div> */}
            {/* )} */}
          </div>
        </Menu>

        {call && (
          <Dialog open={open} aria-labelledby='draggable-dialog-title'>
            <DialogTitle>Meet Call</DialogTitle>
            <DialogContent>
              <div className='call-div'>
                <p>{call.callerName} wants to join with you</p>
                <div className='flex'>
                  <Button
                    type='primary'
                    onClick={() => {
                      answerCall();
                      setOpen(false);
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    type='primary'
                    onClick={() => {
                      setCall(null);
                      setOpen(false);
                    }}
                  >
                    Deny
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Messages />
      </div>
    </>
  );
};

export default Options;
