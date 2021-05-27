import React, { useContext, useState } from 'react';
import { SocketContext } from '../../SocketContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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
  return (
    <>
      <div>
        <CopyToClipboard text={me}>
          <button>Copy to clipboard</button>
        </CopyToClipboard>
        <input
          type='text'
          value={callId}
          onChange={(e) => setCallId(e.target.value)}
        />

        {callAccepted && !callEnded ? (
          <button onClick={() => endCall()}>End</button>
        ) : (
          <button onClick={() => callUser(callId)}>Call</button>
        )}
        {children}
      </div>
    </>
  );
};

export default Options;
