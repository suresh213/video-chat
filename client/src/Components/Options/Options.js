import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../SocketContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './Options.css';
import 'antd/dist/antd.css';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Notification from '../Notification/Notification';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { Input, Button, Tooltip, Modal, message } from 'antd';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CallEndIcon from '@material-ui/icons/CallEnd';
import ChatIcon from '@material-ui/icons/Chat';
import Chat from '@material-ui/icons/Chat';

const Options = ({ children }) => {
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

    setShowEditor,
  } = useContext(SocketContext);

  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (call.isRecievedCall && !callAccepted) {
      console.log('someone is calling..');
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [call.isRecievedCall]);

  return (
    <>
      <div className={showEditor ? 'options' : 'options w100'}>
        <IconButton
          aria-label='more'
          aria-controls='long-menu'
          aria-haspopup='true'
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        {console.log(myMicStatus)}
        {console.log(myVideoStatus)}
        <button
          onClick={() => updateVideoStatus()}
          className={!myVideoStatus ? 'bg-grey' : 'bg-white'}
        >
          {myVideoStatus ? <VideocamIcon /> : <VideocamOffIcon />}
        </button>
        {/* {callAccepted && !callEnded && ( */}
        <button className='red-btn ' type='primary' onClick={() => endCall()}>
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
        <button type='primary'>
          <ChatIcon />
        </button>
        <Menu
          id='long-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <div className='options-menu'>
            <div>
              <CopyToClipboard
                text={me}
                onCopy={() => {
                  message.success('Id Copied');
                }}
              >
                <Button type='primary'>Share your Id</Button>
              </CopyToClipboard>
            </div>

            <div>
              <button onClick={() => setShowEditor(!showEditor)}>
                {showEditor ? 'Hide Editor' : 'Show Editor'}
              </button>
            </div>

            <div>
              <input
                type='text'
                placeholder='Enter Id to call'
                value={callId}
                onChange={(e) => setCallId(e.target.value)}
              />
            </div>

            {/* {!callAccepted && !callEnded && ( */}
            <div>
              <Button type='primary' onClick={() => callUser(callId)}>
                Join
              </Button>
            </div>
            {/* )} */}
          </div>
        </Menu>

        <Dialog
          open={open}
          // onClose={handleClose}
          // PaperComponent={PaperComponent}
          aria-labelledby='draggable-dialog-title'
        >
          <DialogTitle>hi</DialogTitle>
          <DialogContent>
            <p>{call.from} wants to join in this call</p>
            <Button
              type='primary'
              onClick={() => {
                answerCall();
                setOpen(false);
              }}
            >
              Answer
            </Button>
            <Button type='primary' onClick={() => setOpen(false)}>
              Decline
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Options;
