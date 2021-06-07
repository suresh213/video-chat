import React, { useState, useEffect, useCallback, useContext } from 'react';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import './Editor.css';
import saveAs from 'file-saver';
import { pdfExporter } from 'quill-to-pdf';
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
    otherUser,
    socketState: socket,
  } = useContext(SocketContext);
  
  const [name, setName] = useState('Untitled');
  const [quill, setQuill] = useState(null);

  useEffect(() => {
    if (!socket || !quill || !otherUser) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta, otherUser);
    };

    quill.on('text-change', handler);
    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;
    const handler = (delta) => {
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
    setQuill(q);
  }, []);

  const downloadPdf = async () => {
    // toast.info('downlading');
    const delta = quill.getContents();
    const pdfAsBlob = await pdfExporter.generatePdf(delta);
    saveAs(pdfAsBlob, `${name}.pdf`);
  };

  return (
    <>
      <div className='editor slide-left' ref={editorRef}></div>
    </>
  );
};

export default Editor;
