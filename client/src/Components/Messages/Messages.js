import React, { useState, useEffect, useRef, useContext } from 'react';
import { Button, message, notification } from 'antd';
import { SocketContext } from '../../SocketContext';
import Message from './Message';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
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
    otherUserName,
  } = useContext(SocketContext);

  const [newMessage, setNewMessage] = useState('');
  const msgRef = useRef();

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showChatBox]);

  useEffect(() => {
    socket.on('recieve-message', (data) => {
      setMessages((messages) => [...messages, data]);
        notification.open({
          message: `New Message`,
          description: data.text,
          icon: <MessageOutlined style={{ color: '#108ee9' }} />,
        });
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
    if (e.key === 'Enter') {
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
            <div ref={msgRef}></div>
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
            onKeyPress={handleKeypress}
            placeholder='Enter a message'
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
