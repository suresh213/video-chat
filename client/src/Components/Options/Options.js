import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../SocketContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './Options.css';
import 'antd/dist/antd.css';

import { Input, Button, Tooltip, Modal, message } from 'antd';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
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
  } = useContext(SocketContext);
  const [open, setOpen] = useState(true);

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
      <div className='options'>
        <CopyToClipboard
          text={me}
          onCopy={() => {
            message.success('Id Copied');
          }}
        >
          <Button type='primary'>Share your Id</Button>
        </CopyToClipboard>
        <input
          type='text'
          placeholder='Enter Id to call'
          value={callId}
          onChange={(e) => setCallId(e.target.value)}
        />

        {callAccepted && !callEnded ? (
          <Button type='primary' onClick={() => endCall()}>
            End
          </Button>
        ) : (
          <Button type='primary' onClick={() => callUser(callId)}>
            Join
          </Button>
        )}
        {/* <Modal
          title='Incoming Call'
          visible={open}
          onOk={() => setOpen(false)}
          // onCancel={handleCancel}
          footer={null}
        >
          <p>{call.from} wants to join in this call</p>
          <button
            onClick={() => {
              answerCall();
              setOpen(false);
            }}
          >
            Answer
          </button>
          <button onClick={() => setOpen(false)}>Decline</button>
        </Modal> */}
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
