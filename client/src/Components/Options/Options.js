import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../SocketContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './Options.css';
import { Input, Button, Tooltip, Modal, message } from 'antd';

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

  // useEffect(() => {
  //   if (call.isRecievedCall && !callAccepted) {
  //     setOpen(true);
  //   } else {
  //     setOpen(false);
  //   }
  //   console.log(open);
  // }, [call.isRecievedCall]);

  return (
    <>
      <div className='options'>
        <CopyToClipboard
          text={me}
          onClick={() => {
            message.success('Copied');
          }}
        >
          <button>Share your Id</button>
        </CopyToClipboard>
        <input
          type='text'
          placeholder='Enter Id to call'
          value={callId}
          onChange={(e) => setCallId(e.target.value)}
        />

        {callAccepted && !callEnded ? (
          <button onClick={() => endCall()}>End</button>
        ) : (
          <button onClick={() => callUser(callId)}>Join</button>
        )}
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
      </div>
    </>
  );
};

export default Options;
