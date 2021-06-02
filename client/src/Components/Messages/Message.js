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
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import './Messages.css';

const Message = (props) => {
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
  } = useContext(SocketContext);
  return (
    <div className={props.message.user === me ? 'message tr' : 'message tl'}>
      {props.message.text}
    </div>
  );
};

export default Message;
