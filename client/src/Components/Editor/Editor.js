import React, { useState, useEffect, useCallback, useContext } from 'react';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import './Editor.css';
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

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean'],
];

const Editor = () => {
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
  } = useContext(SocketContext);

  const history = useHistory();
  const { id: documentId } = me;
  const [name, setName] = useState('Untitled');
  const [isEdit, setIsEdit] = useState(false);
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  console.log(useContext(SocketContext));
  useEffect(() => {
    const s = io('http://localhost:5000');
    setSocket(s);

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;
    socket.emit('get-document', documentId);
// documentId=me;
    socket.once('load-document', (document) => {
      console.log(document);
      quill.setContents(document);
      quill.enable();
    });
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      // console.log(delta);
      socket.emit('send-changes', delta);
    };

    quill.on('text-change', handler);
    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('change-name', name);
  }, [isEdit]);

  useEffect(() => {
    if (!socket) return;
    socket.on('recieve-name-change', (name) => {
      console.log(name);
      setName(name);
    });
    return () => {
      socket.off('recieve-name-change', (name) => {
        setName(name);
      });
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !quill) return;
    const handler = (delta) => {
      console.log(delta);
      quill.updateContents(delta);
    };

    socket.on('recieve-changes', handler);
    return () => {
      socket.off('recieve-changes', handler);
    };
  }, [socket, quill]);

  const editorRef = useCallback((editorWrapper) => {
    if (editorWrapper === null) return;

    editorWrapper.innerHTML = '';
    const editor = document.createElement('div');
    editorWrapper.append(editor);

    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
      },
    });
    q.setText('Loading...');
    q.disable();
    setQuill(q);
  }, []);

  const downloadPdf = async () => {
    // toast.info('downlading');
    const delta = quill.getContents();
    const pdfAsBlob = await pdfExporter.generatePdf(delta);
    saveAs(pdfAsBlob, `${name}.pdf`);
  };

  const openNewDoc = () => {
    history.push(`/document/${uuidV4()}`);
    window.location.reload();
  };

  return (
    <>
      {/* <div className='head'>
        <div>
          <h4>Docs</h4>
          {!isEdit ? (
            <p
              onClick={() => {
                setIsEdit(!isEdit);
              }}
            >
              {name}
            </p>
          ) : (
            <div>
              <input
                type='text'
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <button
                onClick={() => {
                  setIsEdit(!isEdit);
                }}
              >
                ok
              </button>
            </div>
          )}
        </div>

        <div className='document-options'>
          <button onClick={downloadPdf}>Download</button>
          <button onClick={openNewDoc}>New</button>
          <CopyToClipboard text={`${CLIENT_ENDPOINT}/document/${documentId}`}>
            <Button
              type='primary'
              onClick={() => toast.success('URL Copied to clipboard')}
            >
              Share
            </Button>
          </CopyToClipboard>
        </div>
      </div> */}
      {/* <CopyToClipboard text={`${CLIENT_ENDPOINT}/document/${documentId}`}>
        <Button
          type='primary'
          onClick={() => message.success('URL Copied to clipboard')}
        >
          Share
        </Button>
      </CopyToClipboard> */}
      <div className='editor' ref={editorRef}></div>
    </>
  );
};

export default Editor;
