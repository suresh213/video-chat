import React, { useState, useEffect, useCallback, useContext } from 'react';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import { io } from 'socket.io-client';
// import { CLIENT_ENDPOINT, SERVER_ENDPOINT } from '../constants';
import { useParams, useHistory } from 'react-router-dom';
import saveAs from 'file-saver';
import { pdfExporter } from 'quill-to-pdf';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { v4 as uuidV4 } from 'uuid';
import { Button, message } from 'antd';
// import { toast } from 'react-toastify';
import { SocketContext } from '../../SocketContext';
import Message from './Message';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import './Messages.css';

const Messages = () => {
  const {
    // socketObj,
    me,
    call,
    callAccepted,
    callEnded,
    // name,
    // setName,
    myVideo,
    userVideo,
    stream,
    answerCall,
    callUser,
    endCall,
    otherUser,
    socketState: socket,
    showChatBox,
    setShowChatBox,
    messages,
    setMessages,
  } = useContext(SocketContext);

  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('recieve-message', (data) => {
      setMessages((messages) => [...messages, data]);
    });
  }, []);

  const sendMessage = () => {
    if (newMessage.length <= 0) {
      message.error('Enter some message');
      return;
    }

    let tempMessage = { text: newMessage, user: me };
    socket.emit('send-message', {
      data: tempMessage,
      userToSend: otherUser,
    });
    setMessages((messages) => [...messages, tempMessage]);
    setNewMessage('');
  };

  const handleClose = () => {
    setShowChatBox(!showChatBox);
  };
  console.log(showChatBox);
  return (
    <Dialog
      open={showChatBox}
      onClose={handleClose}
      // PaperComponent={PaperComponent}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle>ChatBox</DialogTitle>
      <DialogContent>
        <div className='outer-div'>
          <div className='messages scrollbar'>
            {messages.length > 0 ? (
              messages.map((item, i) => (
                <Message message={item} key={i} item={i} />
              ))
            ) : (
              <h3>No messages</h3>
            )}
          </div>
        </div>
        <div className='inputs'>
          {' '}
          <input
            type='text'
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value.trim());
            }}
            placeholder='Enter a message'
            required
          />
          <Button
            type='primary'
            onClick={() => {
              sendMessage();
            }}
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Messages;
