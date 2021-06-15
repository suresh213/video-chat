import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, message } from 'antd';
import { SocketContext } from '../../SocketContext';
import Message from './Message';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import './Messages.css';

const Messages = () => {
  const {
    me,
    otherUser,
    socketState: socket,
    showChatBox,
    setShowChatBox,
    messages,
    setMessages,
  } = useContext(SocketContext);

  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    console.log(messages);
  }, []);
  useEffect(() => {
    socket.on('recieve-message', (data) => {
      setMessages((messages) => [...messages, data]);
    });
  }, []);

  const sendMessage = () => {
    if (newMessage.trim().length <= 0) {
      message.error('Enter some message');
      return;
    }

    let tempMessage = { text: newMessage.trim(), user: me };
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

  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  };

  return (
    <Dialog
      open={showChatBox}
      onClose={handleClose}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle>
        <div className='btn-div'>
          <h3>Chatbox</h3>
          <button type='primary' onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>
      </DialogTitle>
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
              setNewMessage(e.target.value);
            }}
            
            placeholder='Enter a message'
            required
          />
          <Button
            type='primary'
            onKeyPress={handleKeypress}
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
