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

const Options = (props) => {
  const [callId, setCallId] = useState('');
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
          className={!myVideoStatus ? 'bg-grey' : 'bg-white'}
        >
          {myVideoStatus ? <VideocamIcon /> : <VideocamOffIcon />}
        </button>
        {/* {callAccepted && !callEnded && ( */}
        <button
          className='red-btn '
          type='primary'
          onClick={() => {
            endCall(props.history);
          }}
        >
          <CallEndIcon />
        </button>

        {/* )} */}
        <button
          onClick={() => updateMicStatus()}
          className={!myMicStatus ? 'bg-grey' : 'bg-white'}
        >
          {' '}
          {myMicStatus ? <MicIcon /> : <MicOffIcon />}
        </button>
        <button
          className='tooltip'
          type='primary'
          onClick={() => setShowChatBox(!showChatBox)}
        >
          <ChatIcon />
          <span class='tooltiptext'>Chat</span>
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
            <h3 className='name'>{name}</h3>
            <div>
              <input type='text' readOnly value={me} style={{marginBottom:'1rem'}}/>
              <br />
              <CopyToClipboard
                text={me}
                onCopy={() => {
                  message.success('Id Copied');
                }}
              >
                <Button type='primary'>Share your Id</Button>
              </CopyToClipboard>
            </div>

            {!mobileView && (
              <div>
                <Button
                  type='primary'
                  onClick={() => setShowEditor(!showEditor)}
                >
                  {showEditor ? 'Hide Editor' : 'Show Editor'}
                </Button>
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
                  <Button type='primary' onClick={() => setOpen(false)}>
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
