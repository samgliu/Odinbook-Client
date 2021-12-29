import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';
const { v4: uuidv4 } = require('uuid');

function Chat({ uid, tid, chattingWith, handleChatClosed }) {
    const [text, setText] = useState('');
    const [chatHistory, setChatHistory] = useState('');
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
                setChatHistory(res.data);
                setRoomId(res.room._id);
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
                console.log('msg sent');
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }

    function handleChatClose(e) {
        e.preventDefault();
        handleChatClosed();
    }
    useEffect(() => {
        // console.log('in useEffect', allRooms);
        if (uid && tid && accessToken) {
            fetchChatHistory(uid, tid);
        }
    }, [setChatHistory, uid, tid, setFriendName]);

    return (
        <div>
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
                    {chatHistory && chatHistory.history ? (
                        <div>
                            {chatHistory.history.map((chat) => {
                                return (
                                    <div
                                        key={chat._id}
                                        className={
                                            chat.SendBy.Username ===
                                            user.Username
                                                ? 'rightchatItem'
                                                : 'leftchatItem'
                                        }
                                    >
                                        <div className="chatItem">
                                            <div>{chat.Text}</div>
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
