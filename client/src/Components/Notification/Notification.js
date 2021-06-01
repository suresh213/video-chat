import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../SocketContext';
import { Input, Button, Tooltip, Modal, message } from 'antd';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const Notification = () => {
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

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (call.isRecievedCall && !callAccepted) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    console.log(open)
  }, [call.isRecievedCall]);

  return (
    <Modal
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
    </Modal>
  );
};

export default Notification;
