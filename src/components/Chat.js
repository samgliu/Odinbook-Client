import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';
const { v4: uuidv4 } = require('uuid');

function Chat({
    uid,
    tid,
    chattingWith,
    handleChatClosed,
    handleSocketSend,
    displayClass,
    arrivalMessage,
    isChatOpen,
}) {
    const [text, setText] = useState('');
    const [chatHistory, setChatHistory] = useState('');
    const [room, setRoom] = useState(null);
    const [friendName, setFriendName] = useState('');
    const [roomId, setRoomId] = useState(null);
    const [targetId, setTargetId] = useState(null);
    const navigate = useNavigate();
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
        timeSince,
    } = useContext(GlobalContext);
    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };
    /*
    async function extractFriendName(data) {
        if (data && data.Members) {
            console.log(data.Members);
            if (data.Members[0].Username === user.Username) {
                return (
                    data.Members[1].Firstname + ' ' + data.Members[1].Lastname
                );
            } else {
                return (
                    data.Members[0].Firstname + ' ' + data.Members[0].Lastname
                );
            }
        }
    }
*/
    async function fetchChatHistory(userId, targetId) {
        try {
            setTargetId(targetId);
            const params = `/room`;
            const res = await apiClient.post(
                params,
                { senderId: userId, receiverId: targetId },
                accessHeader
            );

            if (res.status === 200) {
                setChatHistory(res.data.history);
                setRoom(res.data.room);
                setRoomId(res.data.room._id);
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }

    async function sendMessage() {
        try {
            const params = `/send-message`;
            console.log(targetId);
            const data = {
                text: text,
                receiverId: targetId,
                senderId: user._id,
                roomId: roomId,
            };
            const res = await apiClient.post(params, data, accessHeader);

            if (res.status === 200) {
                handleSocketSend(targetId, text);
                // local sender processing
                data._id = uuidv4();
                data.Timestamp = new Date();
                handleLocalSenderNewMessage(data);
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }

    function handleChatClose(e) {
        e.preventDefault();
        handleChatClosed();
    }

    async function handleLocalReceiverNewMessage(newMessage) {
        setChatHistory([...chatHistory, newMessage]);
    }

    async function handleLocalSenderNewMessage(newMessage) {
        setChatHistory([...chatHistory, newMessage]);
    }

    useEffect(() => {
        // console.log('in useEffect', allRooms);
        if (displayClass === 'active' && uid && tid && accessToken) {
            fetchChatHistory(uid, tid);
        }
    }, [setChatHistory, uid, tid, setFriendName, displayClass]);

    useEffect(() => {
        // console.log('in useEffect', allRooms);
        if (displayClass === 'active' && uid && tid && accessToken) {
            fetchChatHistory(uid, tid);
        }
    }, [arrivalMessage]);

    useEffect(() => {
        if (arrivalMessage && isChatOpen) {
            console.log(arrivalMessage);
            const newMessage = {
                _id: uuidv4(),
                roomId: roomId,
                Text: arrivalMessage.text,
                SendBy: arrivalMessage.SendBy,
                receiverId: arrivalMessage.receiverId,
                Timestamp: arrivalMessage.Timestamp,
            };
            handleLocalReceiverNewMessage(newMessage);
        }
    }, [arrivalMessage]);

    return (
        <div className={displayClass}>
            <div>Chatting with {chattingWith}</div>
            <button
                onClick={(e) => {
                    handleChatClose(e);
                }}
            >
                Close
            </button>
            <div className="chatHistoryWrapper">
                <div className="chatHistoryBox">
                    {chatHistory ? (
                        <div>
                            {chatHistory.map((chat) => {
                                return (
                                    <div
                                        key={chat._id}
                                        className={
                                            String(chat.SendBy) ===
                                            String(user._id)
                                                ? 'rightchatItem'
                                                : 'leftchatItem'
                                        }
                                    >
                                        <div className="chatItem">
                                            <div>{chat.Text || chat.text}</div>
                                            <div className="chatTime">
                                                {timeSince(chat.Timestamp) +
                                                    ' ago'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
                <div className="msgSendBox">
                    <input
                        type="text"
                        placeholder="Message..."
                        onChange={(e) => {
                            setText(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.code === 'Enter') {
                                e.preventDefault();
                                sendMessage();
                                e.target.value = '';
                            }
                        }}
                    />
                    <div
                        className="clickable"
                        onClick={(e) => {
                            e.target.parentNode.firstChild.value = '';
                            e.preventDefault();
                            sendMessage();
                        }}
                    >
                        Send
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
