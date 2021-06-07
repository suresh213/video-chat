import React, { useState, useEffect, useCallback, useContext } from 'react';
import { message } from 'antd';
import { SocketContext } from '../../SocketContext';
import EventNoteIcon from '@material-ui/icons/EventNote';
import './Notes.css';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import Menu from '@material-ui/core/Menu';
import { jsPDF } from 'jspdf';

const Notes = () => {
  const { notes, setNotes } = useContext(SocketContext);
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
      {!mobileView && (
        <button className='tooltip' type='primary' onClick={handleClick}>
          <EventNoteIcon />
          <span className='tooltiptext'>Notes</span>
        </button>
      )}
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
