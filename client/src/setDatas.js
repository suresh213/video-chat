import { useContext } from 'react';
import { SocketContext } from './SocketContext';

export const setDatas = () => {
  const {
    setCallAccepted,
    setCallEnded,
    setName,
    setStream,
    setShowEditor,
    setShowChatBox,
    setMessages,
    setNotes,
    setNotesOpen,
    setMeetingCode,
    setOtherUserStream,
    setNewMeet,
    setOtherUser,
    setMyVideoStatus,
    setMyMicStatus,
    setUserMicStatus,
    setUserVideoStatus,
  } = useContext(SocketContext);

  setCallAccepted(false);
  setCallEnded(true);
  setName('');
  setStream(null);
  setShowEditor(false);
  setShowChatBox(false);
  setMessages([]);
  setNotes('');
  setNotesOpen(false);
  setMeetingCode(null);
  setOtherUserStream(null);
  setNewMeet(false);
  setOtherUser(null);
  setMyVideoStatus(true);
  setMyMicStatus(false);
  setUserMicStatus(false);
  setUserVideoStatus(false);
};
