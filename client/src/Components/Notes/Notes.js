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
import EventNoteIcon from '@material-ui/icons/EventNote';
import './Notes.css';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import Menu from '@material-ui/core/Menu';
import { jsPDF } from 'jspdf';

import EventNote from '@material-ui/icons/EventNote';
const Notes = () => {
  const { notes, setNotes, notesOpen, setNotesOpen } =
    useContext(SocketContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const downLoadAsPdf = () => {
    if (notes.trim().length == 0) {
      message.error('Please write some text to download');
      return;
    }
    const pdfDoc = new jsPDF();
    pdfDoc.text(notes, 10, 10);
    message.success('Your notes is downloading');
    pdfDoc.save('meet notes.pdf');
  };

  return (
    <>
      <button className='tooltip' type='primary' onClick={handleClick}>
        <EventNoteIcon />
        <span class='tooltiptext'>Notes</span>
      </button>
      <Menu
        id='long-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div className='notes'>
          <div className='btn-div'>
            <div>
              <h3>Notes</h3>
            </div>
            <div className='flex-btns-div'>
              <button type='primary' onClick={downLoadAsPdf}>
                <GetAppIcon />
              </button>
              <button type='primary' onClick={handleClose}>
                <CloseIcon />
              </button>
            </div>
          </div>

          <textarea
            type='text'
            placeholder='You can take your notes here'
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
          />
        </div>
      </Menu>
    </>
  );
};

export default Notes;
